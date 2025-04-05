const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

/**
 * Middleware para verificar si el usuario está autenticado
 */
const isAuthenticated = (req, res, next) => {
    if (!req.user) {
        return next(
            ErrorHandler.authenticationError(
                'Debe iniciar sesión para acceder a este recurso',
                ERROR_CODES.UNAUTHORIZED
            )
        );
    }
    next();
};

/**
 * Middleware para verificar si el usuario es administrador
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return next(
            ErrorHandler.authenticationError(
                'Debe iniciar sesión para acceder a este recurso',
                ERROR_CODES.UNAUTHORIZED
            )
        );
    }
    
    if (req.user.role !== 'admin') {
        return next(
            ErrorHandler.authorizationError(
                'No tiene permisos para acceder a este recurso',
                ERROR_CODES.FORBIDDEN
            )
        );
    }
    
    next();
};

/**
 * Middleware para verificar si el usuario es propietario del carrito
 */
const isCartOwner = (req, res, next) => {
    if (!req.user) {
        return next(
            ErrorHandler.authenticationError(
                'Debe iniciar sesión para acceder a este recurso',
                ERROR_CODES.UNAUTHORIZED
            )
        );
    }
    
    const cartId = req.params.cid;
    const userCartId = req.user.cart.toString();
    
    if (cartId !== userCartId && req.user.role !== 'admin') {
        return next(
            ErrorHandler.authorizationError(
                'No tiene permisos para modificar este carrito',
                ERROR_CODES.FORBIDDEN
            )
        );
    }
    
    next();
};

/**
 * Middleware para permitir acceso solo a roles específicos
 * @param {Array} roles Array de roles permitidos
 */
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                ErrorHandler.authenticationError(
                    'Debe iniciar sesión para acceder a este recurso',
                    ERROR_CODES.UNAUTHORIZED
                )
            );
        }
        
        if (!roles.includes(req.user.role)) {
            return next(
                ErrorHandler.authorizationError(
                    'No tiene permisos para acceder a este recurso',
                    ERROR_CODES.FORBIDDEN
                )
            );
        }
        
        next();
    };
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isCartOwner,
    checkRole
}; 