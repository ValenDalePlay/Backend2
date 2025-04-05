const ticketDAO = require('../dao/mongo/ticket.mongo.dao');

class TicketRepository {
    async getAll() {
        try {
            return await ticketDAO.getAll();
        } catch (error) {
            throw new Error(`Error en el repositorio de ticket: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await ticketDAO.getById(id);
        } catch (error) {
            throw new Error(`Error en el repositorio de ticket: ${error.message}`);
        }
    }

    async create(ticketData) {
        try {
            return await ticketDAO.create(ticketData);
        } catch (error) {
            throw new Error(`Error en el repositorio de ticket: ${error.message}`);
        }
    }

    async getByPurchaser(email) {
        try {
            return await ticketDAO.getByPurchaser(email);
        } catch (error) {
            throw new Error(`Error en el repositorio de ticket: ${error.message}`);
        }
    }
}

module.exports = new TicketRepository(); 