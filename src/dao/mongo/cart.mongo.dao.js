const CartModel = require('../models/cart.model');

class CartMongoDAO {
    async getById(id) {
        try {
            return await CartModel.findById(id).populate('products.product');
        } catch (error) {
            throw new Error(`Error al obtener carrito por ID: ${error.message}`);
        }
    }

    async create() {
        try {
            return await CartModel.create({ products: [] });
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    async addProduct(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getById(cartId);
            
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            const productIndex = cart.products.findIndex(
                item => item.product._id.toString() === productId
            );

            if (productIndex === -1) {
                // El producto no está en el carrito, lo agregamos
                cart.products.push({ product: productId, quantity });
            } else {
                // El producto ya está en el carrito, actualizamos la cantidad
                cart.products[productIndex].quantity += quantity;
            }

            return await cart.save();
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await this.getById(cartId);
            
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            cart.products = cart.products.filter(
                item => item.product._id.toString() !== productId
            );

            return await cart.save();
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    async updateCart(cartId, products) {
        try {
            return await CartModel.findByIdAndUpdate(
                cartId,
                { products },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error al actualizar carrito: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getById(cartId);
            
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }

            const productIndex = cart.products.findIndex(
                item => item.product._id.toString() === productId
            );

            if (productIndex === -1) {
                throw new Error(`Producto con ID ${productId} no encontrado en el carrito`);
            }

            cart.products[productIndex].quantity = quantity;

            return await cart.save();
        } catch (error) {
            throw new Error(`Error al actualizar cantidad de producto: ${error.message}`);
        }
    }

    async emptyCart(cartId) {
        try {
            return await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    }
}

module.exports = new CartMongoDAO(); 