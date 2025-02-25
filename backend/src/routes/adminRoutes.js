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

module.exports = router;
