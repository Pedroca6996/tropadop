const express = require('express');
const app = express();

// Rota para a página inicial
app.get('/', (req, res) => {
res.send('PEDRO HENRICK DE OLIVEIRA ROSA!');
});

// Rota para a página "sobre"
app.get('/sobre', (req, res) => {
res.send('Página sobre nós');
});

app.get('/usuarios/:id', (req, res) => {
const userId = req.params.id;
res.send("Exibindo informações do usuário", {userId});
});

app.listen(3000, () => {
console.log('Servidor rodando na porta 3000');
});