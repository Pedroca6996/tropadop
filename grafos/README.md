# 🏢 Grafos - Conexões entre Filiais Jurídicas

Simulação de rede entre escritórios usando **BFS** e **DFS**.

## 📝 Explicação do Código
```javascript
// Cria um grafo não-direcionado
const rede = new Grafo();
rede.adicionarAresta("Matriz", "Filial1"); 
// Matriz ↔ Filial1
```

### Algoritmos de Travessia
| **BFS** (Breadth-First Search)       | **DFS** (Depth-First Search)          |
|--------------------------------------|---------------------------------------|
| Visita por níveis (filial por filial)| Explora um ramo até o fim             |
| Usa **fila**                        | Usa **pilha** (ou recursão)          |
| Ideal para caminhos mais curtos      | Ideal para verificar conectividade    |

## ▶️ Como Executar
```bash
node grafoFiliais.js
```

## 🖼️ Saída do Programa
![Resultado da Execução](assets/execucao.png)