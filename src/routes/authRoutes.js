const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de registro
router.post('/register', authController.register);

// Rota de login
router.post('/login', authController.login);

// Rota de alteração de senha
router.post('/alterar-senha', authController.alterarSenha);

module.exports = router; 