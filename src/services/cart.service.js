const cartRepository = require('../repositories/cart.repository');
const productService = require('./product.service');

class CartService {
    async getCartById(id) {
        const cart = await cartRepository.getById(id);
        if (!cart) {
            throw new Error(`Carrito con ID ${id} no encontrado`);
        }
        return cart;
    }

    async createCart() {
        return await cartRepository.create();
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        // Verificamos que el producto exista
        await productService.getProductById(productId);
        
        return await cartRepository.addProduct(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        return await cartRepository.removeProduct(cartId, productId);
    }

    async updateCart(cartId, products) {
        return await cartRepository.updateCart(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }
        
        // Verificamos que el producto exista
        await productService.getProductById(productId);
        
        return await cartRepository.updateProductQuantity(cartId, productId, quantity);
    }

    async emptyCart(cartId) {
        return await cartRepository.emptyCart(cartId);
    }
}

module.exports = new CartService(); 