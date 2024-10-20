// backend/src/controllers/usuarioController.js
const { Usuario } = require('../../config/db'); // Certifique-se de que esta importação esteja correta
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({
            where: { email },
        });

        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        // Comparar a senha fornecida com a senha armazenada
        const isPasswordValid = await bcrypt.compare(senha, usuario.senha);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        // Se a senha for válida, você pode proceder com o login
        req.session.userId = usuario.codUsuario; // Salvar o ID do usuário na sessão
        req.session.idPerfil = usuario.idPerfil;

        // Redirecionar com base no perfil do usuário
        if (usuario.idPerfil === 1) { // Supondo que o idPerfil do admin seja 1
            return res.redirect('/api/admin/dashboard'); // Redirecionar para o dashboard
        }

        res.status(200).json({ message: 'Login bem-sucedido!' }); // Para outros perfis
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
