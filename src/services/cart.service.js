const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class CartService {
    async getAllCarts() {
        try {
            return await cartRepository.getAll();
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al obtener carritos',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async getCartById(id) {
        try {
            return await cartRepository.getById(id);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al obtener carrito por ID',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async createCart() {
        try {
            return await cartRepository.create();
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al crear carrito',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            // Verificamos que el producto exista
            await productRepository.getById(productId);
            
            // Agregamos el producto
            return await cartRepository.addProduct(cartId, productId, quantity);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al agregar producto al carrito',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            return await cartRepository.removeProduct(cartId, productId);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al eliminar producto del carrito',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async updateCart(cartId, products) {
        try {
            return await cartRepository.update(cartId, { products });
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al actualizar carrito',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            if (quantity <= 0) {
                throw ErrorHandler.validationError(
                    'La cantidad debe ser mayor a 0',
                    ERROR_CODES.INVALID_QUANTITY
                );
            }
            
            // Verificamos que el producto exista
            await productRepository.getById(productId);
            
            return await cartRepository.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al actualizar cantidad de producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async emptyCart(cartId) {
        try {
            return await cartRepository.emptyCart(cartId);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al vaciar carrito',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }
}

module.exports = new CartService(); 