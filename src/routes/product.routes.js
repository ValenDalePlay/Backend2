const express = require('express');
const router = express.Router();
const passport = require('passport');
const productController = require('../controllers/product.controller');
const { isAdmin } = require('../middlewares/auth.middlewares');
const { validateBody, validateParam } = require('../middlewares/validator.middleware');
const { 
    validateCreateProduct, 
    validateUpdateProduct, 
    validateProductId 
} = require('../validators/product.validator');

// Middleware de autenticación común
const auth = passport.authenticate('jwt', { session: false });

// Obtener todos los productos (público)
router.get('/', productController.getAllProducts);

// Obtener un producto por ID (público)
router.get('/:pid', 
    validateParam(validateProductId, 'pid'),
    productController.getProductById
);

// Crear un producto (solo admin)
router.post('/', 
    auth,
    isAdmin,
    validateBody(validateCreateProduct),
    productController.createProduct
);

// Actualizar un producto (solo admin)
router.put('/:pid', 
    auth,
    isAdmin,
    validateParam(validateProductId, 'pid'),
    validateBody(validateUpdateProduct),
    productController.updateProduct
);

// Eliminar un producto (solo admin)
router.delete('/:pid', 
    auth,
    isAdmin,
    validateParam(validateProductId, 'pid'),
    productController.deleteProduct
);

module.exports = router; 