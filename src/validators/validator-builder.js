const validatorFunctions = require('./validator-functions');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

/**
 * Clase para crear validadores de esquemas
 */
class ValidatorBuilder {
    constructor() {
        this.validations = [];
    }

    /**
     * Añade una regla de validación con mensaje personalizado
     * @param {string} field - Campo a validar
     * @param {Function} validationFn - Función de validación
     * @param {string} errorMessage - Mensaje de error en caso de validación fallida
     * @param {number} errorCode - Código de error personalizado
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    addRule(field, validationFn, errorMessage, errorCode = ERROR_CODES.INVALID_USER_DATA) {
        this.validations.push({
            field,
            validate: validationFn,
            message: errorMessage,
            code: errorCode
        });
        return this;
    }

    /**
     * Añade validación de campo requerido
     * @param {string} field - Campo a validar
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isRequired(field, errorMessage = `El campo '${field}' es obligatorio`) {
        return this.addRule(
            field,
            validatorFunctions.isRequired,
            errorMessage,
            ERROR_CODES.MISSING_REQUIRED_FIELDS
        );
    }

    /**
     * Añade validación de string
     * @param {string} field - Campo a validar
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isString(field, errorMessage = `El campo '${field}' debe ser un texto válido`) {
        return this.addRule(field, validatorFunctions.isString, errorMessage);
    }

    /**
     * Añade validación de número
     * @param {string} field - Campo a validar
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isNumber(field, errorMessage = `El campo '${field}' debe ser un número válido`) {
        return this.addRule(field, validatorFunctions.isNumber, errorMessage);
    }

    /**
     * Añade validación de número positivo
     * @param {string} field - Campo a validar
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isPositiveNumber(field, errorMessage = `El campo '${field}' debe ser un número mayor que 0`) {
        return this.addRule(field, validatorFunctions.isPositiveNumber, errorMessage);
    }

    /**
     * Añade validación de número no negativo
     * @param {string} field - Campo a validar
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isNonNegativeNumber(field, errorMessage = `El campo '${field}' debe ser un número mayor o igual a 0`) {
        return this.addRule(field, validatorFunctions.isNonNegativeNumber, errorMessage);
    }

    /**
     * Añade validación de ID de MongoDB
     * @param {string} field - Campo a validar
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isValidMongoId(field, errorMessage = `El ${field} tiene un formato inválido`) {
        return this.addRule(
            field,
            validatorFunctions.isValidMongoId,
            errorMessage,
            ERROR_CODES.INVALID_ID_FORMAT
        );
    }

    /**
     * Añade validación de email
     * @param {string} field - Campo a validar
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isValidEmail(field, errorMessage = `El email ingresado no es válido`) {
        return this.addRule(field, validatorFunctions.isValidEmail, errorMessage);
    }

    /**
     * Añade validación de longitud mínima
     * @param {string} field - Campo a validar
     * @param {number} minLength - Longitud mínima
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    hasMinLength(field, minLength, errorMessage = `El campo '${field}' debe tener al menos ${minLength} caracteres`) {
        return this.addRule(
            field,
            (value) => validatorFunctions.hasMinLength(value, minLength),
            errorMessage
        );
    }

    /**
     * Añade validación de longitud máxima
     * @param {string} field - Campo a validar
     * @param {number} maxLength - Longitud máxima
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    hasMaxLength(field, maxLength, errorMessage = `El campo '${field}' no debe tener más de ${maxLength} caracteres`) {
        return this.addRule(
            field,
            (value) => validatorFunctions.hasMaxLength(value, maxLength),
            errorMessage
        );
    }

    /**
     * Añade validación de array no vacío
     * @param {string} field - Campo a validar
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isNonEmptyArray(field, errorMessage = `El campo '${field}' debe contener al menos un elemento`) {
        return this.addRule(field, validatorFunctions.isNonEmptyArray, errorMessage);
    }

    /**
     * Añade validación de valor permitido
     * @param {string} field - Campo a validar
     * @param {Array} allowedValues - Valores permitidos
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isOneOf(field, allowedValues, errorMessage = `El valor de '${field}' no está permitido`) {
        return this.addRule(
            field,
            (value) => validatorFunctions.isOneOf(value, allowedValues),
            errorMessage
        );
    }

    /**
     * Añade validación de objeto
     * @param {string} field - Campo a validar
     * @param {string} errorMessage - Mensaje de error opcional
     * @returns {ValidatorBuilder} - Retorna this para encadenamiento
     */
    isObject(field, errorMessage = `El campo '${field}' debe ser un objeto válido`) {
        return this.addRule(field, validatorFunctions.isObject, errorMessage);
    }

    /**
     * Construye y retorna una función de validación
     * @returns {Function} - Función de validación que recibe un objeto y verifica todas las reglas
     */
    build() {
        const validations = this.validations;
        
        return (data) => {
            const errors = [];
            
            for (const validation of validations) {
                const { field, validate, message, code } = validation;
                const value = field.includes('.') 
                    ? field.split('.').reduce((obj, key) => obj && obj[key], data)
                    : data[field];
                
                if (!validate(value)) {
                    errors.push({ field, message, code });
                }
            }
            
            if (errors.length > 0) {
                const errorMessage = errors.map(e => e.message).join('; ');
                const firstErrorCode = errors[0].code;
                
                throw ErrorHandler.validationError(
                    errorMessage,
                    firstErrorCode,
                    { validationErrors: errors }
                );
            }
            
            return true;
        };
    }
}

module.exports = ValidatorBuilder; 