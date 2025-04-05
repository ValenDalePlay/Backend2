/**
 * Colección de funciones de validación reutilizables
 */

/**
 * Valida que un valor esté presente (no sea undefined, null o cadena vacía)
 * @param {*} value - Valor a validar
 * @returns {boolean} - true si el valor está presente
 */
const isRequired = (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
};

/**
 * Valida que un valor sea un string válido
 * @param {*} value - Valor a validar
 * @returns {boolean} - true si el valor es un string válido
 */
const isString = (value) => {
    return typeof value === 'string' && value.trim() !== '';
};

/**
 * Valida que un valor sea un número válido
 * @param {*} value - Valor a validar
 * @returns {boolean} - true si el valor es un número válido
 */
const isNumber = (value) => {
    return !isNaN(Number(value));
};

/**
 * Valida que un valor sea un número positivo
 * @param {*} value - Valor a validar
 * @returns {boolean} - true si el valor es un número positivo
 */
const isPositiveNumber = (value) => {
    return isNumber(value) && Number(value) > 0;
};

/**
 * Valida que un valor sea un número no negativo (positivo o cero)
 * @param {*} value - Valor a validar
 * @returns {boolean} - true si el valor es un número no negativo
 */
const isNonNegativeNumber = (value) => {
    return isNumber(value) && Number(value) >= 0;
};

/**
 * Valida que un valor sea un ID de MongoDB válido
 * @param {string} id - ID a validar
 * @returns {boolean} - true si el ID tiene formato válido
 */
const isValidMongoId = (id) => {
    return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Valida que un valor sea un email válido
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el email tiene formato válido
 */
const isValidEmail = (email) => {
    if (!isString(email)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida que un string tenga una longitud mínima
 * @param {string} value - String a validar
 * @param {number} minLength - Longitud mínima requerida
 * @returns {boolean} - true si el string tiene al menos la longitud mínima
 */
const hasMinLength = (value, minLength) => {
    if (!isString(value)) return false;
    return value.length >= minLength;
};

/**
 * Valida que un string no exceda una longitud máxima
 * @param {string} value - String a validar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {boolean} - true si el string no excede la longitud máxima
 */
const hasMaxLength = (value, maxLength) => {
    if (!isString(value)) return false;
    return value.length <= maxLength;
};

/**
 * Valida que un array tenga elementos
 * @param {Array} array - Array a validar
 * @returns {boolean} - true si el array no está vacío
 */
const isNonEmptyArray = (array) => {
    return Array.isArray(array) && array.length > 0;
};

/**
 * Valida que un valor esté dentro de un conjunto de valores permitidos
 * @param {*} value - Valor a validar
 * @param {Array} allowedValues - Valores permitidos
 * @returns {boolean} - true si el valor está permitido
 */
const isOneOf = (value, allowedValues) => {
    return allowedValues.includes(value);
};

/**
 * Valida que un valor sea un objeto válido
 * @param {*} value - Valor a validar
 * @returns {boolean} - true si el valor es un objeto válido
 */
const isObject = (value) => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

module.exports = {
    isRequired,
    isString,
    isNumber,
    isPositiveNumber,
    isNonNegativeNumber,
    isValidMongoId,
    isValidEmail,
    hasMinLength,
    hasMaxLength,
    isNonEmptyArray,
    isOneOf,
    isObject
}; 