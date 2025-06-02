const { lerTarefas, salvarTarefas } = require('./dados');

function removerTarefa(id) {
  let tarefas = lerTarefas();
  tarefas = tarefas.filter(tarefa => tarefa.id !== id);
  salvarTarefas(tarefas);
  console.log(`Tarefa ${id} removida!`);
}

module.exports = { removerTarefa };
