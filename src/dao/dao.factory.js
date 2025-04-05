/**
 * Factory para seleccionar la implementación de DAO a utilizar
 */
let userDAO;
let productDAO;
let cartDAO;
let ticketDAO;

// Por defecto usamos MongoDB pero podría cambiarse a otro tipo de persistencia
const persistence = process.env.PERSISTENCE || 'MONGO';

switch (persistence) {
    case 'MONGO':
        userDAO = require('./mongo/user.mongo.dao');
        productDAO = require('./mongo/product.mongo.dao');
        cartDAO = require('./mongo/cart.mongo.dao');
        ticketDAO = require('./mongo/ticket.mongo.dao');
        break;
    
    // Se podrían añadir otros tipos de persistencia en el futuro
    // case 'FILE':
    //     userDAO = require('./file/user.file.dao');
    //     ...
    //     break;
    
    default:
        userDAO = require('./mongo/user.mongo.dao');
        productDAO = require('./mongo/product.mongo.dao');
        cartDAO = require('./mongo/cart.mongo.dao');
        ticketDAO = require('./mongo/ticket.mongo.dao');
        break;
}

module.exports = {
    userDAO,
    productDAO,
    cartDAO,
    ticketDAO
}; 