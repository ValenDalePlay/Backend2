const ValidatorBuilder = require('./validator-builder');

/**
 * Validador para ID de carrito
 */
const validateCartId = new ValidatorBuilder()
    .isValidMongoId('id', 'El ID del carrito tiene un formato inválido')
    .build();

/**
 * Validador para ID de producto en operaciones de carrito
 */
const validateProductId = new ValidatorBuilder()
    .isValidMongoId('id', 'El ID del producto tiene un formato inválido')
    .build();

/**
 * Validador para cantidad de producto
 */
const validateProductQuantity = new ValidatorBuilder()
    .isRequired('quantity', 'La cantidad es obligatoria')
    .isPositiveNumber('quantity', 'La cantidad debe ser un número mayor a 0')
    .build();

/**
 * Validador para actualización completa del carrito
 */
const validateCartUpdate = new ValidatorBuilder()
    .isRequired('products', 'La lista de productos es obligatoria')
    .isNonEmptyArray('products', 'El carrito debe contener al menos un producto')
    .build();

/**
 * Validador para cada producto en la actualización del carrito
 */
const validateCartProductItem = new ValidatorBuilder()
    .isRequired('product', 'El ID del producto es obligatorio')
    .isValidMongoId('product', 'El ID del producto tiene un formato inválido')
    
    .isRequired('quantity', 'La cantidad es obligatoria')
    .isPositiveNumber('quantity', 'La cantidad debe ser un número mayor a 0')
    .build();

module.exports = {
    validateCartId,
    validateProductId,
    validateProductQuantity,
    validateCartUpdate,
    validateCartProductItem
}; 