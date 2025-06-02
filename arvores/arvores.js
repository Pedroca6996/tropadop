class No {
  constructor(valor) {
    this.valor = valor;
    this.esquerda = null;
    this.direita = null;
  }
}

class ArvoreBinariaBusca {
  constructor() {
    this.raiz = null;
  }

  inserir(valor) {
    const novoNo = new No(valor);
    if (!this.raiz) {
      this.raiz = novoNo;
      console.log(`Inserido raiz: ${valor}`);
      return;
    }

    let atual = this.raiz;
    while (true) {
      if (valor < atual.valor) {
        if (!atual.esquerda) {
          atual.esquerda = novoNo;
          console.log(`Inserido ${valor} à esquerda de ${atual.valor}`);
          break;
        }
        atual = atual.esquerda;
      } else {
        if (!atual.direita) {
          atual.direita = novoNo;
          console.log(`Inserido ${valor} à direita de ${atual.valor}`);
          break;
        }
        atual = atual.direita;
      }
    }
  }

  buscar(valor) {
    let atual = this.raiz;
    while (atual) {
      if (valor === atual.valor) {
        console.log(`Processo ${valor} encontrado.`);
        return atual;
      }
      atual = valor < atual.valor ? atual.esquerda : atual.direita;
    }
    console.log(`Processo ${valor} não encontrado.`);
    return null;
  }
}

const arvore = new ArvoreBinariaBusca();
const processos = [1203, 859, 1330, 700, 1421, 960];

processos.forEach(p => arvore.inserir(p));
arvore.buscar(960);
arvore.buscar(1500);
