const UserModel = require('../models/user.model');

class UserMongoDAO {
    async getById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw new Error(`Error al obtener usuario por ID: ${error.message}`);
        }
    }

    async getByEmail(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw new Error(`Error al obtener usuario por email: ${error.message}`);
        }
    }

    async create(userData) {
        try {
            return await UserModel.create(userData);
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    async update(id, userData) {
        try {
            return await UserModel.findByIdAndUpdate(id, userData, { new: true });
        } catch (error) {
            throw new Error(`Error al actualizar usuario: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await UserModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
}

module.exports = new UserMongoDAO(); 