// backend/src/controllers/usuarioController.js
const { Usuario } = require('../../config/db'); // Certifique-se de que esta importação esteja correta
const bcrypt =  require('bcryptjs')

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
        res.status(200).json({ message: 'Login bem-sucedido!' });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};