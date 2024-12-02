const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'restaurante'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados com sucesso.');
  }
});

/** Produtos */
app.get("/produtos", (req, res) => {
  connection.query("SELECT * FROM produtos", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/produtos", (req, res) => {
  const { nome, descricao, preco, categoria, quantidade } = req.body;
  connection.query(
    "INSERT INTO produtos (nome, descricao, preco, categoria, quantidade) VALUES (?, ?, ?, ?, ?)",
    [nome, descricao, preco, categoria, quantidade],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id: results.insertId, nome, descricao, preco, categoria, quantidade });
    }
  );
});

app.put("/produtos/:id", (req, res) => {
  const { nome, descricao, preco, categoria, quantidade } = req.body;
  const { id } = req.params;
  connection.query(
    "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, categoria = ?, quantidade = ? WHERE id = ?",
    [nome, descricao, preco, categoria, quantidade, id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id, nome, descricao, preco, categoria, quantidade });
    }
  );
});

app.delete("/produtos/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM produtos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Produto removido com sucesso!" });
  });
});

/** Reservas */
app.get("/reservas", (req, res) => {
  const query = `
    SELECT reservas.*, mesas.numero AS mesa_numero 
    FROM reservas 
    JOIN mesas ON reservas.mesa_id = mesas.id
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/reservas", (req, res) => {
  const { cliente_nome, cliente_telefone, mesa_id, data_reserva } = req.body;
  connection.query(
    "INSERT INTO reservas (cliente_nome, cliente_telefone, mesa_id, data_reserva) VALUES (?, ?, ?, ?)",
    [cliente_nome, cliente_telefone, mesa_id, data_reserva],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id: results.insertId, cliente_nome, cliente_telefone, mesa_id, data_reserva });
    }
  );
});

app.put("/reservas/:id", (req, res) => {
  const { cliente_nome, cliente_telefone, mesa_id, data_reserva } = req.body;
  const { id } = req.params;
  connection.query(
    "UPDATE reservas SET cliente_nome = ?, cliente_telefone = ?, mesa_id = ?, data_reserva = ? WHERE id = ?",
    [cliente_nome, cliente_telefone, mesa_id, data_reserva, id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id, cliente_nome, cliente_telefone, mesa_id, data_reserva });
    }
  );
});

app.delete("/reservas/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM reservas WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Reserva removida com sucesso!" });
  });
});

/** Pedidos */
app.get("/pedidos", (req, res) => {
  const query = `
    SELECT pedidos.*, mesas.numero AS mesa_numero 
    FROM pedidos 
    JOIN mesas ON pedidos.mesa_id = mesas.id
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/pedidos", (req, res) => {
  const { mesa_id, status, produtos } = req.body;
  connection.query(
    "INSERT INTO pedidos (mesa_id, status) VALUES (?, ?)",
    [mesa_id, status],
    (err, results) => {
      if (err) return res.status(500).send(err);
      const pedidoId = results.insertId;
      // Adicionando os produtos ao pedido
      produtos.forEach(async (produto) => {
        await connection.query(
          "INSERT INTO pedido_produtos (pedido_id, produto_id, quantidade) VALUES (?, ?, ?)",
          [pedidoId, produto.id, produto.quantidade]
        );
      });
      res.json({ id: pedidoId, mesa_id, status, produtos });
    }
  );
});

app.put("/pedidos/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  connection.query(
    "UPDATE pedidos SET status = ? WHERE id = ?",
    [status, id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id, status });
    }
  );
});

app.delete("/pedidos/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM pedidos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Pedido removido com sucesso!" });
  });
});

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080.");
});
