// app.js
const express = require('express');
const app = express();
const port = 3000;

// Configura o diretório de views e o EJS como engine de templates
app.set('view engine', 'ejs');
app.set('views', './views');  // Diretório das views (pasta 'views')

// Rota para a página inicial (essa rota é para a raiz '/')
app.get('/', (req, res) => {
  res.send('Bem-vindo à página inicial!');
});

// Rota para exibir o post (essa rota é para '/post')
app.get('/post', (req, res) => {
  const post = {
    titulo: 'Introdução ao EJS',
    autor: 'João Silva',
    data: '12 de Maio de 2025',
    conteudo: 'EJS é uma linguagem de template que permite incluir JavaScript em HTML de forma simples.'
  };

  res.render('post', { post });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
