// ===============================
// Módulo 2: Estruturas de Dados Básicas
// ===============================

// Array simples: nomes de clientes
let clientes = [
  { id: 1, nome: "João", cpf: "123.456.789-00" },
  { id: 2, nome: "Maria", cpf: "987.654.321-00" },
  { id: 3, nome: "Pedro", cpf: "111.222.333-44" }
];

// Matriz: Agenda da semana
let agenda = [
  ["Seg", "08:00", "João", "Cível"],
  ["Qua", "10:00", "Maria", "Trabalhista"],
  ["Sex", "14:00", "Pedro", "Família"]
];

// Lista Encadeada: Andamentos processuais
class No {
  constructor(texto) {
    this.texto = texto;
    this.proximo = null;
  }
}

class ListaEncadeada {
  constructor() {
    this.inicio = null;
  }

  adicionar(texto) {
    const novo = new No(texto);
    if (!this.inicio) {
      this.inicio = novo;
    } else {
      let atual = this.inicio;
      while (atual.proximo) {
        atual = atual.proximo;
      }
      atual.proximo = novo;
    }
  }

  exibir() {
    let atual = this.inicio;
    console.log("\nAndamentos do processo:");
    while (atual) {
      console.log(`- ${atual.texto}`);
      atual = atual.proximo;
    }
  }
}

const andamentos = new ListaEncadeada();
andamentos.adicionar("Petição inicial protocolada");
andamentos.adicionar("Audiência marcada para 12/06");
andamentos.adicionar("Contestação apresentada");

// Fila: Atendimento por ordem de chegada
let filaAtendimento = [];
filaAtendimento.push("João");
filaAtendimento.push("Maria");
filaAtendimento.push("Pedro");

// Pilha: Histórico de ações para desfazer
let pilhaAcoes = [];
pilhaAcoes.push("Documento enviado");
pilhaAcoes.push("Petição protocolada");
pilhaAcoes.push("Erro: Documento errado");
console.log("\nDesfazendo última ação:", pilhaAcoes.pop());

// ===============================
// Módulo 3: Ordenação e Busca
// ===============================

// Ordenar processos por data (usando sort)
let processos = [
  { numero: 1001, cliente: "João", data: "2024-06-10" },
  { numero: 1003, cliente: "Pedro", data: "2024-05-15" },
  { numero: 1002, cliente: "Maria", data: "2024-04-30" }
];

processos.sort((a, b) => new Date(a.data) - new Date(b.data));
console.log("\nProcessos ordenados por data:");
console.log(processos);

// Busca Binária por número do processo (lista precisa estar ordenada)
function buscaBinaria(lista, numero) {
  let inicio = 0;
  let fim = lista.length - 1;
  while (inicio <= fim) {
    let meio = Math.floor((inicio + fim) / 2);
    if (lista[meio].numero === numero) return lista[meio];
    if (numero < lista[meio].numero) fim = meio - 1;
    else inicio = meio + 1;
  }
  return null;
}

console.log("\nBusca por processo 1002:");
console.log(buscaBinaria(processos, 1002));

// ===============================
// Módulo 4: Estruturas Avançadas
// ===============================

// Árvore Binária de Busca: Organizar processos
class NoArvore {
  constructor(valor) {
    this.valor = valor;
    this.esquerda = null;
    this.direita = null;
  }
}

class ArvoreBinaria {
  constructor() {
    this.raiz = null;
  }

  inserir(valor) {
    const novo = new NoArvore(valor);
    if (!this.raiz) {
      this.raiz = novo;
      return;
    }
    let atual = this.raiz;
    while (true) {
      if (valor < atual.valor) {
        if (!atual.esquerda) {
          atual.esquerda = novo;
          break;
        }
        atual = atual.esquerda;
      } else {
        if (!atual.direita) {
          atual.direita = novo;
          break;
        }
        atual = atual.direita;
      }
    }
  }

  buscar(valor) {
    let atual = this.raiz;
    while (atual) {
      if (valor === atual.valor) return true;
      atual = valor < atual.valor ? atual.esquerda : atual.direita;
    }
    return false;
  }
}

const arvore = new ArvoreBinaria();
[1001, 1002, 1003].forEach(p => arvore.inserir(p));
console.log("\nProcurando processo 1003 na árvore:", arvore.buscar(1003));

// Grafo: Conexão entre filiais
class Grafo {
  constructor() {
    this.vertices = {};
  }

  adicionarVertice(nome) {
    if (!this.vertices[nome]) {
      this.vertices[nome] = [];
    }
  }

  adicionarAresta(origem, destino) {
    this.vertices[origem].push(destino);
    this.vertices[destino].push(origem);
  }

  mostrar() {
    console.log("\nRede de filiais:");
    for (let v in this.vertices) {
      console.log(`${v} conectado com: ${this.vertices[v].join(", ")}`);
    }
  }
}

const rede = new Grafo();
["Matriz", "SP", "RJ", "BH", "RS"].forEach(f => rede.adicionarVertice(f));
rede.adicionarAresta("Matriz", "SP");
rede.adicionarAresta("SP", "RJ");
rede.adicionarAresta("SP", "BH");
rede.adicionarAresta("BH", "RS");
rede.mostrar();

// ===============================
// Módulo 5: Decomposição e Modularidade
// ===============================

function verificarDocumentos(processo) {
  return processo.documentos.length >= 3;
}

function processar(processo) {
  if (!verificarDocumentos(processo)) {
    console.log(`\nProcesso ${processo.numero} com documentação incompleta.`);
    return;
  }
  console.log(`\nProcesso ${processo.numero} validado e pronto para audiência.`);
}

const processoValido = {
  numero: "2024-2001",
  documentos: ["RG", "CPF", "Comprovante"]
};

const processoInvalido = {
  numero: "2024-2002",
  documentos: ["RG"]
};

processar(processoValido);
processar(processoInvalido);
