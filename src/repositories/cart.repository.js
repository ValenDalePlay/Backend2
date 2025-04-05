const BaseRepository = require('./base.repository');
const { cartDAO } = require('../dao/dao.factory');
const { CartDTO } = require('../dto');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class CartRepository extends BaseRepository {
    constructor() {
        super(cartDAO, CartDTO);
    }

    /**
     * Agregar un producto al carrito
     * @param {string} cartId ID del carrito
     * @param {string} productId ID del producto
     * @param {number} quantity Cantidad a agregar
     * @returns {Object} Carrito actualizado
     */
    async addProduct(cartId, productId, quantity = 1) {
        try {
            const updatedCart = await this.dao.addProduct(cartId, productId, quantity);
            return this.dto.toResponse(updatedCart);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al agregar producto al carrito: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    /**
     * Eliminar un producto del carrito
     * @param {string} cartId ID del carrito
     * @param {string} productId ID del producto
     * @returns {Object} Carrito actualizado
     */
    async removeProduct(cartId, productId) {
        try {
            const updatedCart = await this.dao.removeProduct(cartId, productId);
            return this.dto.toResponse(updatedCart);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al eliminar producto del carrito: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    /**
     * Actualizar la cantidad de un producto en el carrito
     * @param {string} cartId ID del carrito
     * @param {string} productId ID del producto
     * @param {number} quantity Nueva cantidad
     * @returns {Object} Carrito actualizado
     */
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const updatedCart = await this.dao.updateProductQuantity(cartId, productId, quantity);
            return this.dto.toResponse(updatedCart);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al actualizar cantidad de producto: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    /**
     * Vaciar el carrito
     * @param {string} cartId ID del carrito
     * @returns {Object} Carrito vacío
     */
    async emptyCart(cartId) {
        try {
            const emptyCart = await this.dao.emptyCart(cartId);
            return this.dto.toResponse(emptyCart);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al vaciar carrito: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }
}

module.exports = new CartRepository(); 