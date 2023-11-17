const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const carSchema = new Schema(
    {
        brand: String,
        model: String,
        year: Number,
        type: String,   
    }
);
const car = mongoose.model('car', carSchema);
module.exports = car;