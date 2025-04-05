const productRepository = require('../repositories/product.repository');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class ProductService {
    async getAllProducts(limit = 10, page = 1, sort = null, query = null) {
        try {
            return await productRepository.getAllProducts(limit, page, sort, query);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al obtener productos',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async getProductById(id) {
        try {
            return await productRepository.getById(id);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al obtener producto por ID',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async createProduct(productData) {
        try {
            return await productRepository.create(productData);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al crear producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async updateProduct(id, productData) {
        try {
            return await productRepository.update(id, productData);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al actualizar producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async deleteProduct(id) {
        try {
            return await productRepository.delete(id);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al eliminar producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async hasStock(productId, quantity) {
        try {
            return await productRepository.hasStock(productId, quantity);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al verificar stock',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async reduceStock(productId, quantity) {
        try {
            return await productRepository.reduceStock(productId, quantity);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al reducir stock',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }
}

module.exports = new ProductService(); 