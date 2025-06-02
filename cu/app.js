const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db'); // Seu arquivo db.js com a configuração do SQLite

const app = express();
const PORT = 3008;

// Configuração do EJS e diretório de arquivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Rota Principal
app.get('/', (req, res) => {
  res.render('index');
});

// --- Rotas para Cadastro de Advogados ---
app.get('/advogados/cadastro', (req, res) => {
  res.render('cadastro_advogado'); // Nova página EJS para cadastro de advogados
});

app.post('/advogados/cadastro', (req, res) => {
  const { nome_completo, telefone, email, especialidade } = req.body;
  db.run(
    `INSERT INTO advogados (nome_completo, telefone, email, especialidade) VALUES (?, ?, ?, ?)`,
    [nome_completo, telefone, email, especialidade],
    function (err) {
      if (err) {
        console.error('Erro ao cadastrar advogado:', err.message);
        return res.status(500).send('Erro ao cadastrar advogado.');
      }
      console.log(`Advogado ${nome_completo} cadastrado com ID: ${this.lastID}`);
      res.redirect('/advogados/lista'); // Redireciona para a lista de advogados
    }
  );
});

app.get('/advogados/lista', (req, res) => {
  db.all(`SELECT * FROM advogados ORDER BY nome_completo`, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar advogados:', err.message);
      return res.status(500).send('Erro ao buscar advogados.');
    }
    res.render('lista_advogados', { advogados: rows }); // Nova página EJS para listar advogados
  });
});

// --- Rotas para Cadastro de Clientes ---
app.get('/clientes/cadastro', (req, res) => {
  res.render('cadastro_cliente'); // Nova página EJS para cadastro de clientes
});

app.post('/clientes/cadastro', (req, res) => {
  const { nome_completo, telefone, email } = req.body;
  db.run(
    `INSERT INTO clientes (nome_completo, telefone, email) VALUES (?, ?, ?)`,
    [nome_completo, telefone, email],
    function (err) {
      if (err) {
        console.error('Erro ao cadastrar cliente:', err.message);
        return res.status(500).send('Erro ao cadastrar cliente.');
      }
      console.log(`Cliente ${nome_completo} cadastrado com ID: ${this.lastID}`);
      res.redirect('/clientes/lista'); // Redireciona para a lista de clientes
    }
  );
});

app.get('/clientes/lista', (req, res) => {
  db.all(`SELECT * FROM clientes ORDER BY nome_completo`, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err.message);
      return res.status(500).send('Erro ao buscar clientes.');
    }
    res.render('lista_clientes', { clientes: rows }); // Nova página EJS para listar clientes
  });
});


