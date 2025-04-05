const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user.controller');
const { validateBody, validateParam } = require('../middlewares/validator.middleware');
const { 
    validateRegisterUser, 
    validateLoginUser, 
    validateUpdateUser,
    validateUserId
} = require('../validators/user.validator');

// Ruta para registrar un usuario
router.post('/register', 
    validateBody(validateRegisterUser),
    userController.register
);

// Ruta para iniciar sesión
router.post('/login', 
    validateBody(validateLoginUser),
    userController.login
);

// Ruta para obtener información del usuario actual
router.get('/current', 
    passport.authenticate('jwt', { session: false }),
    userController.current
);

// Ruta para cerrar sesión
router.get('/logout', userController.logout);

module.exports = router; 