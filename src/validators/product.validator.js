const ValidatorBuilder = require('./validator-builder');

/**
 * Validador para creación de producto
 */
const validateCreateProduct = new ValidatorBuilder()
    .isRequired('title', 'El título del producto es obligatorio')
    .isString('title', 'El título debe ser un texto válido')
    .hasMaxLength('title', 100, 'El título no debe exceder los 100 caracteres')
    
    .isRequired('description', 'La descripción del producto es obligatoria')
    .isString('description', 'La descripción debe ser un texto válido')
    
    .isRequired('code', 'El código del producto es obligatorio')
    .isString('code', 'El código debe ser un texto válido')
    .hasMinLength('code', 3, 'El código debe tener al menos 3 caracteres')
    .hasMaxLength('code', 50, 'El código no debe exceder los 50 caracteres')
    
    .isRequired('price', 'El precio del producto es obligatorio')
    .isPositiveNumber('price', 'El precio debe ser un número mayor a 0')
    
    .isRequired('stock', 'El stock del producto es obligatorio')
    .isNonNegativeNumber('stock', 'El stock debe ser un número mayor o igual a 0')
    
    .isRequired('category', 'La categoría del producto es obligatoria')
    .isString('category', 'La categoría debe ser un texto válido')
    .build();

/**
 * Validador para actualización de producto
 */
const validateUpdateProduct = new ValidatorBuilder()
    // En la actualización los campos son opcionales pero deben ser válidos si se proporcionan
    .addRule('title', 
        (value) => value === undefined || (typeof value === 'string' && value.trim() !== ''),
        'El título debe ser un texto válido')
    .addRule('title',
        (value) => value === undefined || value.length <= 100,
        'El título no debe exceder los 100 caracteres')
    
    .addRule('description',
        (value) => value === undefined || (typeof value === 'string' && value.trim() !== ''),
        'La descripción debe ser un texto válido')
    
    .addRule('code',
        (value) => value === undefined || (typeof value === 'string' && value.trim() !== ''),
        'El código debe ser un texto válido')
    .addRule('code',
        (value) => value === undefined || (value.length >= 3 && value.length <= 50),
        'El código debe tener entre 3 y 50 caracteres')
    
    .addRule('price',
        (value) => value === undefined || (typeof value === 'number' && value > 0),
        'El precio debe ser un número mayor a 0')
    
    .addRule('stock',
        (value) => value === undefined || (typeof value === 'number' && value >= 0),
        'El stock debe ser un número mayor o igual a 0')
    
    .addRule('category',
        (value) => value === undefined || (typeof value === 'string' && value.trim() !== ''),
        'La categoría debe ser un texto válido')
    .build();

/**
 * Validador para ID de producto
 */
const validateProductId = new ValidatorBuilder()
    .isValidMongoId('id', 'El ID del producto tiene un formato inválido')
    .build();

module.exports = {
    validateCreateProduct,
    validateUpdateProduct,
    validateProductId
}; 