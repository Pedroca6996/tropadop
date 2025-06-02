function cadastrarCliente(nome, tipo) {
  return { nome, tipo, status: "Aguardando atendimento" };
}

function exibirFila(fila) {
  console.log("\nFila de atendimento:");
  fila.forEach((cliente, index) => {
    console.log(`${index + 1}. ${cliente.nome} - ${cliente.tipo} - ${cliente.status}`);
  });
}

function atenderCliente(fila) {
  if (fila.length === 0) {
    console.log("Nenhum cliente na fila.");
    return;
  }
  const cliente = fila.shift();
  cliente.status = "Atendido";
  console.log(`\nAtendendo cliente: ${cliente.nome} (${cliente.tipo})`);
  return cliente;
}

// Execução
const fila = [];
fila.push(cadastrarCliente("Carlos", "Cível"));
fila.push(cadastrarCliente("Ana", "Trabalhista"));
fila.push(cadastrarCliente("Bruno", "Previdenciário"));

exibirFila(fila);
atenderCliente(fila);
exibirFila(fila);
