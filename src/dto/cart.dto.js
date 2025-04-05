const DTO = require('./dto.interface');
const ProductDTO = require('./product.dto');

class CartDTO extends DTO {
    /**
     * Convierte un carrito a formato de respuesta
     * @param {Object} cart - Carrito del modelo
     * @returns {Object} - DTO para respuesta
     */
    static toResponse(cart) {
        if (!cart) return null;

        return {
            id: cart._id || cart.id,
            products: cart.products.map(item => ({
                product: item.product._id 
                    ? ProductDTO.toResponse(item.product)
                    : item.product,
                quantity: item.quantity
            })),
            createdAt: cart.createdAt || cart.created_at,
            updatedAt: cart.updatedAt || cart.updated_at
        };
    }

    /**
     * Convierte un carrito para creación en formato de persistencia
     * @returns {Object} - DTO para persistencia
     */
    static toPersistence() {
        return {
            products: []
        };
    }

    /**
     * Convierte datos para agregar un producto al carrito
     * @param {string} productId - ID del producto a agregar
     * @param {number} quantity - Cantidad a agregar
     * @returns {Object} - DTO para agregar producto
     */
    static toAddProduct(productId, quantity = 1) {
        return {
            product: productId,
            quantity: Number(quantity)
        };
    }

    /**
     * Convierte datos para actualizar un carrito completo
     * @param {Array} products - Array de productos con sus cantidades
     * @returns {Object} - DTO para actualización
     */
    static toUpdate(products) {
        if (!Array.isArray(products)) {
            return { products: [] };
        }

        return {
            products: products.map(item => ({
                product: item.product,
                quantity: Number(item.quantity)
            }))
        };
    }
}

module.exports = CartDTO; 