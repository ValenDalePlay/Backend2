const BaseRepository = require('./base.repository');
const { ticketDAO } = require('../dao/dao.factory');
const { TicketDTO } = require('../dto');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class TicketRepository extends BaseRepository {
    constructor() {
        super(ticketDAO, TicketDTO);
    }

    /**
     * Obtener tickets por comprador
     * @param {string} email Email del comprador
     * @returns {Array} Lista de tickets del comprador
     */
    async getByPurchaser(email) {
        try {
            const tickets = await this.dao.getByPurchaser(email);
            return this.dto.toResponseList(tickets);
        } catch (error) {
            if (error.name === 'AppError') throw error;
            
            throw ErrorHandler.databaseError(
                `Error al obtener tickets por comprador: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }
}

module.exports = new TicketRepository(); 