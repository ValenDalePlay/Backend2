# API de E-commerce - Backend

API RESTful para un sistema de e-commerce con autenticación JWT, gestión de productos, carritos y procesamiento de compras.

## Tabla de Contenido

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Endpoints](#endpoints)
  - [Usuarios y Autenticación](#usuarios-y-autenticación)
  - [Productos](#productos)
  - [Carritos](#carritos)
  - [Compras](#compras)

## Estructura del Proyecto

El proyecto sigue una arquitectura en capas con el patrón Repository:

```
src/
  ├── app.js                     # Punto de entrada de la aplicación
  ├── config/                    # Configuraciones
  │   └── passport.config.js     # Configuración de estrategias de Passport
  ├── controllers/               # Controladores
  │   ├── cart.controller.js
  │   ├── product.controller.js
  │   ├── ticket.controller.js
  │   └── user.controller.js
  ├── dao/                       # Capa de acceso a datos
  │   ├── models/                # Modelos de Mongoose
  │   │   ├── cart.model.js
  │   │   ├── product.model.js
  │   │   ├── ticket.model.js
  │   │   └── user.model.js
  │   ├── mongo/                 # Implementaciones DAO para MongoDB
  │   │   ├── cart.mongo.dao.js
  │   │   ├── product.mongo.dao.js
  │   │   ├── ticket.mongo.dao.js
  │   │   └── user.mongo.dao.js
  │   ├── dao.factory.js         # Factory para seleccionar implementación
  │   └── dao.interface.js       # Interfaz DAO
  ├── dto/                       # Objetos de transferencia de datos
  │   ├── cart.dto.js
  │   ├── product.dto.js
  │   ├── ticket.dto.js
  │   ├── user.dto.js
  │   ├── dto.interface.js
  │   └── index.js
  ├── middlewares/               # Middlewares
  │   ├── auth.middlewares.js    # Middlewares de autenticación
  │   ├── error.middleware.js    # Manejo centralizado de errores
  │   └── validator.middleware.js # Validación de datos
  ├── repositories/              # Repositorios
  │   ├── base.repository.js
  │   ├── cart.repository.js
  │   ├── product.repository.js
  │   └── ticket.repository.js
  ├── routes/                    # Rutas
  │   ├── cart.routes.js
  │   ├── product.routes.js
  │   ├── ticket.routes.js
  │   └── user.routes.js
  ├── services/                  # Servicios
  │   ├── cart.service.js
  │   ├── product.service.js
  │   ├── ticket.service.js
  │   └── user.service.js
  ├── utils/                     # Utilidades
  │   ├── error-constants.js     # Constantes de error
  │   └── error-handler.js       # Manejador de errores
  └── validators/                # Validadores
      ├── cart.validator.js
      ├── product.validator.js
      ├── ticket.validator.js
      ├── user.validator.js
      ├── validator-builder.js
      └── validator-functions.js
```

## Requisitos

- Node.js >= 14.x
- MongoDB >= 4.x
- npm >= 6.x

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-repositorio>
   cd <nombre-repositorio>
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crear un archivo `.env` con las siguientes variables:
   ```
   JWT_SECRET=tu_clave_secreta_jwt
   MONGODB_URI=mongodb://localhost:27017/tu_base_de_datos
   PORT=8080
   ```

## Ejecución

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

Para iniciar el servidor en modo producción:
```bash
npm start
```

## Endpoints

### Usuarios y Autenticación

#### Registro de Usuario
- **URL**: `/api/users/register`
- **Método**: `POST`
- **Body**:
  ```json
  {
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "age": 30
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Usuario registrado exitosamente",
    "payload": {
      "id": "60d21b4667d0d8992e610c85",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "role": "user",
      "cart": "60d21b4667d0d8992e610c86"
    }
  }
  ```

#### Login
- **URL**: `/api/users/login`
- **Método**: `POST`
- **Body**:
  ```json
  {
    "email": "juan@example.com",
    "password": "password123"
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Login exitoso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Usuario Actual
- **URL**: `/api/users/current`
- **Método**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "payload": {
      "id": "60d21b4667d0d8992e610c85",
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "role": "user",
      "cart": "60d21b4667d0d8992e610c86"
    }
  }
  ```

#### Logout
- **URL**: `/api/users/logout`
- **Método**: `GET`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Logout exitoso"
  }
  ```

### Productos

#### Obtener todos los productos
- **URL**: `/api/products?limit=10&page=1&sort=asc&query=category:electronica`
- **Método**: `GET`
- **Parámetros Query**:
  - `limit`: Cantidad de productos por página (opcional, default: 10)
  - `page`: Número de página (opcional, default: 1)
  - `sort`: Ordenamiento por precio ('asc' o 'desc', opcional)
  - `query`: Filtro por categoría (opcional, formato: 'category:valor')
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "payload": {
      "docs": [...],
      "totalDocs": 100,
      "limit": 10,
      "totalPages": 10,
      "page": 1,
      "hasPrevPage": false,
      "hasNextPage": true,
      "prevPage": null,
      "nextPage": 2
    }
  }
  ```

#### Obtener un producto por ID
- **URL**: `/api/products/:pid`
- **Método**: `GET`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "payload": {
      "id": "60d21b4667d0d8992e610c85",
      "title": "Smartphone XYZ",
      "description": "Un smartphone de última generación",
      "price": 999.99,
      "code": "SMART-001",
      "stock": 50,
      "category": "electronica"
    }
  }
  ```

#### Crear un producto (Solo Admin)
- **URL**: `/api/products`
- **Método**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "title": "Smartphone XYZ",
    "description": "Un smartphone de última generación",
    "price": 999.99,
    "code": "SMART-001",
    "stock": 50,
    "category": "electronica"
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Producto creado exitosamente",
    "payload": {
      "id": "60d21b4667d0d8992e610c85",
      "title": "Smartphone XYZ",
      "description": "Un smartphone de última generación",
      "price": 999.99,
      "code": "SMART-001",
      "stock": 50,
      "category": "electronica"
    }
  }
  ```

#### Actualizar un producto (Solo Admin)
- **URL**: `/api/products/:pid`
- **Método**: `PUT`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "price": 899.99,
    "stock": 40
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Producto actualizado exitosamente",
    "payload": {
      "id": "60d21b4667d0d8992e610c85",
      "title": "Smartphone XYZ",
      "description": "Un smartphone de última generación",
      "price": 899.99,
      "code": "SMART-001",
      "stock": 40,
      "category": "electronica"
    }
  }
  ```

#### Eliminar un producto (Solo Admin)
- **URL**: `/api/products/:pid`
- **Método**: `DELETE`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Producto eliminado exitosamente"
  }
  ```

### Carritos

#### Obtener un carrito por ID
- **URL**: `/api/carts/:cid`
- **Método**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "payload": {
      "id": "60d21b4667d0d8992e610c86",
      "products": [
        {
          "product": {
            "id": "60d21b4667d0d8992e610c85",
            "title": "Smartphone XYZ",
            "price": 899.99
          },
          "quantity": 2
        }
      ]
    }
  }
  ```

#### Crear un carrito
- **URL**: `/api/carts`
- **Método**: `POST`
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Carrito creado exitosamente",
    "payload": {
      "id": "60d21b4667d0d8992e610c86",
      "products": []
    }
  }
  ```

#### Agregar producto al carrito
- **URL**: `/api/carts/:cid/product/:pid`
- **Método**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "quantity": 2
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Producto agregado al carrito exitosamente",
    "payload": {
      "id": "60d21b4667d0d8992e610c86",
      "products": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "quantity": 2
        }
      ]
    }
  }
  ```

#### Eliminar producto del carrito
- **URL**: `/api/carts/:cid/product/:pid`
- **Método**: `DELETE`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Producto eliminado del carrito exitosamente",
    "payload": {
      "id": "60d21b4667d0d8992e610c86",
      "products": []
    }
  }
  ```

