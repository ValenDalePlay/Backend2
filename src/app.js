require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const initializePassport = require('./config/passport.config');
const sessionRouter = require('./routes/session.routes');

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

// Inicializamos express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

// Rutas
app.use('/api/sessions', sessionRouter);

// Configuración del puerto
const PORT = process.env.PORT || 8080;

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 