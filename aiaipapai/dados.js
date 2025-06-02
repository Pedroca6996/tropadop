const fs = require('fs');
const path = require('path');

const caminhoArquivo = path.join(__dirname, 'tarefas.json');

function lerTarefas() {
  const dados = fs.readFileSync(caminhoArquivo);
  return JSON.parse(dados);
}

function salvarTarefas(tarefas) {
  fs.writeFileSync(caminhoArquivo, JSON.stringify(tarefas, null, 2));
}

module.exports = { lerTarefas, salvarTarefas };
