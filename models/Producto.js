const mongoose = require('mongoose')

// Schema del producto
const productoSchema = new mongoose.Schema({
    // Nombre del producto 
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    // Descripcion del producto 
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    // Precio del producto 
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    }
})

// Se exporta el modelo
module.exports = mongoose.model('Producto', productoSchema)