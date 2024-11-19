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
router.get('/:codFederacao/editar', federacaoController.renderizarEdicao); // Rota para renderizar Tela de editar federação
router.post('/:codFederacao/atualizar', federacaoController.atualizarFederacao); //Rota para atualizar a federação
module.exports = router;
