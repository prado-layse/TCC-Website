// backend/src/routes/adminRoutes.js
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Aplicando o middleware de autenticação
router.use(auth(1)); // Apenas usuários admin podem acessar essas rotas

// Rota do painel do admin
router.get('/dashboard', (req, res) => { // Mudei aqui
    res.render('dashboard'); // Certifique-se de que a view está corretamente configurada
});

module.exports = router;
