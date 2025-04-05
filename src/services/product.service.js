const productRepository = require('../repositories/product.repository');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class ProductService {
    async getAllProducts(limit = 10, page = 1, sort = null, query = null) {
        try {
            return await productRepository.getAll(limit, page, sort, query);
        } catch (error) {
            throw ErrorHandler.databaseError(
                'Error al obtener productos',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async getProductById(id) {
        try {
            const product = await productRepository.getById(id);
            if (!product) {
                throw ErrorHandler.notFoundError(
                    `Producto con ID ${id} no encontrado`,
                    ERROR_CODES.PRODUCT_NOT_FOUND
                );
            }
            return product;
        } catch (error) {
            // Si ya es un error personalizado, lo propagamos
            if (error.code) throw error;
            
            // Si es un error de formato de ID
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                throw ErrorHandler.validationError(
                    `El formato del ID "${id}" no es válido`,
                    ERROR_CODES.INVALID_ID_FORMAT
                );
            }
            
            throw ErrorHandler.databaseError(
                'Error al obtener producto por ID',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async createProduct(productData) {
        try {
            // Validaciones básicas
            if (!productData.title) {
                throw ErrorHandler.validationError(
                    'El título del producto es obligatorio',
                    ERROR_CODES.MISSING_REQUIRED_FIELDS
                );
            }
            
            if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
                throw ErrorHandler.validationError(
                    'El precio debe ser un número mayor a 0',
                    ERROR_CODES.INVALID_PRODUCT_DATA
                );
            }
            
            if (!productData.stock || isNaN(productData.stock) || productData.stock < 0) {
                throw ErrorHandler.validationError(
                    'El stock debe ser un número mayor o igual a 0',
                    ERROR_CODES.INVALID_PRODUCT_DATA
                );
            }
            
            return await productRepository.create(productData);
        } catch (error) {
            // Si ya es un error personalizado, lo propagamos
            if (error.code) throw error;

            // Si es un error de duplicidad (código de producto ya existe)
            if (error.name === 'MongoServerError' && error.code === 11000) {
                throw ErrorHandler.validationError(
                    'Ya existe un producto con ese código',
                    ERROR_CODES.DUPLICATE_KEY_ERROR,
                    { duplicateKey: 'code' }
                );
            }
            
            throw ErrorHandler.databaseError(
                'Error al crear producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async updateProduct(id, productData) {
        try {
            // Primero verificamos que el producto exista
            await this.getProductById(id);
            
            // Validaciones básicas si hay datos de precio o stock
            if (productData.price !== undefined && (isNaN(productData.price) || productData.price <= 0)) {
                throw ErrorHandler.validationError(
                    'El precio debe ser un número mayor a 0',
                    ERROR_CODES.INVALID_PRODUCT_DATA
                );
            }
            
            if (productData.stock !== undefined && (isNaN(productData.stock) || productData.stock < 0)) {
                throw ErrorHandler.validationError(
                    'El stock debe ser un número mayor o igual a 0',
                    ERROR_CODES.INVALID_PRODUCT_DATA
                );
            }
            
            return await productRepository.update(id, productData);
        } catch (error) {
            // Si ya es un error personalizado, lo propagamos
            if (error.code) throw error;
            
            throw ErrorHandler.databaseError(
                'Error al actualizar producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async deleteProduct(id) {
        try {
            // Primero verificamos que el producto exista
            await this.getProductById(id);
            
            return await productRepository.delete(id);
        } catch (error) {
            // Si ya es un error personalizado, lo propagamos
            if (error.code) throw error;
            
            throw ErrorHandler.databaseError(
                'Error al eliminar producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }
}

module.exports = new ProductService(); 