const authMiddleware = (req, res, next) => {
    // Apenas chama o próximo middleware, você pode adicionar lógica aqui se necessário
    next();
};

module.exports = authMiddleware;
