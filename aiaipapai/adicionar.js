const { lerTarefas, salvarTarefas } = require('./dados');

function adicionarTarefa(descricao) {
  const tarefas = lerTarefas();
  const novaTarefa = {
    id: tarefas.length + 1,
    descricao: descricao,
    concluida: false
  };
  tarefas.push(novaTarefa);
  salvarTarefas(tarefas);
  console.log('Tarefa adicionada com sucesso!');
}

module.exports = { adicionarTarefa };
