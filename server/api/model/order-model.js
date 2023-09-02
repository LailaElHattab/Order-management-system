const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    number: { required: true, type: String, unique: true },
    date: { required: true, type: Date, index: true },
    customerName: { required: true, type: String },
    products: {
        required: true,
        type: [
            {
                _id: false,
                id: { required: true, type: String },
                quantity: { required: true, type: Number },
                unitPrice: { required: true, type: Number },
            }
        ]
    },
    itemsSubTotal: { required: true, type: Number },
    shippingStatus: { required: true, type: String },
    shippingCost: { required: true, type: Number },
    taxCost: { required: true, type: Number },
    totalAmount: { required: true, type: Number },

    createdAt: { required: true, type: Date },
    createdBy: { required: true, type: String },
    lastUpdatedAt: { required: true, type: Date },
    lastUpdatedBy: { required: true, type: String }

})

module.exports = mongoose.model('Order', orderSchema);