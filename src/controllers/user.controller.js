const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const UserDTO = require('../dto/user.dto');

class UserController {
    async register(req, res) {
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
            res.status(400).json({ status: 'error', error: error.message });
        }
    }

    async login(req, res) {
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
                return res.status(401).json({ 
                    status: 'error', 
                    error: 'Credenciales inválidas' 
                });
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
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async current(req, res) {
        try {
            const userDTO = new UserDTO(req.user);
            res.json({ 
                status: 'success', 
                payload: userDTO 
            });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('jwt');
            res.json({ 
                status: 'success', 
                message: 'Logout exitoso' 
            });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }
}

module.exports = new UserController(); 