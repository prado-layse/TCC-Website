const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Middleware de sessão
const sessionMiddleware = session({
    key: 'user_sid', // Nome do cookie
    secret: process.env.SESSION_SECRET || 'senha',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 dia
        secure: process.env.NODE_ENV === 'production', // true em produção
        httpOnly: true,
    },
});

module.exports = sessionMiddleware;
