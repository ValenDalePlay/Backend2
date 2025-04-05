const DTO = require('./dto.interface');

class UserDTO extends DTO {
    /**
     * Convierte un usuario a formato de respuesta (sin datos sensibles)
     * @param {Object} user - Usuario del modelo
     * @returns {Object} - DTO para respuesta
     */
    static toResponse(user) {
        if (!user) return null;

        return {
            id: user._id || user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role,
            age: user.age || null,
            cart: user.cart || null,
            createdAt: user.createdAt || user.created_at
        };
    }

    /**
     * Convierte una solicitud de registro a formato de persistencia
     * @param {Object} user - Datos del usuario de la solicitud
     * @returns {Object} - DTO para persistencia
     */
    static toPersistence(user) {
        if (!user) return null;

        return {
            first_name: user.firstName || user.first_name,
            last_name: user.lastName || user.last_name,
            email: user.email,
            password: user.password,
            age: user.age || null,
            role: user.role || 'user'
        };
    }

    /**
     * Convierte datos de usuario para actualización
     * @param {Object} userData - Datos del usuario para actualizar
     * @returns {Object} - DTO para actualización
     */
    static toUpdate(userData) {
        const updateData = {};

        if (userData.firstName || userData.first_name) {
            updateData.first_name = userData.firstName || userData.first_name;
        }

        if (userData.lastName || userData.last_name) {
            updateData.last_name = userData.lastName || userData.last_name;
        }

        if (userData.email) {
            updateData.email = userData.email;
        }

        if (userData.age) {
            updateData.age = userData.age;
        }

        if (userData.password) {
            updateData.password = userData.password;
        }

        return updateData;
    }
}

module.exports = UserDTO; 