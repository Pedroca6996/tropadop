function verificarDocumentos(processo) {
  console.log(`Verificando documentos do processo ${processo.numero}`);
  return processo.documentos.length >= 3;
}

function agendarAudiencia(processo) {
  console.log(`Agendando audiência para o processo ${processo.numero}`);
  return `Audiência marcada para ${processo.numero}`;
}

function gerarResumo(processo) {
  return `Resumo do processo ${processo.numero}: Cliente - ${processo.cliente}, Tipo - ${processo.tipo}`;
}

function processar(processo) {
  console.log(`\nProcessando o processo ${processo.numero}...`);

  if (!verificarDocumentos(processo)) {
    console.log("Documentação incompleta. Encaminhar para regularização.");
    return;
  }

  console.log(agendarAudiencia(processo));
  console.log(gerarResumo(processo));
}

// Execução
const processo1 = {
  numero: "2024-0888",
  cliente: "Eduarda",
  tipo: "Família",
  documentos: ["RG", "CPF", "Comprovante de residência"]
};

const processo2 = {
  numero: "2024-0889",
  cliente: "João",
  tipo: "Cível",
  documentos: ["RG", "CPF"]
};

processar(processo1);
processar(processo2);
