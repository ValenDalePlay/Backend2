const BaseRepository = require('./base.repository');
const { productDAO } = require('../dao/dao.factory');
const { ProductDTO } = require('../dto');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class ProductRepository extends BaseRepository {
    constructor() {
        super(productDAO, ProductDTO);
    }

    /**
     * Obtener productos con paginación y filtros
     * @param {number} limit Cantidad de elementos por página
     * @param {number} page Número de página
     * @param {string} sort Ordenamiento (asc, desc)
     * @param {string} query Filtro de categoría
     * @returns {Object} Resultado paginado
     */
    async getAllProducts(limit = 10, page = 1, sort = null, query = null) {
        try {
            const paginatedResult = await this.dao.getAll(limit, page, sort, query);
            return this.dto.toPaginatedResponse(paginatedResult, '/api/products');
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al obtener productos paginados: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    /**
     * Verificar si hay stock suficiente de un producto
     * @param {string} productId ID del producto
     * @param {number} quantity Cantidad requerida
     * @returns {boolean} true si hay stock suficiente
     */
    async hasStock(productId, quantity) {
        try {
            const product = await this.dao.getById(productId);
            return product.stock >= quantity;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al verificar stock: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    /**
     * Restar stock de un producto
     * @param {string} productId ID del producto
     * @param {number} quantity Cantidad a restar
     * @returns {Object} Producto actualizado
     */
    async reduceStock(productId, quantity) {
        try {
            const product = await this.dao.getById(productId);
            const newStock = product.stock - quantity;
            
            if (newStock < 0) {
                throw ErrorHandler.validationError(
                    'No hay suficiente stock',
                    ERROR_CODES.INSUFFICIENT_STOCK
                );
            }
            
            return await this.dao.update(productId, { stock: newStock });
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al reducir stock: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }
}

module.exports = new ProductRepository(); 