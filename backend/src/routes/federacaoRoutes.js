// src/routes/federacaoRoutes.js
const express = require('express');
const router = express.Router();
const federacaoController = require('../controllers/federacaoController');
const auth = require('../middleware/auth');

//Middleware de autenticação
router.use(auth(1));
// Rota para listar federações
router.get('/', federacaoController.listarFederacoes);
// Rota para cadastrar federação
router.get('/cadastrar', federacaoController.renderizarCadastro);
router.post('/adicionar', federacaoController.adicionarFederacao);
router.put('/federacoes/ :codFederacao/inativar', federacaoController.alterarStatusFederacao);

module.exports = router;
