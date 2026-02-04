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

    guardaPessoa(Pessoa);
    form.reset();
    mostrarPessoa();
  });
}

function apagarDados() {
  localStorage.clear();
}

function guardaPessoa(Pessoa) {
  const listaAtual = JSON.parse(localStorage.getItem("listaPessoas") || "[]");
  listaAtual.push(Pessoa);
  localStorage.setItem("listaPessoas", JSON.stringify(listaAtual));
}

function mostrarPessoa() {
  const listaElemento = document.getElementById("listaPessoas");
  if (!listaElemento) return;

  const dados = JSON.parse(localStorage.getItem("listaPessoas") || "[]");
  listaElemento.innerHTML = "";

  dados.forEach((pessoa) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>Nome:</strong> <span>${pessoa.nome}</span>
        <strong>Idade:</strong> <span>${pessoa.idade}</span>
        <strong>Idade:</strong> <span>${pessoa.cpf}</span>
        <strong>Idade:</strong> <span>${pessoa.status}</span>
      </div>
    `;
    listaElemento.appendChild(li);
  });
}

function limpar() {
  if (form) form.reset();
}

mostrarPessoa();
