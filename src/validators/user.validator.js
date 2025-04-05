const ValidatorBuilder = require('./validator-builder');

/**
 * Validador para registro de usuario
 */
const validateRegisterUser = new ValidatorBuilder()
    .isRequired('first_name', 'El nombre es obligatorio')
    .isString('first_name', 'El nombre debe ser un texto válido')
    .hasMaxLength('first_name', 50, 'El nombre no debe exceder los 50 caracteres')
    
    .isRequired('last_name', 'El apellido es obligatorio')
    .isString('last_name', 'El apellido debe ser un texto válido')
    .hasMaxLength('last_name', 50, 'El apellido no debe exceder los 50 caracteres')
    
    .isRequired('email', 'El email es obligatorio')
    .isValidEmail('email', 'El formato del email es inválido')
    
    .isRequired('password', 'La contraseña es obligatoria')
    .isString('password', 'La contraseña debe ser un texto válido')
    .hasMinLength('password', 8, 'La contraseña debe tener al menos 8 caracteres')
    .hasMaxLength('password', 100, 'La contraseña no debe exceder los 100 caracteres')
    
    .addRule('age',
        (value) => value === undefined || (typeof value === 'number' && value > 0),
        'La edad debe ser un número positivo')
    .build();

/**
 * Validador para login de usuario
 */
const validateLoginUser = new ValidatorBuilder()
    .isRequired('email', 'El email es obligatorio')
    .isValidEmail('email', 'El formato del email es inválido')
    
    .isRequired('password', 'La contraseña es obligatoria')
    .isString('password', 'La contraseña debe ser un texto válido')
    .build();

/**
 * Validador para actualización de usuario
 */
const validateUpdateUser = new ValidatorBuilder()
    .addRule('first_name',
        (value) => value === undefined || (typeof value === 'string' && value.trim() !== ''),
        'El nombre debe ser un texto válido')
    .addRule('first_name',
        (value) => value === undefined || value.length <= 50,
        'El nombre no debe exceder los 50 caracteres')
    
    .addRule('last_name',
        (value) => value === undefined || (typeof value === 'string' && value.trim() !== ''),
        'El apellido debe ser un texto válido')
    .addRule('last_name',
        (value) => value === undefined || value.length <= 50,
        'El apellido no debe exceder los 50 caracteres')
    
    .addRule('email',
        (value) => value === undefined || (typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)),
        'El formato del email es inválido')
    
    .addRule('age',
        (value) => value === undefined || (typeof value === 'number' && value > 0),
        'La edad debe ser un número positivo')
    
    .addRule('password',
        (value) => value === undefined || (typeof value === 'string' && value.length >= 8 && value.length <= 100),
        'La contraseña debe tener entre 8 y 100 caracteres')
    .build();

/**
 * Validador para ID de usuario
 */
const validateUserId = new ValidatorBuilder()
    .isValidMongoId('id', 'El ID del usuario tiene un formato inválido')
    .build();

module.exports = {
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateUserId
}; 