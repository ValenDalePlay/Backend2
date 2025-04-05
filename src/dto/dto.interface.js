/**
 * Interfaz genérica para los Data Transfer Objects
 * Esta clase define los métodos que todos los DTOs deben implementar
 */
class DTO {
    /**
     * Convierte un objeto de modelo a un DTO para la respuesta
     * @param {Object} model - Objeto del modelo
     * @returns {Object} - DTO para respuesta
     */
    static toResponse(model) {
        throw new Error('El método toResponse debe ser implementado');
    }

    /**
     * Convierte múltiples objetos de modelo a DTOs para la respuesta
     * @param {Array} models - Array de objetos del modelo
     * @returns {Array} - Array de DTOs para respuesta
     */
    static toResponseList(models) {
        if (!Array.isArray(models)) {
            return [];
        }
        return models.map(model => this.toResponse(model));
    }

    /**
     * Convierte un objeto de modelo a un DTO para la persistencia
     * @param {Object} model - Objeto del modelo
     * @returns {Object} - DTO para persistencia
     */
    static toPersistence(model) {
        throw new Error('El método toPersistence debe ser implementado');
    }
}

module.exports = DTO; 