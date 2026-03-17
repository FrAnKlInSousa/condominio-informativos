CREATE TABLE comunicados (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);