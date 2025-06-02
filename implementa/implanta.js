// verificarPrazos.js

function calcularDiasRestantes(prazoFinal) {
  const hoje = new Date();
  const fim = new Date(prazoFinal);
  const diferenca = fim - hoje;
  return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
}

function verificarPrazos(processos) {
  console.log("\nVerificação de prazos:");
  processos.forEach(p => {
    const dias = calcularDiasRestantes(p.prazo);
    const status = dias < 0 ? "VENCIDO" : `${dias} dia(s) restante(s)`;
    console.log(`Processo ${p.numero}: ${status}`);
  });
}

// Execução
const processos = [
  { numero: "2023-001", prazo: "2025-05-25" },
  { numero: "2023-002", prazo: "2025-05-19" },
  { numero: "2023-003", prazo: "2025-06-01" }
];

verificarPrazos(processos);