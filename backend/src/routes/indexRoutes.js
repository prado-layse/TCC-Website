// backend/src/routes/indexRoutes.js
const express = require('express');
//const auth = require('../middleware/auth');

const router = express.Router();

// Rota do painel do admin
router.get('/cbhp', (req, res) => { // Mudei aqui
    const isUsuarioLogado = req.session.usuario ? true : false; // Verifica se há um usuário na sessão
    res.render('index', { isUsuarioLogado })
    //res.render('index', { usuarioLogado: req.session.usuario ? true : false }); 
});

module.exports = router;