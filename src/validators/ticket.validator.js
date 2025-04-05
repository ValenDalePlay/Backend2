const ValidatorBuilder = require('./validator-builder');

/**
 * Validador para ID de ticket
 */
const validateTicketId = new ValidatorBuilder()
    .isValidMongoId('id', 'El ID del ticket tiene un formato inválido')
    .build();

/**
 * Validador para creación de ticket
 */
const validateCreateTicket = new ValidatorBuilder()
    .isRequired('amount', 'El monto total es obligatorio')
    .isPositiveNumber('amount', 'El monto total debe ser un número mayor a 0')
    
    .isRequired('purchaser', 'El email del comprador es obligatorio')
    .isValidEmail('purchaser', 'El formato del email del comprador es inválido')
    .build();

module.exports = {
    validateTicketId,
    validateCreateTicket
}; 