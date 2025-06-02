const { lerTarefas, salvarTarefas } = require('./dados');

function concluirTarefa(id) {
  const tarefas = lerTarefas();
  const tarefa = tarefas.find(t => t.id === id);
  
  if (tarefa) {
    tarefa.concluida = true;
    salvarTarefas(tarefas);
    console.log(`Tarefa ${id} concluída!`);
  } else {
    console.log(`Tarefa com ID ${id} não encontrada.`);
  }
}

module.exports = { concluirTarefa };
