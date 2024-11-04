// backend/src/routes/indexRoutes.js
const express = require('express');
//const auth = require('../middleware/auth');

const router = express.Router();

// Rota do painel do admin
router.get('/cbhp', (req, res) => { // Mudei aqui
    res.render('index'); 
});

module.exports = router;