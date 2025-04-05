const UserModel = require('../models/user.model');
const DAO = require('../dao.interface');
const { ErrorHandler, ERROR_CODES } = require('../../utils/error-handler');

class UserMongoDAO extends DAO {
    async getAll() {
        try {
            return await UserModel.find().lean();
        } catch (error) {
            throw ErrorHandler.databaseError(
                `Error al obtener usuarios: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async getById(id) {
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                throw ErrorHandler.notFoundError(
                    `Usuario con ID ${id} no encontrado`,
                    ERROR_CODES.USER_NOT_FOUND
                );
            }
            return user;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al obtener usuario por ID: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async getByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            throw ErrorHandler.databaseError(
                `Error al obtener usuario por email: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async create(userData) {
        try {
            return await UserModel.create(userData);
        } catch (error) {
            if (error.code === 11000) {
                throw ErrorHandler.duplicateError(
                    'El email ya está registrado',
                    ERROR_CODES.DUPLICATE_USER_EMAIL
                );
            }
            throw ErrorHandler.databaseError(
                `Error al crear usuario: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async update(id, userData) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, userData, { new: true });
            if (!updatedUser) {
                throw ErrorHandler.notFoundError(
                    `Usuario con ID ${id} no encontrado`,
                    ERROR_CODES.USER_NOT_FOUND
                );
            }
            return updatedUser;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al actualizar usuario: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async delete(id) {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(id);
            if (!deletedUser) {
                throw ErrorHandler.notFoundError(
                    `Usuario con ID ${id} no encontrado`,
                    ERROR_CODES.USER_NOT_FOUND
                );
            }
            return deletedUser;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al eliminar usuario: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }
}

module.exports = new UserMongoDAO(); 