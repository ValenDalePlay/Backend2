const bcrypt = require('bcrypt');
const { userDAO } = require('../dao/dao.factory');
const { cartDAO } = require('../dao/dao.factory');
const { UserDTO } = require('../dto');
const { ErrorHandler, ERROR_CODES } = require('../utils/error-handler');

class UserService {
    async getAllUsers() {
        const users = await userDAO.getAll();
        return UserDTO.toResponseList(users);
    }

    async getUserById(id) {
        const user = await userDAO.getById(id);
        return UserDTO.toResponse(user);
    }

    async getUserByEmail(email) {
        const user = await userDAO.getByEmail(email);
        return user;
    }

    async createUser(userData) {
        // Verificamos si el usuario ya existe
        const existingUser = await this.getUserByEmail(userData.email);
        if (existingUser) {
            throw ErrorHandler.duplicateError(
                'El email ya está registrado',
                ERROR_CODES.DUPLICATE_USER_EMAIL
            );
        }

        // Preparamos los datos para persistencia
        const userToCreate = UserDTO.toPersistence(userData);

        // Hasheamos la contraseña
        userToCreate.password = bcrypt.hashSync(userToCreate.password, 10);
        
        // Creamos un carrito para el usuario
        const cart = await cartDAO.create();
        
        // Asignamos el carrito al usuario
        userToCreate.cart = cart._id;
        
        // Creamos el usuario con el carrito y la contraseña hasheada
        const newUser = await userDAO.create(userToCreate);
        
        // Retornamos el usuario en formato de respuesta
        return UserDTO.toResponse(newUser);
    }

    async validateUser(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) {
            return null;
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        return user;
    }

    async updateUser(id, userData) {
        const updateData = UserDTO.toUpdate(userData);
        
        if (updateData.password) {
            updateData.password = bcrypt.hashSync(updateData.password, 10);
        }
        
        const updatedUser = await userDAO.update(id, updateData);
        return UserDTO.toResponse(updatedUser);
    }

    async deleteUser(id) {
        const deletedUser = await userDAO.delete(id);
        return UserDTO.toResponse(deletedUser);
    }
}

module.exports = new UserService(); 