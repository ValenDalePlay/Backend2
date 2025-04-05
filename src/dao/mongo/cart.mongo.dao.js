const CartModel = require('../../models/cart.model');
const DAO = require('../dao.interface');
const { ErrorHandler, ERROR_CODES } = require('../../utils/error-handler');

class CartMongoDAO extends DAO {
    async getAll() {
        try {
            return await CartModel.find().populate('products.product').lean();
        } catch (error) {
            throw ErrorHandler.databaseError(
                `Error al obtener carritos: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async getById(id) {
        try {
            const cart = await CartModel.findById(id).populate('products.product');
            if (!cart) {
                throw ErrorHandler.notFoundError(
                    `Carrito con ID ${id} no encontrado`,
                    ERROR_CODES.CART_NOT_FOUND
                );
            }
            return cart;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al obtener carrito por ID: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async create(cartData = { products: [] }) {
        try {
            return await CartModel.create(cartData);
        } catch (error) {
            throw ErrorHandler.databaseError(
                `Error al crear carrito: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async update(id, cartData) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(
                id,
                cartData,
                { new: true }
            ).populate('products.product');

            if (!updatedCart) {
                throw ErrorHandler.notFoundError(
                    `Carrito con ID ${id} no encontrado`,
                    ERROR_CODES.CART_NOT_FOUND
                );
            }
            
            return updatedCart;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al actualizar carrito: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async delete(id) {
        try {
            const deletedCart = await CartModel.findByIdAndDelete(id);
            if (!deletedCart) {
                throw ErrorHandler.notFoundError(
                    `Carrito con ID ${id} no encontrado`,
                    ERROR_CODES.CART_NOT_FOUND
                );
            }
            return deletedCart;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al eliminar carrito: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async addProduct(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getById(cartId);
            
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
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al agregar producto al carrito: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await this.getById(cartId);
            
            cart.products = cart.products.filter(
                item => item.product._id.toString() !== productId
            );

            return await cart.save();
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al eliminar producto del carrito: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getById(cartId);
            
            const productIndex = cart.products.findIndex(
                item => item.product._id.toString() === productId
            );

            if (productIndex === -1) {
                throw ErrorHandler.notFoundError(
                    `Producto con ID ${productId} no encontrado en el carrito`,
                    ERROR_CODES.PRODUCT_NOT_FOUND
                );
            }

            cart.products[productIndex].quantity = quantity;

            return await cart.save();
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al actualizar cantidad de producto: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await this.getById(cartId);
            
            cart.products = [];

            return await cart.save();
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al vaciar carrito: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }
}

module.exports = new CartMongoDAO(); 