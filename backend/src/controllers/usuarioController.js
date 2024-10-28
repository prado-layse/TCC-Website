// backend/src/controllers/usuarioController.js
const { Usuario } = require('../../config/db');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        // Salvar o usuário na sessão
        req.session.usuario = {
            codUsuario: usuario.codUsuario,
            idPerfil: usuario.idPerfil,
            email: usuario.email,
        };

        // Garantir que a sessão foi salva antes do redirecionamento
        req.session.save((err) => {
            if (err) {
                console.error('Erro ao salvar a sessão:', err);
                return res.status(500).json({ message: 'Erro ao iniciar sessão.' });
            }

            if (usuario.idPerfil === 1) {
                return res.redirect('/api/admin/dashboard');
            } else if (usuario.idPerfil === 2) {
                return res.redirect('/api/clubes/dashboard');
            }

            res.status(200).json({ message: 'Login bem-sucedido!' });
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
