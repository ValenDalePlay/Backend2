const BaseRepository = require('./base.repository');
const { userDAO } = require('../dao/dao.factory');
const { UserDTO } = require('../dto');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class UserRepository extends BaseRepository {
    constructor() {
        super(userDAO, UserDTO);
    }

    /**
     * Buscar usuario por email
     * @param {string} email Email del usuario
     * @returns {Object} Usuario encontrado (sin transformar)
     */
    async getByEmail(email) {
        try {
            // Aquí no aplicamos DTO porque necesitamos datos como password para autenticación
            return await this.dao.getByEmail(email);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al buscar usuario por email: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    /**
     * Obtener información limitada y segura del usuario actual
     * @param {string} id ID del usuario
     * @returns {Object} Información limitada del usuario
     */
    async getCurrentUser(id) {
        try {
            const user = await this.dao.getById(id);
            
            // Retornamos solo la información necesaria (sin password ni datos sensibles)
            return {
                id: user._id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role,
                cart: user.cart
            };
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al obtener usuario actual: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }
}

module.exports = new UserRepository(); 