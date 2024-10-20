// backend/src/middleware/auth.js
const { Usuario } = require('../../config/db');

const auth = (perfil) => {
    return async (req, res, next) => {
        const userId = req.session.userId; // Obtendo o ID do usuário da sessão
        
        if (!userId) {
            return res.status(403).json({ message: 'Acesso negado.' });
        }

        try {
            const usuario = await Usuario.findOne({ where: { codUsuario: userId } });

            if (!usuario) {
                return res.status(403).json({ message: 'Usuário não encontrado.' });
            }

            const perfilPermitido = perfil === 1 ? 1 : 2; // Ajuste de acordo com seus IDs de perfil
            
            if (usuario.idPerfil !== perfilPermitido) {
                return res.status(403).json({ message: 'Acesso negado.' });
            }

            next(); // O usuário tem permissão, continue para a próxima rota
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    };
};

module.exports = auth;
