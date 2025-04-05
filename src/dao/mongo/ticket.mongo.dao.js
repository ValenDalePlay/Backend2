const TicketModel = require('../../models/ticket.model');
const DAO = require('../dao.interface');
const { ErrorHandler, ERROR_CODES } = require('../../utils/error-handler');

class TicketMongoDAO extends DAO {
    async getAll() {
        try {
            return await TicketModel.find().lean();
        } catch (error) {
            throw ErrorHandler.databaseError(
                `Error al obtener tickets: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async getById(id) {
        try {
            const ticket = await TicketModel.findById(id);
            if (!ticket) {
                throw ErrorHandler.notFoundError(
                    `Ticket con ID ${id} no encontrado`,
                    ERROR_CODES.TICKET_NOT_FOUND
                );
            }
            return ticket;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al obtener ticket por ID: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async create(ticketData) {
        try {
            return await TicketModel.create(ticketData);
        } catch (error) {
            throw ErrorHandler.databaseError(
                `Error al crear ticket: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async update(id, ticketData) {
        try {
            const updatedTicket = await TicketModel.findByIdAndUpdate(id, ticketData, { new: true });
            if (!updatedTicket) {
                throw ErrorHandler.notFoundError(
                    `Ticket con ID ${id} no encontrado`,
                    ERROR_CODES.TICKET_NOT_FOUND
                );
            }
            return updatedTicket;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al actualizar ticket: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async delete(id) {
        try {
            const deletedTicket = await TicketModel.findByIdAndDelete(id);
            if (!deletedTicket) {
                throw ErrorHandler.notFoundError(
                    `Ticket con ID ${id} no encontrado`,
                    ERROR_CODES.TICKET_NOT_FOUND
                );
            }
            return deletedTicket;
        } catch (error) {
            if (error.name === 'AppError') throw error;
            throw ErrorHandler.databaseError(
                `Error al eliminar ticket: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }

    async getByPurchaser(email) {
        try {
            return await TicketModel.find({ purchaser: email }).lean();
        } catch (error) {
            throw ErrorHandler.databaseError(
                `Error al obtener tickets por comprador: ${error.message}`,
                ERROR_CODES.DATABASE_ERROR
            );
        }
    }
}

module.exports = new TicketMongoDAO(); 