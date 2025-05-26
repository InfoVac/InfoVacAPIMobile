const express = require('express');
const router = express.Router();
const mobileController = require('../controllers/mobileController');

// Endpoint para atualizar o status de uma vacina no mobile
router.put('/ubs/:ubsId/vacinas/:vacinaId', mobileController.atualizarStatusVacinaMobile);

// Novo endpoint de login para mobile
router.post('/login', mobileController.loginMobile);

module.exports = router; 