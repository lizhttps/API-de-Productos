// Cargar las variables de entorno del archivo .env
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Producto = require('./models/Producto')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Conexion a MongoDB el servidor solo arranca si la conexion es exitosa
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado a MongoDB')
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error('Error al conectar con MongoDB:', error.message)
    })

// Convierte los errores de Mongoose en la respuesta HTTP correcta
function manejarError(res, error) {
    // Error de validacion del schema 
    if (error.name === 'ValidationError') {
        return res.status(400).json({ mensaje: 'Nombre, descripcion y precio son obligatorios y el precio no puede ser negativo' })
    }
    // Error de conversion de tipo: el id o el precio tienen un formato invalido
    if (error.name === 'CastError') {
        const mensaje = error.path === '_id' ? 'Id no valido' : 'Dato no valido'
        return res.status(400).json({ mensaje })
    }
    // Cualquier otro error inesperado
    console.error(error)
    res.status(500).json({ mensaje: 'Error del servidor' })
}

// Verifica que vengan los tres campos 
function faltanCampos({ nombre, descripcion, precio }) {
    return !nombre || !descripcion || precio === undefined || precio === null || precio === ''
}

// GET - Listar todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find()
        res.json(productos)
    } catch (error) {
        manejarError(res, error)
    }
})

// GET - Obtener un producto por id
app.get('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id)

        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' })
        }

        res.json(producto)
    } catch (error) {
        manejarError(res, error)
    }
})

// POST - Crear un producto
app.post('/productos', async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body

        // Validar que no falte ningun campo obligatorio (codigo 400)
        if (faltanCampos(req.body)) {
            return res.status(400).json({ mensaje: 'Nombre, descripcion y precio son obligatorios' })
        }

        // Guardar en MongoDB 
        const nuevoProducto = await Producto.create({ nombre, descripcion, precio })

        // Responder 201 con el producto creado
        res.status(201).json(nuevoProducto)
    } catch (error) {
        manejarError(res, error)
    }
})

// PUT - Actualizar un producto
app.put('/productos/:id', async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body

        // Validar que no falte ningun campo (codigo 400)
        if (faltanCampos(req.body)) {
            return res.status(400).json({ mensaje: 'Nombre, descripcion y precio son obligatorios' })
        }

        // n true devuelve el documento ya actualizado; runValidators aplica las validaciones del schema
        const actualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            { nombre, descripcion, precio },
            { new: true, runValidators: true }
        )

        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' })
        }

        // Responder 200 con el producto actualizado
        res.json(actualizado)
    } catch (error) {
        manejarError(res, error)
    }
})

// DELETE - Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
    try {
        const eliminado = await Producto.findByIdAndDelete(req.params.id)

        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' })
        }

        res.json({ mensaje: 'Producto eliminado', producto: eliminado })
    } catch (error) {
        manejarError(res, error)
    }
})