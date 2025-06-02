const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./database');
const app = express();
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: 'chave_secreta_simples',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

function protegerRota(req, res, next) {
    if (req.session.logado) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Rota principal
app.get('/', (req, res) => {
    res.render('index');
});

// Tela de login
app.get('/login', (req, res) => {
    res.render('login', { erro: null });
});

// Login - POST
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    const sql = `SELECT * FROM usuarios WHERE cpf = ? AND senha = ?`;

    db.get(sql, [usuario, senha], (err, row) => {
        if (err) {
            console.error(err);
            return res.render('login', { erro: 'Erro interno.' });
        }

        if (row) {
            req.session.logado = true;
            req.session.usuarioId = row.id;
            req.session.usuario = row.nome;
            res.redirect('/fila');
        } else {
            res.render('login', { erro: 'CPF ou senha incorretos.' });
        }
    });
});

// Cadastro - GET
app.get('/cadastro', (req, res) => {
    res.render('cadastro', { erro: null });
});

// Cadastro - POST
app.post('/cadastro', (req, res) => {
    const { cpf, senha, nome, nascimento, endereco, email, telefone, notificacoes } = req.body;

    const cpfValido = /^\d{11}$/.test(cpf);
    const senhaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(senha);

    if (!cpfValido) {
        return res.render('cadastro', { erro: 'CPF deve conter exatamente 11 números.' });
    }

    if (!senhaValida) {
        return res.render('cadastro', { erro: 'A senha deve conter pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial.' });
    }

    const sql = `
        INSERT INTO usuarios (cpf, senha, nome, nascimento, endereco, email, telefone, notificacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [cpf, senha, nome, nascimento, endereco, email, telefone, notificacoes], function (err) {
        if (err) {
            console.error("Erro ao cadastrar:", err.message);
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.render('cadastro', { erro: 'Este CPF já está cadastrado.' });
            }
            return res.render('cadastro', { erro: 'Erro ao cadastrar. Tente novamente.' });
        }

        // Login automático após o cadastro
        req.session.logado = true;
        req.session.usuarioId = this.lastID;
        req.session.usuario = nome;
        res.redirect('/'); // redireciona para onde quiser, ex: '/perfil'
    });
});


// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Página de agendamento (protegida)
app.get('/agendar', protegerRota, (req, res) => {
    res.render('agendar');
});

// Agendamento - POST
app.post('/agendar', protegerRota, (req, res) => {
    const { nome, advogado, data, hora, recorrente } = req.body;
    const sql = `
        INSERT INTO agendamentos (nome, advogado, data, hora, recorrente)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [nome, advogado, data, hora, recorrente || 'Não'], function (err) {
        if (err) {
            console.error("Erro ao inserir:", err.message);
            return res.status(500).send("Erro ao salvar agendamento.");
        }
        res.redirect('/fila');
    });
});

// Fila de agendamentos
app.get('/fila', (req, res) => {
    db.all("SELECT * FROM agendamentos ORDER BY data, hora", (err, rows) => {
        if (err) {
            console.error("Erro ao buscar agendamentos:", err.message);
            return res.status(500).send("Erro ao buscar agendamentos.");
        }
        res.render('fila', { agendamentos: rows });
    });
});

// Cancelar agendamento
app.post('/cancelar/:id', protegerRota, (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM agendamentos WHERE id = ?`;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error("Erro ao cancelar agendamento:", err.message);
            return res.status(500).send("Erro ao cancelar agendamento.");
        }
        res.redirect('/fila?cancelado=1');
    });
});

// Página de perfil
app.get('/perfil', protegerRota, (req, res) => {
    const sql = `SELECT * FROM usuarios WHERE id = ?`;
    db.get(sql, [req.session.usuarioId], (err, usuario) => {
        if (err) {
            return res.status(500).send('Erro ao buscar dados do perfil.');
        }
        res.render('perfil', { usuario });
    });
});

// Atualizar perfil e senha
app.post('/perfil/atualizar', protegerRota, (req, res) => {
    const { nome, nascimento, endereco, email, telefone, preferencias, novaSenha, confirmarSenha } = req.body;
    const id = req.session.usuarioId;

    // Lógica para verificar senhas antes de qualquer operação de banco
    if (novaSenha && novaSenha !== confirmarSenha) {
        console.error("As senhas não coincidem durante a atualização do perfil.");
        // Redireciona imediatamente se as senhas não batem
        return res.redirect('/');
    }

    const atualizaDados = `
        UPDATE usuarios SET nome = ?, nascimento = ?, endereco = ?, email = ?, telefone = ?, notificacoes = ?
        WHERE id = ?
    `;

    db.run(atualizaDados, [nome, nascimento, endereco, email, telefone, preferencias, id], function (err) {
        if (err) {
            console.error("Erro ao atualizar dados do perfil (SQL):", err.message);
            // Se houver erro no SQL de atualização de dados, redireciona e para
            return res.redirect('/');
        }

        // Se chegamos aqui, os dados foram (ou tentaram ser) atualizados com sucesso, ou o erro não impediu o fluxo.
        // Agora, lida com a senha, se houver.
        if (novaSenha) {
            const sqlSenha = `UPDATE usuarios SET senha = ? WHERE id = ?`;
            db.run(sqlSenha, [novaSenha, id], function (err) {
                if (err) {
                    console.error("Erro ao atualizar senha (SQL):", err.message);
                    // Se houver erro no SQL de atualização de senha, redireciona e para
                    return res.redirect('/');
                }
                // Se tudo OK com dados e senha, redireciona para a home
                return res.redirect('/');
            });
        } else {
            // Se apenas os dados foram atualizados (sem senha), redireciona para a home
            return res.redirect('/');
        }
    });
});

// Excluir conta com redirecionamento correto
app.post('/perfil/excluir', protegerRota, (req, res) => {
    const { cpf, senha } = req.body;
    const sql = `DELETE FROM usuarios WHERE id = ? AND cpf = ? AND senha = ?`;

    db.run(sql, [req.session.usuarioId, cpf, senha], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Erro ao excluir conta.");
        }

        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
