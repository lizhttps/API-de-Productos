# API de Productos

API REST hecha con Node.js y Express para gestionar productos (CRUD completo). Los datos se guardan en un arreglo en memoria, por lo que se pierden al reiniciar el servidor.

## Requisitos

- Node.js

## Instalación y uso

```bash
npm install
npm run dev
```

El servidor corre en `http://localhost:3000`.

## Endpoints

| Método | Ruta              | Acción                     | Respuestas      |
|--------|-------------------|----------------------------|-----------------|
| GET    | `/productos`      | Listar todos los productos | 200             |
| GET    | `/productos/:id`  | Obtener un producto        | 200, 404        |
| POST   | `/productos`      | Crear un producto          | 201, 400        |
| PUT    | `/productos/:id`  | Actualizar un producto     | 200, 400, 404   |
| DELETE | `/productos/:id`  | Eliminar un producto       | 200, 404        |

## Ejemplo de producto

```json
{
  "nombre": "Webcam HD",
  "descripcion": "Camara web 1080p con microfono integrado",
  "precio": 1800
}
```

Los campos `nombre`, `descripcion` y `precio` son obligatorios en POST y PUT.


[Tu nombre] - Programación Web, Práctica 6
