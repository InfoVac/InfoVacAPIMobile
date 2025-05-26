const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const ubsRoutes = require('./routes/ubsRoutes');
const mobileRoutes = require('./routes/mobileRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/ubs', ubsRoutes);
app.use('/api/mobile', mobileRoutes);

// Rota de teste para UBSs
app.get('/api/test', (req, res) => {
  res.json({ message: 'Rota de teste funcionando!' });
});

module.exports = app; 