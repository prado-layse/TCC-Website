// src/routes/federacaoRoutes.js
const express = require('express');
const router = express.Router();
const federacaoController = require('../controllers/federacaoController');

// Rota para listar federações
router.get('/', federacaoController.listarFederacoes);

module.exports = router;
