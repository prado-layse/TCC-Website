// src/controllers/usuarioController.js
const { Usuario, Clube } = require('../../config/db');
const bcrypt = require('bcryptjs');

// Acessar a Tela do Clube
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca o usuário pelo email
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        // Verifica a senha
        const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        // Salvar os dados do usuário na sessão
        req.session.userId = usuario.codUsuario; // Salvar userId na sessão
        req.session.usuario = {
            codUsuario: usuario.codUsuario,
            idPerfil: usuario.idPerfil,
            email: usuario.email,
        };

        req.session.save(async (err) => {
            if (err) {
                console.error('Erro ao salvar a sessão:', err);
                return res.status(500).json({ message: 'Erro ao iniciar sessão.' });
            }

            // Redirecionar baseado no perfil
            if (usuario.idPerfil === 1) {
                // Redirecionar para o dashboard do admin
                return res.redirect('/api/admin/dashboard');
            } else if (usuario.idPerfil === 2) {
                // Busca o clube associado ao usuário
                const clube = await Clube.findOne({ where: { codUsuario: usuario.codUsuario } });

                if (clube) {
                    // Redirecionar para o dashboard do clube
                    return res.redirect(`/api/clubes/dashboard/${clube.sigla}`);
                } else {
                    return res.status(404).json({ message: 'Clube não encontrado.' });
                }
            }

            // Se nenhum dos casos acima, retorne uma mensagem de sucesso
            res.status(200).json({ message: 'Login bem-sucedido!' });
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
