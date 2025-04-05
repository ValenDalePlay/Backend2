const express = require('express');
const router = express.Router();
const passport = require('passport');
const cartController = require('../controllers/cart.controller');
const { isAuthenticated, isCartOwner, checkRole } = require('../middlewares/auth.middlewares');
const { validateBody, validateParam, validateArrayItems } = require('../middlewares/validator.middleware');
const { 
    validateCartId, 
    validateProductId, 
    validateProductQuantity,
    validateCartUpdate,
    validateCartProductItem
} = require('../validators/cart.validator');

// Middleware de autenticación común para todas las rutas
const auth = passport.authenticate('jwt', { session: false });

// Obtener un carrito por ID (solo el dueño del carrito o administrador)
router.get('/:cid', 
    auth,
    validateParam(validateCartId, 'cid'),
    isCartOwner,
    cartController.getCartById
);

// Crear un nuevo carrito (público)
router.post('/', cartController.createCart);

// Agregar un producto al carrito (solo usuarios y dueño del carrito)
router.post('/:cid/product/:pid', 
    auth,
    validateParam(validateCartId, 'cid'),
    validateParam(validateProductId, 'pid'),
    validateBody(validateProductQuantity),
    isCartOwner,
    cartController.addProductToCart
);

// Eliminar un producto del carrito (solo el dueño del carrito)
router.delete('/:cid/product/:pid', 
    auth,
    validateParam(validateCartId, 'cid'),
    validateParam(validateProductId, 'pid'),
    isCartOwner,
    cartController.removeProductFromCart
);

// Actualizar el carrito con un arreglo de productos (solo el dueño del carrito)
router.put('/:cid', 
    auth,
    validateParam(validateCartId, 'cid'),
    validateBody(validateCartUpdate),
    validateArrayItems('products', validateCartProductItem),
    isCartOwner,
    cartController.updateCart
);

// Actualizar la cantidad de un producto en el carrito (solo el dueño del carrito)
router.put('/:cid/product/:pid', 
    auth,
    validateParam(validateCartId, 'cid'),
    validateParam(validateProductId, 'pid'),
    validateBody(validateProductQuantity),
    isCartOwner,
    cartController.updateProductQuantity
);

// Vaciar un carrito (solo el dueño del carrito)
router.delete('/:cid', 
    auth,
    validateParam(validateCartId, 'cid'),
    isCartOwner,
    cartController.emptyCart
);

// Finalizar la compra del carrito (solo el dueño del carrito)
router.post('/:cid/purchase', 
    auth,
    validateParam(validateCartId, 'cid'),
    isCartOwner,
    cartController.purchaseCart
);

module.exports = router; 