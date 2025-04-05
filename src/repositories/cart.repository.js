const cartDAO = require('../dao/mongo/cart.mongo.dao');

class CartRepository {
    async getById(id) {
        try {
            return await cartDAO.getById(id);
        } catch (error) {
            throw new Error(`Error en el repositorio de carrito: ${error.message}`);
        }
    }

    async create() {
        try {
            return await cartDAO.create();
        } catch (error) {
            throw new Error(`Error en el repositorio de carrito: ${error.message}`);
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            return await cartDAO.addProduct(cartId, productId, quantity);
        } catch (error) {
            throw new Error(`Error en el repositorio de carrito: ${error.message}`);
        }
    }

    async removeProduct(cartId, productId) {
        try {
            return await cartDAO.removeProduct(cartId, productId);
        } catch (error) {
            throw new Error(`Error en el repositorio de carrito: ${error.message}`);
        }
    }

    async updateCart(cartId, products) {
        try {
            return await cartDAO.updateCart(cartId, products);
        } catch (error) {
            throw new Error(`Error en el repositorio de carrito: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            return await cartDAO.updateProductQuantity(cartId, productId, quantity);
        } catch (error) {
            throw new Error(`Error en el repositorio de carrito: ${error.message}`);
        }
    }

    async emptyCart(cartId) {
        try {
            return await cartDAO.emptyCart(cartId);
        } catch (error) {
            throw new Error(`Error en el repositorio de carrito: ${error.message}`);
        }
    }
}

module.exports = new CartRepository(); 