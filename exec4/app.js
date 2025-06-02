const express = require('express');
const path = require('path');
const db = require('./database/db');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Rota Inicial (Página Principal)
app.get('/', (req, res) => {
  res.render('index');
});

// Rota Agendar Consulta
app.get('/agendar', (req, res) => {
  res.render('agendar');
});

// Salvar Agendamento
app.post('/agendar', (req, res) => {
  const { nome, advogado, data, hora, recorrencia } = req.body;
  db.run(
    `INSERT INTO appointments (nome, advogado, data, hora, recorrencia) VALUES (?, ?, ?, ?, ?)`,
    [nome, advogado, data, hora, recorrencia],
    (err) => {
      if (err) return res.send("Erro ao salvar");
      res.redirect('/fila');
    }
  );
});

// Rota da Fila de Atendimento
app.get('/fila', (req, res) => {
  db.all(`SELECT * FROM appointments ORDER BY data, hora`, (err, rows) => {
    if (err) return res.send("Erro ao carregar fila");
    res.render('fila', { agendamentos: rows });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
