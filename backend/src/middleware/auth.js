const { Usuario } = require('../../config/db');

const auth = (perfil) => {
    return async (req, res, next) => {
        const userId = req.session.userId; // Obtendo o ID do usuário da sessão
        
        if (!userId) {
            return res.status(403).json({ message: 'Acesso negado. Usuário não autenticado.' });
        }

        try {
            const usuario = await Usuario.findOne({ where: { codUsuario: userId } });

            if (!usuario) {
                return res.status(403).json({ message: 'Usuário não encontrado.' });
            }

            // Verificar se o perfil do usuário corresponde ao perfil necessário
            if (usuario.perfil !== perfil) {
                return res.status(403).json({ message: 'Acesso negado. Perfil não permitido.' });
            }

            // Adiciona o usuário à requisição para acesso posterior
            req.user = usuario; 

            next(); // O usuário tem permissão, continue para a próxima rota
        } catch (error) {
            console.error('Erro na autenticação:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    };
};

module.exports = auth;