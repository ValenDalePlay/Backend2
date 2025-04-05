const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const cartRepository = require('../repositories/cart.repository');

class UserService {
    async getUserById(id) {
        return await userRepository.getById(id);
    }

    async getUserByEmail(email) {
        return await userRepository.getByEmail(email);
    }

    async createUser(userData) {
        // Verificamos si el usuario ya existe
        const existingUser = await this.getUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }

        // Hasheamos la contraseña
        const hashedPassword = bcrypt.hashSync(userData.password, 10);
        
        // Creamos un carrito para el usuario
        const cart = await cartRepository.create();
        
        // Creamos el usuario con el carrito y la contraseña hasheada
        return await userRepository.create({
            ...userData,
            password: hashedPassword,
            cart: cart._id
        });
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