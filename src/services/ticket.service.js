const ticketRepository = require('../repositories/ticket.repository');
const cartService = require('./cart.service');
const productService = require('./product.service');

class TicketService {
    async getAllTickets() {
        return await ticketRepository.getAll();
    }

    async getTicketById(id) {
        const ticket = await ticketRepository.getById(id);
        if (!ticket) {
            throw new Error(`Ticket con ID ${id} no encontrado`);
        }
        return ticket;
    }

    async createTicket(ticketData) {
        return await ticketRepository.create(ticketData);
    }

    async getTicketsByPurchaser(email) {
        return await ticketRepository.getByPurchaser(email);
    }

    async processPurchase(cartId, userEmail) {
        const cart = await cartService.getCartById(cartId);
        
        if (!cart || cart.products.length === 0) {
            throw new Error('El carrito está vacío o no existe');
        }

        const productsFailed = [];
        const productsPurchased = [];
        let totalAmount = 0;

        // Iteramos sobre cada producto en el carrito
        for (const item of cart.products) {
            try {
                const product = await productService.getProductById(item.product._id);
                
                // Verificamos si hay suficiente stock
                if (product.stock >= item.quantity) {
                    // Hay suficiente stock
                    product.stock -= item.quantity;
                    await productService.updateProduct(product._id, { stock: product.stock });
                    
                    // Calculamos el precio total de este item
                    const itemPrice = product.price * item.quantity;
                    totalAmount += itemPrice;
                    
                    // Agregamos a productos comprados exitosamente
                    productsPurchased.push({
                        product: item.product._id,
                        quantity: item.quantity,
                        price: product.price
                    });
                } else {
                    // No hay suficiente stock
                    productsFailed.push(item.product._id);
                }
            } catch (error) {
                // Si hay algún error, agregamos el producto a los que fallaron
                productsFailed.push(item.product._id);
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
        const updatedCartProducts = cart.products.filter(item => 
            productsFailed.includes(item.product._id.toString())
        );
        
        await cartService.updateCart(cartId, updatedCartProducts);

        return {
            ticket,
            productsFailed
        };
    }
}

module.exports = new TicketService(); 