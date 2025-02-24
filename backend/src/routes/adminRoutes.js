// backend/src/routes/adminRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const federacaoController = require('../controllers/federacaoController');
const { Federacao } = require('../models');

const router = express.Router();

// Aplicando o middleware de autenticação
router.use(auth('user-admin')); // Apenas usuários admin podem acessar essas rotas

// Rota do painel do admin
router.get('/cbhp', (req, res) => { // Mudei aqui
    res.render('index', {isAdmin: req.session.usuario?.isAdmin}); // Certifique-se de que a view está corretamente configurada
});

/*
router.get('/', (req, res) => { // Mudei aqui
    res.render('listar-federacoes', {isAdmin: req.session.usuario?.isAdmin}, federacaoController.listarFederacoes); // Certifique-se de que a view está corretamente configurada
});
*/
router.get('/federacoes/cadastrar', (req, res) => { // Mudei aqui
    res.render('cadastro-federacao', {isAdmin: req.session.usuario?.isAdmin}); // Certifique-se de que a view está corretamente configurada
});

router.get('/', federacaoController.listarFederacoes);
// Rota para cadastrar federação
router.post('/federacoes/adicionar', auth('user-admin'), federacaoController.adicionarFederacao);
router.get('/federacoes/:codFederacao/editar', auth('user-admin'), federacaoController.renderizarEdicao); // Rota para renderizar Tela de editar federação
router.post('/federacoes/:codFederacao/atualizar', auth('user-admin'), federacaoController.atualizarFederacao); //Rota para atualizar a federação

module.exports = router;