#### Actualizar carrito
- **URL**: `/api/carts/:cid`
- **Método**: `PUT`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "products": [
      {
        "product": "60d21b4667d0d8992e610c85",
        "quantity": 3
      },
      {
        "product": "60d21b4667d0d8992e610c87",
        "quantity": 1
      }
    ]
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Carrito actualizado exitosamente",
    "payload": {
      "id": "60d21b4667d0d8992e610c86",
      "products": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "quantity": 3
        },
        {
          "product": "60d21b4667d0d8992e610c87",
          "quantity": 1
        }
      ]
    }
  }
  ```

#### Actualizar cantidad de producto
- **URL**: `/api/carts/:cid/product/:pid`
- **Método**: `PUT`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "quantity": 5
  }
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Cantidad actualizada exitosamente",
    "payload": {
      "id": "60d21b4667d0d8992e610c86",
      "products": [
        {
          "product": "60d21b4667d0d8992e610c85",
          "quantity": 5
        }
      ]
    }
  }
  ```

#### Vaciar carrito
- **URL**: `/api/carts/:cid`
- **Método**: `DELETE`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Respuesta Exitosa**:
  ```json
  {
    "status": "success",
    "message": "Carrito vaciado exitosamente",
    "payload": {
      "id": "60d21b4667d0d8992e610c86",
      "products": []
    }
  }
  ```

### Compras

#### Finalizar compra
- **URL**: `/api/carts/:cid/purchase`
- **Método**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Respuesta Exitosa (Todos los productos disponibles)**:
  ```json
  {
    "status": "success",
    "message": "Compra realizada exitosamente",
    "payload": {
      "ticket": {
        "id": "60d21b4667d0d8992e610c88",
        "code": "TICKET-1234567890",
        "purchase_datetime": "2023-04-05T12:30:45.123Z",
        "amount": 1799.98,
        "purchaser": "juan@example.com"
      }
    }
  }
  ```

- **Respuesta con productos sin stock**:
  ```json
  {
    "status": "success",
    "message": "Compra parcialmente completada. Algunos productos no tenían stock suficiente.",
    "payload": {
      "ticket": {
        "id": "60d21b4667d0d8992e610c88",
        "code": "TICKET-1234567890",
        "purchase_datetime": "2023-04-05T12:30:45.123Z",
        "amount": 899.99,
        "purchaser": "juan@example.com"
      },
      "failedProducts": ["60d21b4667d0d8992e610c87"]
    }
  }
  ```

## Notas Adicionales

- Para usar endpoints protegidos, es necesario tener un token JWT válido obtenido al iniciar sesión.
- Los endpoints de productos que requieren rol de administrador solo pueden ser accedidos por usuarios con ese rol.
- El carrito solo puede ser modificado por su propietario o un administrador.
- El stock se verifica y actualiza automáticamente al realizar una compra.
- Los productos sin stock suficiente no se comprarán y permanecerán en el carrito.

## Herramientas para Probar la API

Para probar la API, se recomienda utilizar:
- [Postman](https://www.postman.com/)
