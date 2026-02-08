const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let db;

async function iniciarServidor() {
  db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      idade TEXT,
      cpf TEXT,
      status TEXT
    )
  `);

  app.listen(4000, () => {
    console.log("🚀 Servidor rodando em http://localhost:4000");
  });
}

iniciarServidor();

app.get("/usuarios", async (req, res) => {
  try {
    const lista = await db.all("SELECT * FROM usuarios");
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, idade, cpf, status } = req.body;
    const resultado = await db.run(
      "INSERT INTO usuarios (nome, idade, cpf, status) VALUES (?, ?, ?, ?)",
      [nome, idade, cpf, status],
    );
    res.json({ mensagem: "Dados salvos!", id: resultado.lastID });
  } catch (error) {
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, idade, cpf, status } = req.body;

    const resultado = await db.run(
      "UPDATE usuarios SET nome = ?, idade = ?, cpf = ?, status = ? WHERE id = ?",
      [nome, idade, cpf, status, id],
    );

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar no banco" });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ mensagem: "Usuário removido!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir" });
  }
});

app.delete("/usuarios", async (req, res) => {
  try {
    await db.run("DELETE FROM usuarios");
    res.json({ mensagem: "Banco limpo com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao limpar banco" });
  }
});
