const express = require('express');
const router = express.Router();
const clubeController = require('../controllers/clubeController');
const auth = require('../middleware/auth');

// Rota: Listar Clubes
router.get('/', auth(1), clubeController.listarClubes);

// Rota: Cadastrar Clube
router.get('/cadastrar', auth(1), clubeController.rdCadastroClube);

// Rota: Obter Federações para Seleção no Modal
router.get('/cadastrar/federacoes', auth(1), clubeController.obterFederacoesParaClube);

// Rota: Adicionar Clube
router.post('/adicionar', auth([1, 2]), clubeController.adicionarClube);

// Rota: Acessar a página do clube
router.get('/dashboard', auth(2), clubeController.dashboard);

module.exports = router;
