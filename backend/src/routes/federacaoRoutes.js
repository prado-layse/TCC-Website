// src/routes/federacaoRoutes.js
const express = require('express');
const router = express.Router();
const federacaoController = require('../controllers/federacaoController');
const auth = require('../middleware/auth');

// Rota para listar federações
router.get('/', federacaoController.listarFederacoes);
// Rota para cadastrar federação
router.get('/cadastrar', auth('user-admin'), federacaoController.renderizarCadastro);
router.post('/adicionar', auth('user-admin'), federacaoController.adicionarFederacao);
router.get('/:codFederacao/editar', auth('user-admin'), federacaoController.renderizarEdicao); // Rota para renderizar Tela de editar federação
router.post('/:codFederacao/atualizar', auth('user-admin'), federacaoController.atualizarFederacao); //Rota para atualizar a federação
module.exports = router;
