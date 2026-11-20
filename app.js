const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// delete

app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const posicion = productos.findIndex(p => p.id === id)

    if(posicion === -1){
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const eliminado = productos.splice(posicion, 1)
    res.json({ mensaje: 'Producto eliminado', producto: eliminado[0] })
})

// put

app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const posicion = productos.findIndex(p => p.id === id)

    if(posicion === -1){
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const { nombre, descripcion, precio } = req.body

    if (!nombre || !descripcion || !precio) {
        return res.status(400).json({ mensaje: 'Nombre, descripcion y precio son obligatorios' })
    }

    productos[posicion] = {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        precio: parseFloat(precio)
    }

    // Responder 200 con el producto actualizado
    res.json(productos[posicion])
})

//post

app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body

    // 1Validar que no falte ningún campo obligatorio (código 400)
    if (!nombre || !descripcion || !precio) {
        return res.status(400).json({ mensaje: 'Nombre, descripcion y precio son obligatorios' })
    }

    //  Generar un nuevo id que no se repita
    const nuevoId = productos.length > 0
        ? Math.max(...productos.map(p => p.id)) + 1
        : 1

    // Crear el nuevo producto con el precio convertido a número
    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        descripcion: descripcion,
        precio: parseFloat(precio)
    }

    //  Agregar el producto al arreglo
    productos.push(nuevoProducto)

    // Responder con código 201 y el producto creado
    res.status(201).json(nuevoProducto)
})

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
