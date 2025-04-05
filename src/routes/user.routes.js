const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user.controller');

// Ruta para registrar un usuario
router.post('/register', userController.register);

// Ruta para iniciar sesión
router.post('/login', userController.login);

// Ruta para obtener información del usuario actual
router.get('/current', 
    passport.authenticate('jwt', { session: false }),
    userController.current
);

// Ruta para cerrar sesión
router.get('/logout', userController.logout);

module.exports = router; 