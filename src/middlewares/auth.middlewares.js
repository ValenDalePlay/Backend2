// Middleware para verificar si el usuario es admin
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ status: 'error', error: 'No autorizado' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ status: 'error', error: 'No tienes permisos para realizar esta acción' });
    }
    
    next();
};

// Middleware para verificar si el usuario es un usuario normal
const isUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ status: 'error', error: 'No autorizado' });
    }
    
    if (req.user.role !== 'user') {
        return res.status(403).json({ status: 'error', error: 'No tienes permisos para realizar esta acción' });
    }
    
    next();
};

module.exports = {
    isAdmin,
    isUser
}; 