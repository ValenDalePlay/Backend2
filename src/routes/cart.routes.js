const express = require('express');
const router = express.Router();
const passport = require('passport');
const cartController = require('../controllers/cart.controller');
const { isUser } = require('../middlewares/auth.middlewares');

// Obtener un carrito por ID
router.get('/:cid', 
    passport.authenticate('jwt', { session: false }),
    cartController.getCartById
);

// Crear un nuevo carrito
router.post('/', cartController.createCart);

// Agregar un producto al carrito (solo usuarios)
router.post('/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }),
    isUser,
    cartController.addProductToCart
);

// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }),
    cartController.removeProductFromCart
);

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', 
    passport.authenticate('jwt', { session: false }),
    cartController.updateCart
);

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }),
    cartController.updateProductQuantity
);

// Vaciar un carrito
router.delete('/:cid', 
    passport.authenticate('jwt', { session: false }),
    cartController.emptyCart
);

// Finalizar la compra del carrito (solo usuarios)
router.post('/:cid/purchase', 
    passport.authenticate('jwt', { session: false }),
    isUser,
    cartController.purchaseCart
);

module.exports = router; 