const { Pool } = require('pg');

const pool = new Pool({
  host: 'dpg-d0ij9rh5pdvs739isjc0-a.oregon-postgres.render.com',
  user: 'infovacdb_4clx_user',
  password: 'flGURcoSsfUr8mhLxVk8RC5Bqfmvb4I3',
  database: 'infovacdb_4clx',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
  release();
});

module.exports = pool; 