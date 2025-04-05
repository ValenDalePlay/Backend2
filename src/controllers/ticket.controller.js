const ticketService = require('../services/ticket.service');

class TicketController {
    async getAllTickets(req, res) {
        try {
            const tickets = await ticketService.getAllTickets();
            
            res.json({ status: 'success', payload: tickets });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    async getTicketById(req, res) {
        try {
            const { tid } = req.params;
            const ticket = await ticketService.getTicketById(tid);
            
            res.json({ status: 'success', payload: ticket });
        } catch (error) {
            res.status(404).json({ status: 'error', error: error.message });
        }
    }

    async getTicketsByUser(req, res) {
        try {
            const userEmail = req.user.email;
            const tickets = await ticketService.getTicketsByPurchaser(userEmail);
            
            res.json({ status: 'success', payload: tickets });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }
}

module.exports = new TicketController(); 