// backend/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const { engine } = require('express-handlebars');
const moment = require('moment');
const methodOverride = require('method-override');
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });
const { sequelize } = require('./config/db'); // Apenas a conexão com o banco é necessária
const sessionMiddleware = require('./config/session');

// Importando rotas
const federacaoRoutes = require('./src/routes/federacaoRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const clubeRoutes = require('./src/routes/clubeRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const atletaRoutes = require('./src/routes/atletaRoutes');
const indexRoutes = require('./src/routes/indexRoutes');

// Instância do aplicativo Express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware); // Middleware de sessão
app.use(methodOverride('_method')); 

// Configuração para servir arquivos estáticos
app.use('/backend/public', express.static(path.join(__dirname, 'public')));

// Configuração do Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => moment(date).format('DD/MM/YYYY'),
    },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// Rotas da API
app.use('/api/', indexRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/federacoes', federacaoRoutes);
app.use('/api/clubes', clubeRoutes);
app.use('/api/clubes/atletas', atletaRoutes);

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        return sequelize.sync(); // Sincroniza os modelos com o banco
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}: http://localhost:${PORT}/`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });
