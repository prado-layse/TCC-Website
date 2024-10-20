// src/middleware/verificarAdminMiddleware.js

module.exports = (req, res, next) => {
    if (req.session.userProfile === 'admin') {
        return next(); // Permite o acesso se o perfil for 'admin'
    }
    res.status(403).render('erro', { message: 'Acesso negado: Apenas administradores podem acessar esta página.' });
};
