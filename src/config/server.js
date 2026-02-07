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
    console.log("Servidor rodando em http://localhost:4000");
  });
}

iniciarServidor();

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, idade, cpf, status } = req.body;

    if (!nome || !idade || !cpf || !status) {
      return res.status(400).json({ erro: "Faltam dados no objeto!" });
    }

    const resultado = await db.run(
      "INSERT INTO usuarios (nome, idade, cpf, status) VALUES (?, ?, ?, ?)",
      [nome, idade, cpf, status],
    );

    res.json({
      mensagem: "Dados salvos!",
      id: resultado.lastID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const lista = await db.all("SELECT * FROM usuarios");
    res.json(lista);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
});
