const express = require('express');
const app = express();

// Define o diretório de views
app.set('views', './views');

// Define o mecanismo de template
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
const dataAtual = new Date();
res.render('index', {
nome: '..PEDRO HENRICK DE OLIVEIRA ROSA..',
data: dataAtual.toLocaleDateString()
});
});

app.listen(3000, () => {
console.log('Servidor rodando na porta 3000');
});