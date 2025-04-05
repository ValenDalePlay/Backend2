// Tipos de errores
const ERROR_TYPES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    BUSINESS_ERROR: 'BUSINESS_ERROR',
    SERVER_ERROR: 'SERVER_ERROR'
};

// Códigos de errores específicos
const ERROR_CODES = {
    // Códigos de validación (100-199)
    INVALID_PRODUCT_DATA: 101,
    INVALID_USER_DATA: 102,
    INVALID_CART_DATA: 103,
    MISSING_REQUIRED_FIELDS: 104,
    INVALID_ID_FORMAT: 105,

    // Códigos de autenticación (200-299)
    INVALID_CREDENTIALS: 201,
    TOKEN_EXPIRED: 202,
    INVALID_TOKEN: 203,
    USER_ALREADY_EXISTS: 204,

    // Códigos de autorización (300-399)
    UNAUTHORIZED_ACCESS: 301,
    INSUFFICIENT_PERMISSIONS: 302,
    FORBIDDEN_OPERATION: 303,

    // Códigos de recurso no encontrado (400-499)
    USER_NOT_FOUND: 401,
    PRODUCT_NOT_FOUND: 402,
    CART_NOT_FOUND: 403,
    TICKET_NOT_FOUND: 404,
    RESOURCE_NOT_FOUND: 405,

    // Códigos de base de datos (500-599)
    DATABASE_CONNECTION_ERROR: 501,
    DATABASE_QUERY_ERROR: 502,
    DUPLICATE_KEY_ERROR: 503,
    TRANSACTION_ERROR: 504,

    // Códigos de lógica de negocio (600-699)
    INSUFFICIENT_STOCK: 601,
    CART_IS_EMPTY: 602,
    PRODUCT_ALREADY_IN_CART: 603,
    PAYMENT_FAILED: 604,

    // Códigos de error del servidor (700-799)
    INTERNAL_SERVER_ERROR: 701,
    SERVICE_UNAVAILABLE: 702
};

// Mapeo de códigos de error a mensajes por defecto
const DEFAULT_ERROR_MESSAGES = {
    // Mensajes de validación
    [ERROR_CODES.INVALID_PRODUCT_DATA]: 'Los datos del producto son inválidos',
    [ERROR_CODES.INVALID_USER_DATA]: 'Los datos del usuario son inválidos',
    [ERROR_CODES.INVALID_CART_DATA]: 'Los datos del carrito son inválidos',
    [ERROR_CODES.MISSING_REQUIRED_FIELDS]: 'Faltan campos requeridos',
    [ERROR_CODES.INVALID_ID_FORMAT]: 'El formato del ID es inválido',

    // Mensajes de autenticación
    [ERROR_CODES.INVALID_CREDENTIALS]: 'Credenciales inválidas',
    [ERROR_CODES.TOKEN_EXPIRED]: 'El token ha expirado',
    [ERROR_CODES.INVALID_TOKEN]: 'Token inválido',
    [ERROR_CODES.USER_ALREADY_EXISTS]: 'El usuario ya existe',

    // Mensajes de autorización
    [ERROR_CODES.UNAUTHORIZED_ACCESS]: 'Acceso no autorizado',
    [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: 'Permisos insuficientes',
    [ERROR_CODES.FORBIDDEN_OPERATION]: 'Operación prohibida',

    // Mensajes de recurso no encontrado
    [ERROR_CODES.USER_NOT_FOUND]: 'Usuario no encontrado',
    [ERROR_CODES.PRODUCT_NOT_FOUND]: 'Producto no encontrado',
    [ERROR_CODES.CART_NOT_FOUND]: 'Carrito no encontrado',
    [ERROR_CODES.TICKET_NOT_FOUND]: 'Ticket no encontrado',
    [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Recurso no encontrado',

    // Mensajes de base de datos
    [ERROR_CODES.DATABASE_CONNECTION_ERROR]: 'Error de conexión a la base de datos',
    [ERROR_CODES.DATABASE_QUERY_ERROR]: 'Error en la consulta a la base de datos',
    [ERROR_CODES.DUPLICATE_KEY_ERROR]: 'Clave duplicada',
    [ERROR_CODES.TRANSACTION_ERROR]: 'Error en la transacción',

    // Mensajes de lógica de negocio
    [ERROR_CODES.INSUFFICIENT_STOCK]: 'Stock insuficiente',
    [ERROR_CODES.CART_IS_EMPTY]: 'El carrito está vacío',
    [ERROR_CODES.PRODUCT_ALREADY_IN_CART]: 'El producto ya está en el carrito',
    [ERROR_CODES.PAYMENT_FAILED]: 'El pago ha fallado',

    // Mensajes de error del servidor
    [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Error interno del servidor',
    [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Servicio no disponible'
};

// Mapeo de tipos de error a códigos HTTP
const HTTP_STATUS_CODES = {
    [ERROR_TYPES.VALIDATION_ERROR]: 400,
    [ERROR_TYPES.AUTHENTICATION_ERROR]: 401,
    [ERROR_TYPES.AUTHORIZATION_ERROR]: 403,
    [ERROR_TYPES.NOT_FOUND_ERROR]: 404,
    [ERROR_TYPES.DATABASE_ERROR]: 500,
    [ERROR_TYPES.BUSINESS_ERROR]: 422,
    [ERROR_TYPES.SERVER_ERROR]: 500
};

module.exports = {
    ERROR_TYPES,
    ERROR_CODES,
    DEFAULT_ERROR_MESSAGES,
    HTTP_STATUS_CODES
}; 