// menuModulos.js
const readline = require("readline");

// Dados dos módulos
const modulos = {
  1: {
    nome: "Módulo 1 – Introdução à Lógica de Programação",
    definicao: "Estudo dos fundamentos da lógica computacional, que permite criar soluções passo a passo para problemas. Envolve o uso de variáveis, operadores, estruturas de decisão (como if e switch) e estruturas de repetição (como for e while). É a base para aprender qualquer linguagem de programação.",
    objetivo: "Desenvolver o raciocínio lógico para criar algoritmos eficientes que resolvem problemas reais, como automatizar tarefas ou organizar informações."
  },
  2: {
    nome: "Módulo 2 – Estruturas de Dados Básicas Aplicadas",
    definicao: "Explora formas de organizar, armazenar e manipular dados na memória. Inclui arrays (vetores), matrizes (tabelas), listas encadeadas (dados conectados entre si), pilhas (estrutura LIFO) e filas (estrutura FIFO).",
    objetivo: "Permitir que o aluno escolha a estrutura mais adequada para resolver problemas específicos, otimizando o uso de memória e tempo de processamento."
  },
  3: {
    nome: "Módulo 3 – Algoritmos de Ordenação e Busca",
    definicao: "Estudo dos algoritmos que organizam e localizam dados em estruturas. Inclui ordenações como Bubble Sort, Selection Sort, Insertion Sort, Merge Sort e Quick Sort; e buscas como Linear e Binária.",
    objetivo: "Capacitar o aluno a criar sistemas que consigam localizar informações de forma rápida e eficiente, especialmente em bases com muitos registros."
  },
  4: {
    nome: "Módulo 4 – Estruturas de Dados Avançadas e Aplicações",
    definicao: "Introdução a estruturas mais complexas como árvores binárias de busca (hierarquia de dados com inserção, busca e remoção eficientes) e grafos (representação de relações/conexões entre dados, como mapas ou redes).",
    objetivo: "Fornecer ferramentas para criar sistemas que lidam com grandes volumes de dados e relações complexas, como sistemas de decisão jurídica ou redes de atendimento."
  },
  5: {
    nome: "Módulo 5 – Resolução de Problemas Computacionais",
    definicao: "Aplicação prática de algoritmos e estruturas para resolver desafios do mundo real. Aborda programação estruturada, modularização do código (dividir em partes menores) e estratégias de decomposição de problemas complexos.",
    objetivo: "Ensinar o aluno a projetar, implementar e testar soluções completas para problemas computacionais, simulando demandas reais, como sistemas jurídicos internos ou automações administrativas."
  }
};

// Interface para entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Exibir menu
function exibirMenu() {
  console.log("\n=== MENU DE MÓDULOS ===");
  console.log("1 - Módulo 1");
  console.log("2 - Módulo 2");
  console.log("3 - Módulo 3");
  console.log("4 - Módulo 4");
  console.log("5 - Módulo 5");
  console.log("0 - Sair");

  rl.question("\nEscolha o número do módulo: ", (resposta) => {
    if (resposta === "0") {
      console.log("\nEncerrando o programa...");
      rl.close();
      return;
    }

    const modulo = modulos[resposta];
    if (modulo) {
      console.log(`\n${modulo.nome}`);
      console.log(`\n📘 Definição:\n${modulo.definicao}`);
      console.log(`\n🎯 Objetivo:\n${modulo.objetivo}`);
    } else {
      console.log("\n❌ Opção inválida. Tente novamente.");
    }

    // Voltar ao menu
    exibirMenu();
  });
}

// Iniciar
exibirMenu();
