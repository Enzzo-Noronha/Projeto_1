// Remova a linha do require(sequelize) daqui

const form = document.getElementById("form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("pessoaId").value;
    const Pessoa = {
      nome: document.getElementById("nomePessoa").value.trim(),
      idade: document.getElementById("idadePessoa").value.trim(),
      cpf: document.getElementById("cpfPessoa").value.trim(),
      status: document.getElementById("status").value.trim(),
    };

    if (id) {
      // EDIÇÃO (PUT)
      await fetch(`http://localhost:4000/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Pessoa),
      });
      document.getElementById("pessoaId").value = "";
    } else {
      // CRIAÇÃO (POST)
      await enviarDados(Pessoa);
    }

    form.reset();
    mostrarPessoa();
  });
}

async function enviarDados(Pessoa) {
  try {
    const resposta = await fetch("http://localhost:4000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Pessoa),
    });
    const resultado = await resposta.json();
    alert("Dados enviados com sucesso");
  } catch (error) {
    console.error("Erro ao enviar:", error);
  }
}

const btnApagar = document.getElementById("btnApagar");
if (btnApagar) {
  btnApagar.addEventListener("click", apagarDadosNoServidor);
}

async function apagarDadosNoServidor() {
  if (confirm("Deseja apagar TODOS os registros do banco?")) {
    await fetch("http://localhost:4000/usuarios", { method: "DELETE" });
    mostrarPessoa();
  }
}

async function excluirUm(id) {
  if (confirm("Deseja excluir este registro?")) {
    await fetch(`http://localhost:4000/usuarios/${id}`, { method: "DELETE" });
    mostrarPessoa();
  }
}

async function mostrarPessoa() {
  const listaPessoas = document.getElementById("listaPessoas");
  if (!listaPessoas) return;

  try {
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
          <td>
            <button type="button" onclick="prepararEdicao('${pessoa.id}', '${pessoa.nome}', '${pessoa.idade}', '${pessoa.cpf}', '${pessoa.status}')">
              Editar
            </button>
            <button type="button" onclick="excluirUm('${pessoa.id}')" style="color: red;">
              Excluir
            </button>
          </td>
      `;
      listaPessoas.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

window.prepararEdicao = prepararEdicao;
window.excluirUm = excluirUm;
window.limpar = () => form.reset();

function prepararEdicao(id, nome, idade, cpf, status) {
  document.getElementById("pessoaId").value = id;
  document.getElementById("nomePessoa").value = nome;
  document.getElementById("idadePessoa").value = idade;
  document.getElementById("cpfPessoa").value = cpf;
  document.getElementById("status").value = status;
  window.scrollTo(0, 0);
}

mostrarPessoa();
