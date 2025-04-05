const express = require('express');
const router = express.Router();
const passport = require('passport');
const productController = require('../controllers/product.controller');
const { isAdmin } = require('../middlewares/auth.middlewares');

// Obtener todos los productos (público)
router.get('/', productController.getAllProducts);

// Obtener un producto por ID (público)
router.get('/:pid', productController.getProductById);

// Crear un producto (solo admin)
router.post('/', 
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    productController.createProduct
);

// Actualizar un producto (solo admin)
router.put('/:pid', 
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    productController.updateProduct
);

// Eliminar un producto (solo admin)
router.delete('/:pid', 
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    productController.deleteProduct
);

module.exports = router; 