const { ErrorHandler, AppError } = require('../utils/error-handler');

/**
 * Middleware para capturar errores en rutas no encontradas
 */
const notFoundMiddleware = (req, res, next) => {
    const error = ErrorHandler.notFoundError(
        `Ruta no encontrada: ${req.originalUrl}`,
        undefined,
        { method: req.method }
    );
    next(error);
};

/**
 * Middleware para manejar errores de forma centralizada
 */
const errorMiddleware = (err, req, res, next) => {
    // Convertir el error a un formato estandarizado
    const standardError = ErrorHandler.handleError(err);
    
    // Loguear el error para debugging
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error stack:', err.stack);
    }
    
    // Enviar respuesta con formato estándar
    res.status(standardError.httpStatus).json(standardError.toJSON());
};

module.exports = {
    notFoundMiddleware,
    errorMiddleware
}; 