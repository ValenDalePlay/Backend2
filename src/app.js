require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const initializePassport = require('./config/passport.config');

// Importamos las rutas
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const ticketRoutes = require('./routes/ticket.routes');

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

// Inicializamos passport
app.use(passport.initialize());
initializePassport();

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/tickets', ticketRoutes);

// Manejo de errores para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        error: 'Ruta no encontrada'
    });
});

// Configuración del puerto
const PORT = process.env.PORT || 8080;

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 