// --- Rotas para Agendamento de Atendimentos (Atualizado) ---
app.get('/agendar', async (req, res) => {
  try {
    const advogados = await new Promise((resolve, reject) => {
      db.all('SELECT id, nome_completo FROM advogados', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    const clientes = await new Promise((resolve, reject) => {
      db.all('SELECT id, nome_completo FROM clientes', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    res.render('agendar', { advogados, clientes }); // Passa advogados e clientes para a página agendar
  } catch (err) {
    console.error('Erro ao carregar dados para agendamento:', err.message);
    res.status(500).send('Erro ao carregar dados para agendamento.');
  }
});

app.post('/agendar', (req, res) => {
  const { cliente_id, advogado_id, data, hora, tipo_atendimento } = req.body;

  // Validação básica
  if (!cliente_id || !advogado_id || !data || !hora || !tipo_atendimento) {
    return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos.');
  }

  db.run(
    `INSERT INTO appointments (cliente_id, advogado_id, data, hora, tipo_atendimento, status) VALUES (?, ?, ?, ?, ?, ?)`,
    [cliente_id, advogado_id, data, hora, tipo_atendimento, 'Aguardando atendimento'],
    function (err) {
      if (err) {
        console.error('Erro ao agendar atendimento:', err.message);
        return res.status(500).send('Erro ao agendar atendimento.');
      }
      console.log(`Atendimento agendado com ID: ${this.lastID}`);
      res.redirect('/fila'); // Redireciona para a fila após o agendamento
    }
  );
});


// --- Rotas para Controle de Chegada e Gerenciamento da Fila (Atualizado) ---
app.get('/fila', (req, res) => {
  const query = `
    SELECT
      a.id,
      c.nome_completo AS cliente_nome,
      adv.nome_completo AS advogado_nome,
      a.data,
      a.hora,
      a.tipo_atendimento,
      a.horario_chegada,
      a.status
    FROM
      appointments AS a
    JOIN
      clientes AS c ON a.cliente_id = c.id
    JOIN
      advogados AS adv ON a.advogado_id = adv.id
    WHERE
      a.status IN ('Aguardando atendimento', 'Em atendimento')
    ORDER BY
      a.data, a.hora, a.horario_chegada IS NULL, a.horario_chegada;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar agendamentos na fila:', err.message);
      return res.status(500).send('Erro ao buscar agendamentos na fila.');
    }
    res.render('fila', { agendamentos: rows }); // Sua página fila.ejs será atualizada
  });
});

app.post('/fila/registrar-chegada/:id', (req, res) => {
  const { id } = req.params;
  const horario_chegada = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Obtém a hora atual formatada

  db.run(
    `UPDATE appointments SET horario_chegada = ? WHERE id = ?`,
    [horario_chegada, id],
    function (err) {
      if (err) {
        console.error('Erro ao registrar chegada:', err.message);
        return res.status(500).send('Erro ao registrar chegada.');
      }
      console.log(`Chegada registrada para agendamento ID: ${id}`);
      res.redirect('/fila');
    }
  );
});

// --- Rotas para Atualização de Status do Atendimento ---
app.post('/atendimento/status/:id', (req, res) => {
  const { id } = req.params;
  const { status, observacoes } = req.body;

  if (!status) {
    return res.status(400).send('Status do atendimento é obrigatório.');
  }

  db.run(
    `UPDATE appointments SET status = ? WHERE id = ?`,
    [status, id],
    function (err) {
      if (err) {
        console.error('Erro ao atualizar status do atendimento:', err.message);
        return res.status(500).send('Erro ao atualizar status do atendimento.');
      }

      // Se o status for final (Atendido, Faltou, Remarcado), registra no histórico
      if (['Atendido', 'Faltou', 'Remarcado'].includes(status)) {
        db.run(
          `INSERT INTO historico_atendimentos (appointment_id, status_final, observacoes) VALUES (?, ?, ?)`,
          [id, status, observacoes || null],
          function (err) {
            if (err) {
              console.error('Erro ao registrar histórico:', err.message);
              // Não impede a atualização do status principal, mas registra o erro
            }
            console.log(`Status do atendimento ID ${id} atualizado para ${status} e histórico registrado.`);
            res.redirect('/fila');
          }
        );
      } else {
        console.log(`Status do atendimento ID ${id} atualizado para ${status}.`);
        res.redirect('/fila');
      }
    }
  );
});

// --- Rotas para Histórico de Atendimentos ---
app.get('/historico', async (req, res) => {
  const { cliente_id, advogado_id } = req.query; // Filtros opcionais

  let query = `
    SELECT
      ha.id,
      a.id AS appointmentId,
      c.nome_completo AS cliente_nome,
      adv.nome_completo AS advogado_nome,
      a.data,
      a.hora,
      a.tipo_atendimento,
      ha.status_final,
      ha.observacoes,
      ha.data_registro
    FROM
      historico_atendimentos AS ha
    JOIN
      appointments AS a ON ha.appointment_id = a.id
    JOIN
      clientes AS c ON a.cliente_id = c.id
    JOIN
      advogados AS adv ON a.advogado_id = adv.id
    WHERE 1=1
  `;
  const params = [];

  if (cliente_id) {
    query += ` AND c.id = ?`;
    params.push(cliente_id);
  }
  if (advogado_id) {
    query += ` AND adv.id = ?`;
    params.push(advogado_id);
  }

  query += ` ORDER BY ha.data_registro DESC`;

  try {
    const historico = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    const clientes = await new Promise((resolve, reject) => {
      db.all('SELECT id, nome_completo FROM clientes ORDER BY nome_completo', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    const advogados = await new Promise((resolve, reject) => {
      db.all('SELECT id, nome_completo FROM advogados ORDER BY nome_completo', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    res.render('historico', { historico, clientes, advogados, selectedCliente: cliente_id, selectedAdvogado: advogado_id });
  } catch (err) {
    console.error('Erro ao buscar histórico de atendimentos:', err.message);
    res.status(500).send('Erro ao buscar histórico de atendimentos.');
  }
});


// --- Rota para Próximo Atendimento (Remarcar) ---
app.post('/atendimento/remarcar/:id', (req, res) => {
  const { id } = req.params; // ID do atendimento original que será remarcado
  const { nova_data, nova_hora, tipo_atendimento } = req.body;

  if (!nova_data || !nova_hora || !tipo_atendimento) {
    return res.status(400).send('Nova data, hora e tipo de atendimento são obrigatórios para remarcação.');
  }

  // Primeiro, obtenha os dados do atendimento original para o novo agendamento
  db.get(`SELECT cliente_id, advogado_id FROM appointments WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar agendamento para remarcação:', err.message);
      return res.status(500).send('Erro ao buscar agendamento para remarcação.');
    }
    if (!row) {
      return res.status(404).send('Agendamento original não encontrado.');
    }

    const { cliente_id, advogado_id } = row;

    // Inserir um novo agendamento com a nova data e hora
    db.run(
      `INSERT INTO appointments (cliente_id, advogado_id, data, hora, tipo_atendimento, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [cliente_id, advogado_id, nova_data, nova_hora, tipo_atendimento, 'Aguardando atendimento'],
      function (err) {
        if (err) {
          console.error('Erro ao criar novo agendamento para remarcação:', err.message);
          return res.status(500).send('Erro ao criar novo agendamento para remarcação.');
        }

        // Atualizar o status do agendamento original para 'Remarcado' e registrar no histórico
        db.run(
          `UPDATE appointments SET status = 'Remarcado' WHERE id = ?`,
          [id],
          function (err) {
            if (err) {
              console.error('Erro ao atualizar status do agendamento original para remarcado:', err.message);
              // Não impede a criação do novo agendamento, mas registra o erro
            }

            db.run(
              `INSERT INTO historico_atendimentos (appointment_id, status_final, observacoes) VALUES (?, ?, ?)`,
              [id, 'Remarcado', `Remarcado para ${nova_data} às ${nova_hora}`],
              function (err) {
                if (err) {
                  console.error('Erro ao registrar histórico de remarcação:', err.message);
                }
                console.log(`Agendamento original ID ${id} remarcado. Novo agendamento criado com ID: ${this.lastID}`);
                res.redirect('/fila'); // Redireciona para a fila
              }
            );
          }
        );
      }
    );
  });
});


// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});