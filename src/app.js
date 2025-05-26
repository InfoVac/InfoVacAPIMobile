const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const ubsRoutes = require('./routes/ubsRoutes');
const mobileRoutes = require('./routes/mobileRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'https://infovacapi-ny3z.onrender.com', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/api/ubs', ubsRoutes);
app.use('/api/mobile', mobileRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

module.exports = app; 