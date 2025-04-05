/**
 * Factory de middlewares de validación
 */

/**
 * Crea un middleware para validar el cuerpo de la petición
 * @param {Function} validator - Función de validación
 * @returns {Function} Middleware de Express
 */
const validateBody = (validator) => {
    return (req, res, next) => {
        try {
            validator(req.body);
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Crea un middleware para validar parámetros de ruta
 * @param {Function} validator - Función de validación
 * @param {string} paramName - Nombre del parámetro a validar
 * @returns {Function} Middleware de Express
 */
const validateParam = (validator, paramName) => {
    return (req, res, next) => {
        try {
            validator({ id: req.params[paramName] });
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Crea un middleware para validar parámetros de consulta
 * @param {Function} validator - Función de validación
 * @returns {Function} Middleware de Express
 */
const validateQuery = (validator) => {
    return (req, res, next) => {
        try {
            validator(req.query);
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Valida cada elemento de un array en el cuerpo de la petición
 * @param {string} arrayField - Nombre del campo que contiene el array
 * @param {Function} itemValidator - Función para validar cada elemento
 * @returns {Function} Middleware de Express
 */
const validateArrayItems = (arrayField, itemValidator) => {
    return (req, res, next) => {
        try {
            const array = req.body[arrayField];
            
            if (!Array.isArray(array)) {
                throw new Error(`El campo ${arrayField} debe ser un array`);
            }
            
            for (const item of array) {
                itemValidator(item);
            }
            
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    validateBody,
    validateParam,
    validateQuery,
    validateArrayItems
}; 