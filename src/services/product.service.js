const { productDAO } = require('../dao/dao.factory');
const { ProductDTO } = require('../dto');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class ProductService {
    async getAllProducts(limit = 10, page = 1, sort = null, query = null) {
        try {
            const paginatedResult = await productDAO.getAll(limit, page, sort, query);
            // Usamos el método especializado para convertir resultados paginados
            return ProductDTO.toPaginatedResponse(paginatedResult, '/api/products');
        } catch (error) {
            // Si ya es un error personalizado (AppError), lo propagamos
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al obtener productos',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async getProductById(id) {
        try {
            const product = await productDAO.getById(id);
            return ProductDTO.toResponse(product);
        } catch (error) {
            // Si ya es un error personalizado, lo propagamos
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al obtener producto por ID',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async createProduct(productData) {
        try {
            // Convertimos los datos a formato de persistencia
            const productToCreate = ProductDTO.toPersistence(productData);
            
            // Creamos el producto
            const newProduct = await productDAO.create(productToCreate);
            
            // Retornamos la respuesta convertida a DTO
            return ProductDTO.toResponse(newProduct);
        } catch (error) {
            // Si ya es un error personalizado, lo propagamos
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al crear producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async updateProduct(id, productData) {
        try {
            // Convertimos los datos para actualización
            const updateData = ProductDTO.toUpdate(productData);
            
            // Actualizamos el producto
            const updatedProduct = await productDAO.update(id, updateData);
            
            // Retornamos la respuesta convertida a DTO
            return ProductDTO.toResponse(updatedProduct);
        } catch (error) {
            // Si ya es un error personalizado, lo propagamos
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al actualizar producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productDAO.delete(id);
            return ProductDTO.toResponse(deletedProduct);
        } catch (error) {
            // Si ya es un error personalizado, lo propagamos
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                'Error al eliminar producto',
                ERROR_CODES.DATABASE_QUERY_ERROR,
                { originalError: error.message }
            );
        }
    }
}

module.exports = new ProductService(); 