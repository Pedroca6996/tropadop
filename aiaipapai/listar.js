const { lerTarefas } = require('./dados');

function listarTarefas() {
  const tarefas = lerTarefas();
  if (tarefas.length === 0) {
    console.log('Não há tarefas para listar.');
  } else {
    tarefas.forEach(tarefa => {
      console.log(`[${tarefa.concluida ? 'X' : ' '}] ${tarefa.descricao}`);
    });
  }
}

module.exports = { listarTarefas };
