const express = require('express');
const router = express.Router();
const federacaoController = require('../controllers/federacaoController');

// ROTA: Listar Federações
router.get('/federacoes', federacaoController.listarFederacoes);

// ROTA: Consultar Federação
router.get('/consulta-federacao/:codFederacao', federacaoController.consultarFederacao);

// ROTA: Tela de Cadastro de Federação
router.get('/cadastro', federacaoController.renderizarCadastro);

// Adicionar uma Nova Federação
router.post('/add-federacao', federacaoController.adicionarFederacao);

// ROTA: Tela de Editar Federação
router.get('/editar-federacao/:codFederacao', federacaoController.renderizarEdicao);

// ROTA: Atualizar Federação
router.post('/atualizar-federacao/:codFederacao', federacaoController.atualizarFederacao);

module.exports = router;
