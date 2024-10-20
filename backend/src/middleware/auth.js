// backend/src/middleware/auth.js
module.exports = (perfilTipo) => {
    return (req, res, next) => {
        if (req.session.userProfile === perfilTipo) {
            return next(); // Permite o acesso
        }
        return res.status(403).json({ message: 'Acesso negado.' }); // Acesso negado
    };
};
