const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
}, { timestamps: true });

// Middleware para popular los productos al obtener un carrito
cartSchema.pre('findOne', function() {
    this.populate('products.product');
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel; 