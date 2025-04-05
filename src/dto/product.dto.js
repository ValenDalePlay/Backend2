const DTO = require('./dto.interface');

class ProductDTO extends DTO {
    /**
     * Convierte un producto a formato de respuesta
     * @param {Object} product - Producto del modelo
     * @returns {Object} - DTO para respuesta
     */
    static toResponse(product) {
        if (!product) return null;

        return {
            id: product._id || product.id,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            stock: product.stock,
            category: product.category,
            thumbnails: product.thumbnails || [],
            createdAt: product.createdAt || product.created_at
        };
    }

    /**
     * Convierte una solicitud de creación a formato de persistencia
     * @param {Object} productData - Datos del producto de la solicitud
     * @returns {Object} - DTO para persistencia
     */
    static toPersistence(productData) {
        if (!productData) return null;

        return {
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };
    }

    /**
     * Convierte datos de producto para actualización
     * @param {Object} productData - Datos del producto para actualizar
     * @returns {Object} - DTO para actualización
     */
    static toUpdate(productData) {
        const updateData = {};

        if (productData.title) {
            updateData.title = productData.title;
        }

        if (productData.description) {
            updateData.description = productData.description;
        }

        if (productData.code) {
            updateData.code = productData.code;
        }

        if (productData.price !== undefined) {
            updateData.price = productData.price;
        }

        if (productData.stock !== undefined) {
            updateData.stock = productData.stock;
        }

        if (productData.category) {
            updateData.category = productData.category;
        }

        if (productData.thumbnails) {
            updateData.thumbnails = productData.thumbnails;
        }

        return updateData;
    }

    /**
     * Convierte resultados paginados a formato de respuesta
     * @param {Object} paginatedResult - Resultado paginado de mongoose-paginate
     * @param {string} baseUrl - URL base para los enlaces de paginación
     * @returns {Object} - DTO para respuesta paginada
     */
    static toPaginatedResponse(paginatedResult, baseUrl) {
        if (!paginatedResult) return null;

        const { docs, totalDocs, limit, totalPages, page, hasPrevPage, hasNextPage, prevPage, nextPage } = paginatedResult;

        // Convertir cada documento a formato de respuesta
        const products = this.toResponseList(docs);

        // Construir URLs para navegación
        const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}` : null;

        return {
            status: 'success',
            payload: products,
            totalDocs,
            limit,
            totalPages,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            prevLink,
            nextLink
        };
    }
}

module.exports = ProductDTO; 