const { ERROR_TYPES, ERROR_CODES, DEFAULT_ERROR_MESSAGES, HTTP_STATUS_CODES } = require('./error-constants');

/**
 * Clase para el manejo centralizado de errores en la aplicación
 */
class AppError extends Error {
    /**
     * Constructor para crear una instancia de error personalizado
     * @param {string} message - Mensaje de error
     * @param {string} type - Tipo de error (de ERROR_TYPES)
     * @param {number} code - Código específico del error (de ERROR_CODES)
     * @param {object} metadata - Información adicional sobre el error
     */
    constructor(message, type = ERROR_TYPES.SERVER_ERROR, code = ERROR_CODES.INTERNAL_SERVER_ERROR, metadata = {}) {
        super(message || DEFAULT_ERROR_MESSAGES[code] || 'Error desconocido');
        this.type = type;
        this.code = code;
        this.metadata = metadata;
        this.timestamp = new Date().toISOString();
        this.httpStatus = HTTP_STATUS_CODES[type] || 500;
        
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Convierte el error a un formato estándar para respuestas API
     * @returns {object} Objeto formateado para respuesta JSON
     */
    toJSON() {
        return {
            status: 'error',
            error: {
                message: this.message,
                code: this.code,
                type: this.type,
                timestamp: this.timestamp,
                ...(Object.keys(this.metadata).length > 0 && { metadata: this.metadata })
            }
        };
    }
}

/**
 * Clase para manejar la creación y gestión centralizada de errores
 */
class ErrorHandler {
    /**
     * Crea un error de validación
     * @param {string} message - Mensaje personalizado (opcional)
     * @param {number} code - Código específico del error
     * @param {object} metadata - Datos adicionales
     * @returns {AppError} Error de validación
     */
    static validationError(message, code = ERROR_CODES.MISSING_REQUIRED_FIELDS, metadata = {}) {
        return new AppError(message, ERROR_TYPES.VALIDATION_ERROR, code, metadata);
    }

    /**
     * Crea un error de autenticación
     * @param {string} message - Mensaje personalizado (opcional)
     * @param {number} code - Código específico del error
     * @param {object} metadata - Datos adicionales
     * @returns {AppError} Error de autenticación
     */
    static authenticationError(message, code = ERROR_CODES.INVALID_CREDENTIALS, metadata = {}) {
        return new AppError(message, ERROR_TYPES.AUTHENTICATION_ERROR, code, metadata);
    }

    /**
     * Crea un error de autorización
     * @param {string} message - Mensaje personalizado (opcional)
     * @param {number} code - Código específico del error
     * @param {object} metadata - Datos adicionales
     * @returns {AppError} Error de autorización
     */
    static authorizationError(message, code = ERROR_CODES.UNAUTHORIZED_ACCESS, metadata = {}) {
        return new AppError(message, ERROR_TYPES.AUTHORIZATION_ERROR, code, metadata);
    }

    /**
     * Crea un error de recurso no encontrado
     * @param {string} message - Mensaje personalizado (opcional)
     * @param {number} code - Código específico del error
     * @param {object} metadata - Datos adicionales
     * @returns {AppError} Error de recurso no encontrado
     */
    static notFoundError(message, code = ERROR_CODES.RESOURCE_NOT_FOUND, metadata = {}) {
        return new AppError(message, ERROR_TYPES.NOT_FOUND_ERROR, code, metadata);
    }

    /**
     * Crea un error de base de datos
     * @param {string} message - Mensaje personalizado (opcional)
     * @param {number} code - Código específico del error
     * @param {object} metadata - Datos adicionales
     * @returns {AppError} Error de base de datos
     */
    static databaseError(message, code = ERROR_CODES.DATABASE_QUERY_ERROR, metadata = {}) {
        return new AppError(message, ERROR_TYPES.DATABASE_ERROR, code, metadata);
    }

    /**
     * Crea un error de lógica de negocio
     * @param {string} message - Mensaje personalizado (opcional)
     * @param {number} code - Código específico del error
     * @param {object} metadata - Datos adicionales
     * @returns {AppError} Error de lógica de negocio
     */
    static businessError(message, code = ERROR_CODES.BUSINESS_ERROR, metadata = {}) {
        return new AppError(message, ERROR_TYPES.BUSINESS_ERROR, code, metadata);
    }

    /**
     * Crea un error interno del servidor
     * @param {string} message - Mensaje personalizado (opcional)
     * @param {number} code - Código específico del error
     * @param {object} metadata - Datos adicionales
     * @returns {AppError} Error interno del servidor
     */
    static serverError(message, code = ERROR_CODES.INTERNAL_SERVER_ERROR, metadata = {}) {
        return new AppError(message, ERROR_TYPES.SERVER_ERROR, code, metadata);
    }

    /**
     * Maneja un error y lo convierte al formato estandarizado
     * @param {Error} err - Error a manejar
     * @returns {AppError} Error estandarizado
     */
    static handleError(err) {
        if (err instanceof AppError) {
            return err;
        }

        // Manejar errores de MongoDB y Mongoose
        if (err.name === 'MongoError' || err.name === 'MongoServerError') {
            if (err.code === 11000) {
                return this.databaseError(
                    'Ya existe un registro con esos datos',
                    ERROR_CODES.DUPLICATE_KEY_ERROR,
                    { duplicateKey: Object.keys(err.keyPattern)[0] }
                );
            }
            return this.databaseError(err.message);
        }

        if (err.name === 'ValidationError') {
            return this.validationError(
                'Error de validación',
                ERROR_CODES.INVALID_USER_DATA,
                { errors: Object.values(err.errors).map(e => e.message) }
            );
        }

        if (err.name === 'CastError') {
            if (err.kind === 'ObjectId') {
                return this.validationError(
                    'ID inválido',
                    ERROR_CODES.INVALID_ID_FORMAT,
                    { path: err.path }
                );
            }
        }

        // Por defecto devolver un error de servidor
        console.error('Error no manejado:', err);
        return this.serverError(err.message);
    }
}

module.exports = {
    AppError,
    ErrorHandler,
    ERROR_TYPES,
    ERROR_CODES
}; 