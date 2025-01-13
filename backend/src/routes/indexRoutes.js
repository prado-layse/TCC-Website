// backend/src/routes/indexRoutes.js
const express = require('express');
const router = express.Router();

// Rota do painel do admin
router.get('/cbhp', (req, res) => { // Mudei aqui
    const isUsuarioLogado = req.session.usuario ? true : false; // Verifica se há um usuário na sessão
    const isAdmin = req.user && req.user.idPerfil === 1; // Verifica se é admin
    res.render('index', { 
        isUsuarioLogado,
        isAdmin
    });
});

module.exports = router;