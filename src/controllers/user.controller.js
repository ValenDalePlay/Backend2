const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../utils/error-handler');

class UserController {
    async register(req, res, next) {
        try {
            const { first_name, last_name, email, age, password } = req.body;
            
            if (!first_name || !last_name || !email || !password) {
                return res.status(400).json({ 
                    status: 'error', 
                    error: 'Faltan datos obligatorios' 
                });
            }

            const newUser = await userService.createUser({
                first_name,
                last_name,
                email,
                age,
                password
            });

            res.status(201).json({ 
                status: 'success', 
                message: 'Usuario registrado exitosamente',
                payload: newUser
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ 
                    status: 'error', 
                    error: 'Email y password son requeridos' 
                });
            }

            const user = await userService.validateUser(email, password);
            
            if (!user) {
                throw ErrorHandler.authenticationError(
                    'Credenciales inválidas',
                    401
                );
            }

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 24 horas
            });

            res.json({ 
                status: 'success',
                message: 'Login exitoso',
                token
            });
        } catch (error) {
            next(error);
        }
    }

    async current(req, res, next) {
        try {
            const currentUser = await userService.getCurrentUser(req.user._id);
            
            res.json({ 
                status: 'success', 
                payload: currentUser
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie('jwt');
            res.json({ 
                status: 'success', 
                message: 'Logout exitoso' 
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController(); 