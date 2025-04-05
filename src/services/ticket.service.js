const ticketRepository = require('../repositories/ticket.repository');
const productRepository = require('../repositories/product.repository');
const cartService = require('./cart.service');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class TicketService {
    async getAllTickets() {
        try {
            return await ticketRepository.getAll();
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al obtener tickets',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async getTicketById(id) {
        try {
            return await ticketRepository.getById(id);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al obtener ticket por ID',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async createTicket(ticketData) {
        try {
            return await ticketRepository.create(ticketData);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al crear ticket',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async getTicketsByPurchaser(email) {
        try {
            return await ticketRepository.getByPurchaser(email);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al obtener tickets por comprador',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async processPurchase(cartId, userEmail) {
        try {
            const cart = await cartService.getCartById(cartId);
            
            if (!cart || cart.products.length === 0) {
                throw ErrorHandler.validationError(
                    'El carrito está vacío o no existe',
                    ERROR_CODES.EMPTY_CART
                );
            }

            const productsFailed = [];
            const productsPurchased = [];
            let totalAmount = 0;

            // Iteramos sobre cada producto en el carrito
            for (const item of cart.products) {
                try {
                    const productId = typeof item.product === 'object' ? item.product.id : item.product;
                    
                    // Verificamos si hay suficiente stock
                    const hasStock = await productRepository.hasStock(productId, item.quantity);
                    
                    if (hasStock) {
                        // Hay suficiente stock, reducimos el stock
                        const product = await productRepository.getById(productId);
                        await productRepository.reduceStock(productId, item.quantity);
                        
                        // Calculamos el precio total de este item
                        const itemPrice = product.price * item.quantity;
                        totalAmount += itemPrice;
                        
                        // Agregamos a productos comprados exitosamente
                        productsPurchased.push({
                            product: productId,
                            quantity: item.quantity,
                            price: product.price
                        });
                    } else {
                        // No hay suficiente stock
                        productsFailed.push(productId);
                    }
                } catch (error) {
                    // Si hay algún error, agregamos el producto a los que fallaron
                    const productId = typeof item.product === 'object' ? item.product.id : item.product;
                    productsFailed.push(productId);
                }
            }

            // Crear el ticket si hay productos comprados
            let ticket = null;
            if (productsPurchased.length > 0) {
                ticket = await this.createTicket({
                    amount: totalAmount,
                    purchaser: userEmail
                });
            }

            // Actualizamos el carrito para que solo contenga los productos que no se pudieron comprar
            if (productsFailed.length > 0) {
                const updatedCartProducts = cart.products.filter(item => {
                    const productId = typeof item.product === 'object' ? item.product.id : item.product;
                    return productsFailed.includes(productId);
                });
                
                await cartService.updateCart(cartId, updatedCartProducts);
            } else {
                // Si todos los productos fueron comprados, vaciamos el carrito
                await cartService.emptyCart(cartId);
            }

            return {
                ticket,
                productsFailed
            };
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al procesar la compra',
                ERROR_CODES.PURCHASE_PROCESS_ERROR,
                { originalError: error.message }
            );
        }
    }
}

module.exports = new TicketService(); 