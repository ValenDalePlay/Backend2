const TicketModel = require('../models/ticket.model');

class TicketMongoDAO {
    async getAll() {
        try {
            return await TicketModel.find().lean();
        } catch (error) {
            throw new Error(`Error al obtener tickets: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await TicketModel.findById(id);
        } catch (error) {
            throw new Error(`Error al obtener ticket por ID: ${error.message}`);
        }
    }

    async create(ticketData) {
        try {
            return await TicketModel.create(ticketData);
        } catch (error) {
            throw new Error(`Error al crear ticket: ${error.message}`);
        }
    }

    async getByPurchaser(email) {
        try {
            return await TicketModel.find({ purchaser: email }).lean();
        } catch (error) {
            throw new Error(`Error al obtener tickets por comprador: ${error.message}`);
        }
    }
}

module.exports = new TicketMongoDAO(); 