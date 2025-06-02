// grafoFiliais.js
class Grafo {
  constructor() {
    this.vertices = {};
  }

  // Adiciona uma filial (vértice) ao grafo
  adicionarVertice(nome) {
    if (!this.vertices[nome]) {
      this.vertices[nome] = [];
      console.log(`Adicionada filial: ${nome}`);
    }
  }

  // Cria conexão (aresta) entre duas filiais (não direcionada)
  adicionarAresta(origem, destino) {
    this.vertices[origem].push(destino);
    this.vertices[destino].push(origem); 
    console.log(`Conexão criada entre ${origem} e ${destino}`);
  }

  // Busca em Largura (BFS)
  bfs(inicio) {
    let visitados = {};
    let fila = [inicio];
    visitados[inicio] = true;

    console.log("\nBusca em Largura (BFS):");
    while (fila.length > 0) {
      let atual = fila.shift();
      console.log(`Visitando: ${atual}`);

      this.vertices[atual].forEach(vizinho => {
        if (!visitados[vizinho]) {
          visitados[vizinho] = true;
          fila.push(vizinho);
        }
      });
    }
  }

  // Busca em Profundidade (DFS)
  dfs(inicio, visitados = {}) {
    if (!visitados[inicio]) {
      visitados[inicio] = true;
      console.log(`Visitando: ${inicio}`);
      this.vertices[inicio].forEach(v => this.dfs(v, visitados));
    }
  }
}

// --- EXEMPLO PRÁTICO ---
const rede = new Grafo();

// Adiciona filiais
["Matriz", "Filial1", "Filial2", "Filial3"].forEach(f => rede.adicionarVertice(f));

// Cria conexões
rede.adicionarAresta("Matriz", "Filial1");
rede.adicionarAresta("Matriz", "Filial2");
rede.adicionarAresta("Filial1", "Filial3");

// Executa BFS e DFS
rede.bfs("Matriz");
console.log("\nBusca em Profundidade (DFS):");
rede.dfs("Matriz");