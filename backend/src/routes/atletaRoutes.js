// src/routes/atletaRoutes.js
const express = require('express');
const router = express.Router();
const atletaController = require('../controllers/atletaController');
const auth = require('../middleware/auth');

// Rota: Listar Clubes
router.get('/', auth(2), atletaController.listarAtletas);

// Rota: Cadastrar Clube
//router.get('/cadastrar', auth(1), clubeController.rdCadastroClube);

// Rota: Obter Federações para Seleção no Modal
//router.get('/cadastrar/federacoes', auth(1), clubeController.obterFederacoesParaClube);

// Rota: Adicionar Clube
//router.post('/adicionar', auth([1, 2]), clubeController.adicionarClube);

module.exports = router;