require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 10000;

// Log das variáveis de ambiente (sem mostrar senhas)
console.log('Configuração do ambiente:');
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Adiciona um handler de erro global
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Adiciona um handler para rotas não encontradas
app.use((req, res) => {
  console.log('Rota não encontrada:', req.url);
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
  console.log(`URL base: http://localhost:${PORT}`);
}); 