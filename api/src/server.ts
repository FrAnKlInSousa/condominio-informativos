import express from 'express';
import cors from 'cors';
import { client } from './database';

const app = express();

app.use(cors());
app.use(express.json());

// Lista todos os comunicados

app.get('/comunicados', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM comunicados WHERE status = "ativo" ORDER BY data DESC, id DESC',
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar comunicados' });
  }
});

// Cria um novo comunicado

app.post('/comunicados', async (req, res) => {
  const { titulo, descricao, data } = req.body;

  // validação mínima (importante)
  if (!titulo || !data) {
    return res.status(400).json({
      error: 'titulo e data são obrigatórios',
    });
  }

  try {
    const result = await client.query(
      `
      INSERT INTO comunicados (titulo, descricao, data)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [titulo, descricao ?? null, data],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar comunicado' });
  }
});

app.patch('/comunicados/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    await client.query(
      `UPDATE comunicados
       SET status = 'deletado'
       WHERE id = $1`,
      [id],
    );

    res.status(200).json({ message: 'Deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar comunicado' });
  }
});

const PORT = 3000;

async function start() {
  try {
    await client.connect();
    console.log('Banco conectado');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
}

start();
