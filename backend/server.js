const express = require('express');
const moment = require('moment');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { engine } = require('express-handlebars');
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });

// Importando rotas
const federacaoRoutes = require('./src/routes/federacaoRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const clubeRoutes = require('./src/routes/clubeRoutes');
const adminRoutes = require('./src/routes/adminRoutes')
const sessionMiddleware = require('./config/session');

const site = express();

// Configuração do motor de visualização Handlebars
site.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => moment(date).format('DD/MM/YYYY'),
    },
}));
site.set('view engine', 'handlebars');
site.set('views', path.join(__dirname, 'src', 'views'));

// Configuração da sessão com persistência no MySQL
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

site.use(sessionMiddleware);

// Middlewares
site.use(cors());
site.use(express.json());
site.use(express.urlencoded({ extended: false }));

// Rotas
site.use('/api/usuarios', usuarioRoutes);
site.use('/api/admin', adminRoutes);
site.use('/api/federacoes', federacaoRoutes);
site.use('/api/clubes', clubeRoutes);

// Inicie o servidor
const PORT = process.env.PORT || 3000;
site.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}: http://localhost:${PORT}/`);
});
