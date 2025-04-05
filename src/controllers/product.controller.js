const productService = require('../services/product.service');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class ProductController {
    async getAllProducts(req, res, next) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            
            const result = await productService.getAllProducts(
                parseInt(limit), 
                parseInt(page), 
                sort, 
                query
            );
            
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
            
            const response = {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}` : null
            };
            
            res.json(response);
        } catch (error) {
            next(ErrorHandler.databaseError('Error al obtener productos', ERROR_CODES.DATABASE_QUERY_ERROR));
        }
    }

    async getProductById(req, res, next) {
        try {
            const { pid } = req.params;
            const product = await productService.getProductById(pid);
            
            res.json({ status: 'success', payload: product });
        } catch (error) {
            // Si el error es que no se encuentra el producto
            if (error.message.includes('no encontrado')) {
                return next(ErrorHandler.notFoundError(
                    `Producto con ID ${req.params.pid} no encontrado`,
                    ERROR_CODES.PRODUCT_NOT_FOUND
                ));
            }
            next(error);
        }
    }

    async createProduct(req, res, next) {
        try {
            const productData = req.body;
            
            if (!productData.title || !productData.description || !productData.code || 
                !productData.price || !productData.stock || !productData.category) {
                return next(ErrorHandler.validationError(
                    'Faltan datos obligatorios del producto',
                    ERROR_CODES.MISSING_REQUIRED_FIELDS,
                    { requiredFields: ['title', 'description', 'code', 'price', 'stock', 'category'] }
                ));
            }
            
            const newProduct = await productService.createProduct(productData);
            
            res.status(201).json({ 
                status: 'success', 
                message: 'Producto creado exitosamente',
                payload: newProduct 
            });
        } catch (error) {
            // Si es un error de duplicidad (código de producto ya existe)
            if (error.name === 'MongoServerError' && error.code === 11000) {
                return next(ErrorHandler.validationError(
                    'Ya existe un producto con ese código',
                    ERROR_CODES.DUPLICATE_KEY_ERROR,
                    { duplicateKey: 'code' }
                ));
            }
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { pid } = req.params;
            const productData = req.body;
            
            const updatedProduct = await productService.updateProduct(pid, productData);
            
            res.json({ 
                status: 'success', 
                message: 'Producto actualizado exitosamente',
                payload: updatedProduct 
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return next(ErrorHandler.notFoundError(
                    `Producto con ID ${req.params.pid} no encontrado`,
                    ERROR_CODES.PRODUCT_NOT_FOUND
                ));
            }
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { pid } = req.params;
            await productService.deleteProduct(pid);
            
            res.json({ 
                status: 'success', 
                message: 'Producto eliminado exitosamente'
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return next(ErrorHandler.notFoundError(
                    `Producto con ID ${req.params.pid} no encontrado`,
                    ERROR_CODES.PRODUCT_NOT_FOUND
                ));
            }
            next(error);
        }
    }
}

module.exports = new ProductController(); 