const UserDTO = require('../dto/user.dto');
const userDAO = require('../dao/mongo/user.mongo.dao');

class UserRepository {
    async getById(id) {
        try {
            const user = await userDAO.getById(id);
            if (!user) return null;
            return new UserDTO(user);
        } catch (error) {
            throw new Error(`Error en el repositorio de usuario: ${error.message}`);
        }
    }

    async getByEmail(email) {
        try {
            const user = await userDAO.getByEmail(email);
            if (!user) return null;
            return user; // No aplicamos DTO acá porque necesitamos el password para login
        } catch (error) {
            throw new Error(`Error en el repositorio de usuario: ${error.message}`);
        }
    }

    async create(userData) {
        try {
            const newUser = await userDAO.create(userData);
            return new UserDTO(newUser);
        } catch (error) {
            throw new Error(`Error en el repositorio de usuario: ${error.message}`);
        }
    }

    async update(id, userData) {
        try {
            const updatedUser = await userDAO.update(id, userData);
            if (!updatedUser) return null;
            return new UserDTO(updatedUser);
        } catch (error) {
            throw new Error(`Error en el repositorio de usuario: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await userDAO.delete(id);
        } catch (error) {
            throw new Error(`Error en el repositorio de usuario: ${error.message}`);
        }
    }
}

module.exports = new UserRepository(); 