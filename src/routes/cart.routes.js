const express = require('express');
const router = express.Router();
const passport = require('passport');
const cartController = require('../controllers/cart.controller');
const { isUser } = require('../middlewares/auth.middlewares');
const { validateBody, validateParam, validateArrayItems } = require('../middlewares/validator.middleware');
const { 
    validateCartId, 
    validateProductId, 
    validateProductQuantity,
    validateCartUpdate,
    validateCartProductItem
} = require('../validators/cart.validator');

// Obtener un carrito por ID
router.get('/:cid', 
    passport.authenticate('jwt', { session: false }),
    validateParam(validateCartId, 'cid'),
    cartController.getCartById
);

// Crear un nuevo carrito
router.post('/', cartController.createCart);

// Agregar un producto al carrito (solo usuarios)
router.post('/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }),
    isUser,
    validateParam(validateCartId, 'cid'),
    validateParam(validateProductId, 'pid'),
    validateBody(validateProductQuantity),
    cartController.addProductToCart
);

// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }),
    validateParam(validateCartId, 'cid'),
    validateParam(validateProductId, 'pid'),
    cartController.removeProductFromCart
);

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', 
    passport.authenticate('jwt', { session: false }),
    validateParam(validateCartId, 'cid'),
    validateBody(validateCartUpdate),
    validateArrayItems('products', validateCartProductItem),
    cartController.updateCart
);

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }),
    validateParam(validateCartId, 'cid'),
    validateParam(validateProductId, 'pid'),
    validateBody(validateProductQuantity),
    cartController.updateProductQuantity
);

// Vaciar un carrito
router.delete('/:cid', 
    passport.authenticate('jwt', { session: false }),
    validateParam(validateCartId, 'cid'),
    cartController.emptyCart
);

// Finalizar la compra del carrito (solo usuarios)
router.post('/:cid/purchase', 
    passport.authenticate('jwt', { session: false }),
    isUser,
    validateParam(validateCartId, 'cid'),
    cartController.purchaseCart
);

module.exports = router; 