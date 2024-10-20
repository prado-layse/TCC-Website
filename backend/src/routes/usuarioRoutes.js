// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// ROTA: Cadastro de Administrador (POST)
router.post('/cadastro-admin', usuarioController.cadastrarAdmin);

// ROTA: Login (POST)
router.post('/login', usuarioController.login);

// Exportando o router
module.exports = router;
