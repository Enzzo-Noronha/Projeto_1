const form = document.getElementById("form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const Pessoa = {
      nome: document.getElementById("nomePessoa").value.trim(),
      idade: document.getElementById("idadePessoa").value.trim(),
      cpf: document.getElementById("cpfPessoa").value.trim(),
      status: document.getElementById("status").value.trim(),
    };

    enviarDados(Pessoa);
    guardaPessoa(Pessoa);
    form.reset();
    mostrarPessoa();
  });
}

async function enviarDados(Pessoa) {
  const resposta = await fetch("http://localhost:4000/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Pessoa),
  });

  const resultado = await resposta.json();
  alert("Dados enviados com sucesso");
}

const btnApagar = document
  .getElementById("btnApagar")
  .addEventListener("click", apagarDados);

function apagarDados() {
  localStorage.clear();
  mostrarPessoa();
}

async function mostrarPessoa() {
  const listaPessoas = document.getElementById("listaPessoas");
  if (!listaPessoas) return;

  // Em vez de ler do localStorage, busca do seu servidor
  const resposta = await fetch("http://localhost:4000/usuarios");
  const dados = await resposta.json();

  listaPessoas.innerHTML = "";

  dados.forEach((pessoa) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${pessoa.nome}</td>
        <td>${pessoa.idade}</td>
        <td>${pessoa.cpf}</td>
        <td>${pessoa.status}</td>
    `;
    listaPessoas.appendChild(tr);
  });
}

function limpar() {
  if (form) form.reset();
}

mostrarPessoa();
