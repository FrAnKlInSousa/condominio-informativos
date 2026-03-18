import express from 'express';
import cors from 'cors';
import { client } from './database';

const app = express();

app.use(cors());
app.use(express.json());
// essa parte resolve problema com cache / req 304
// TODO remover antes de ir pra produção
app.use((req, res, next) => {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Lista todos os comunicados

app.get('/comunicados', async (req, res) => {
  const search = req.query.search as string;
  const data = req.query.data as string;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT * FROM comunicados
      WHERE status = 'ativo'
    `;

    const values: any[] = [];

    if (search && search.trim() !== '') {
      values.push(`%${search.trim()}%`);
      query += `
        AND (titulo ILIKE $${values.length}
        OR descricao ILIKE $${values.length})
      `;
    }

    if (data && data.trim() !== '') {
      values.push(data);
      query += `
        AND data = $${values.length}
      `;
    }

    // 👉 paginação
    values.push(limit);
    values.push(offset);

    query += `
      ORDER BY data DESC, id DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `;

    const result = await client.query(query, values);

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

app.put('/comunicados/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, data } = req.body;

  try {
    const result = await client.query(
      `
      UPDATE comunicados
      SET titulo = $1,
          descricao = $2,
          data = $3
      WHERE id = $4
      RETURNING *
      `,
      [titulo, descricao, data, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar comunicado' });
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
