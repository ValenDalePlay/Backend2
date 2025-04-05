const User = require('../dao/models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class SessionController {
    async register(req, res) {
        try {
            const { first_name, last_name, email, age, password } = req.body;
            
            const exists = await User.findOne({ email });
            if (exists) {
                return res.status(400).json({ error: 'El email ya está registrado' });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            const user = await User.create({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword
            });

            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
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
                message: 'Login exitoso',
                token: token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async current(req, res) {
        try {
            // req.user viene de passport-jwt
            const user = req.user;
            res.json({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SessionController(); 