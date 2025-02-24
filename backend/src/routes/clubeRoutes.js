const express = require('express');
const router = express.Router();
const clubeController = require('../controllers/clubeController');
const atletaController = require('../controllers/atletaController');
const auth = require('../middleware/auth');

// Rota: Listar Clubes
router.get('/', auth('user-admin', 'user-consulta'), clubeController.listarClubes);

// Rota: Cadastrar Clube
router.get('/cadastrar', auth(1), clubeController.rdCadastroClube);
router.post('/adicionar', auth(1), clubeController.adicionarClube);

// Rota: Obter Federações para Seleção no Modal
router.get('/cadastrar/federacoes', auth(1), clubeController.obterFederacoesParaClube);

// Rota: Acessar a página do clube
router.get('/dashboard/:sigla', auth(2), atletaController.listarAtletas);

module.exports = router;
