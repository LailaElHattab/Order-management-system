const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {required: true,type: String},
    price: {required: true,type: Number},
    category: {required: false,type: String},
    createdAt: { required: true, type: Date },
    createdBy: { required: true, type: String },
    lastUpdatedAt: { required: true, type: Date },
    lastUpdatedBy: { required: true, type: String }
})

module.exports = mongoose.model('Product', productSchema);