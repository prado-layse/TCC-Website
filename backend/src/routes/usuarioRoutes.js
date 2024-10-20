const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para acessar a página de login
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza a página de login
});

// Rota para processar o login
router.post('/login', usuarioController.login);

module.exports = router;
