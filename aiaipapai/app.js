const readline = require('readline');
const { adicionarTarefa } = require('./adicionar');
const { listarTarefas } = require('./listar');
const { concluirTarefa } = require('./concluir');
const { removerTarefa } = require('./remover');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para exibir o menu
function exibirMenu() {
  console.log('\nMenu do Gerenciador de Tarefas');
  console.log('1. Adicionar Tarefa');
  console.log('2. Listar Tarefas');
  console.log('3. Concluir Tarefa');
  console.log('4. Remover Tarefa');
  console.log('5. Sair');
}

// Função principal que vai controlar o menu interativo
function iniciarMenu() {
  exibirMenu();

  rl.question('Escolha uma opção: ', (opcao) => {
    switch (opcao) {
      case '1':
        rl.question('Digite a descrição da nova tarefa: ', (descricao) => {
          adicionarTarefa(descricao);
          iniciarMenu(); // Voltar ao menu após adicionar
        });
        break;

      case '2':
        listarTarefas();
        iniciarMenu(); // Voltar ao menu após listar
        break;

      case '3':
        rl.question('Digite o ID da tarefa a ser concluída: ', (id) => {
          concluirTarefa(parseInt(id));
          iniciarMenu(); // Voltar ao menu após concluir
        });
        break;

      case '4':
        rl.question('Digite o ID da tarefa a ser removida: ', (id) => {
          removerTarefa(parseInt(id));
          iniciarMenu(); // Voltar ao menu após remover
        });
        break;

      case '5':
        console.log('Saindo do gerenciador de tarefas...');
        rl.close();
        break;

      default:
        console.log('Opção inválida. Tente novamente.');
        iniciarMenu(); // Voltar ao menu caso a opção seja inválida
        break;
    }
  });
}

// Iniciar o menu
iniciarMenu();
