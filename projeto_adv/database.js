const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./banco.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados SQLite.');

        // Criar tabela de agendamentos
        db.run(`
            CREATE TABLE IF NOT EXISTS agendamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                advogado TEXT NOT NULL,
                data TEXT NOT NULL,
                hora TEXT NOT NULL,
                recorrente TEXT
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar a tabela agendamentos:', err);
            }
        });

        // Criar tabela de usuários
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cpf TEXT UNIQUE,
                senha TEXT NOT NULL,
                 nome TEXT NOT NULL,
                 nascimento TEXT NOT NULL,
                 endereco TEXT NOT NULL,
                 email TEXT NOT NULL,
                 telefone TEXT NOT NULL,
                 notificacoes TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar a tabela usuarios:', err);
            }
        });
    }
});

module.exports = db;
