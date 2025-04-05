const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const cartRepository = require('../repositories/cart.repository');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class UserService {
    async getAllUsers() {
        return await userRepository.getAll();
    }

    async getUserById(id) {
        return await userRepository.getById(id);
    }

    async getUserByEmail(email) {
        return await userRepository.getByEmail(email);
    }

    async getCurrentUser(id) {
        return await userRepository.getCurrentUser(id);
    }

    async createUser(userData) {
        // Verificamos si el usuario ya existe
        const existingUser = await this.getUserByEmail(userData.email);
        if (existingUser) {
            throw ErrorHandler.conflictError(
                'El email ya está registrado',
                ERROR_CODES.DUPLICATE_USER_EMAIL
            );
        }

        // Hasheamos la contraseña
        userData.password = bcrypt.hashSync(userData.password, 10);
        
        // Creamos un carrito para el usuario
        const cart = await cartRepository.create();
        
        // Asignamos el carrito al usuario
        userData.cart = cart.id;
        
        // Creamos el usuario
        return await userRepository.create(userData);
    }

    async validateUser(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) {
            return null;
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    async updateUser(id, userData) {
        if (userData.password) {
            userData.password = bcrypt.hashSync(userData.password, 10);
        }
        
        return await userRepository.update(id, userData);
    }

    async deleteUser(id) {
        return await userRepository.delete(id);
    }
}

module.exports = new UserService(); 