const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/appointments.db');

db.serialize(() => {
  // Tabela para Advogados
  db.run(`CREATE TABLE IF NOT EXISTS advogados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo TEXT NOT NULL,
    telefone TEXT,
    email TEXT UNIQUE NOT NULL,
    especialidade TEXT
  )`);

  // Tabela para Clientes
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo TEXT NOT NULL,
    telefone TEXT,
    email TEXT UNIQUE NOT NULL
  )`);

  // Tabela para Agendamentos (atualizada com novos campos)
  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    advogado_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    hora TEXT NOT NULL,
    tipo_atendimento TEXT NOT NULL,
    horario_chegada TEXT,
    status TEXT DEFAULT 'Aguardando atendimento',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (advogado_id) REFERENCES advogados(id)
  )`);

  // Tabela para Histórico de Atendimentos (seprado para facilitar consultas)
  db.run(`CREATE TABLE IF NOT EXISTS historico_atendimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL,
    status_final TEXT NOT NULL,
    observacoes TEXT,
    data_registro TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
  )`);
});

module.exports = db;