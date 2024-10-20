const express = require('express');
const router = express.Router();
const federacaoController = require('../controllers/federacaoController');
const verificarToken = require('../middleware/authMiddleware');

// ROTA: Listar Federações
router.get('/', verificarToken, federacaoController.listarFederacoes); // Aplicando o middleware
// ROTA: Consultar Federação
router.get('/:codFederacao', federacaoController.consultarFederacao);
// ROTA: Adicionar uma Nova Federação
router.post('/', verificarToken, federacaoController.adicionarFederacao); // Middleware para proteger a rota
// ROTA: Tela de Cadastro de Federação
router.get('/cadastro', federacaoController.renderizarCadastro);
// ROTA: Tela de Editar Federação
router.get('/editar/:codFederacao', federacaoController.renderizarEdicao);
// ROTA: Atualizar Federação
router.put('/:codFederacao', verificarToken, federacaoController.atualizarFederacao); // Middleware para proteger a rota

module.exports = router;
