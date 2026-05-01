const express = require("express")
const cors = require("cors")
require('dotenv').config()
const { pool, getHealt, getHealth} = require("./database/db.js");
const { getLibros, getLibroById, updateDescuento } = require("./consultas/libros.js");
const { crearLibro, agregarAutorLibro, agregarGeneroLibro } = require("./consultas/libros");
const { obtenerOCrearEditorial } = require("./consultas/editoriales");
const { obtenerOCrearAutor } = require("./consultas/autores");
const { obtenerOCrearGenero } = require("./consultas/generos");

getHealth();

const api = express()

//Middlewares
api.use(express.json())
api.use(cors())

// Puerto donde escucha el back
const PORT = process.env.PORT || 3000;

// Ruta de prueba del servidor
api.get("/", (req, res) => {
    res.send("API libreria funcionando");
})

api.get("/libros", async (req, res) => {
    try {
        const libros = await getLibros();
        res.json(libros);
    } 
        catch (error) {
        console.error("❌ Error en GET /libros:", error);
        res.status(500).json({
            error: error.code,
            message: error.message,
        });
    }
});

api.get("/libros/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const libro = await getLibroById(id);

        if (!libro) {
            return res.status(404).json({
                message: "Libro no encontrado"
            });
        }
        res.json(libro);
    } 
        catch (error) {
        console.error("❌ Error en GET /libros/:id:", error);
        res.status(500).json({
            error: error.code,
            message: error.message,
        });
    }
});

api.post("/libros", async (req, res) => {
    try {
        const {
            titulo,
            isbn,
            descripcion,
            precio,
            formato,
            stock,
            editorial,
            fecha_publicacion,
            numero_paginas,
            imagen,
            autores = [],
            generos = []
        } = req.body;

        // 1. Validaciones básicas
        if (!titulo || !precio) {
            return res.status(400).json({
                message: "Titulo y precio son obligatorios"
            });
        }

        // 2. Editorial
        const id_editorial = await obtenerOCrearEditorial(editorial);

        // 3. Crear libro
        const nuevoLibro = await crearLibro({
            titulo,
            isbn,
            descripcion,
            precio,
            formato,
            stock,
            id_editorial,
            fecha_publicacion,
            numero_paginas,
            imagen
        });

        // 4. Autores
        for (const nombreAutor of autores) {
            const id_autor = await obtenerOCrearAutor(nombreAutor);
            await agregarAutorLibro(nuevoLibro.id_libro, id_autor);
        }

        // 5. Géneros
        for (const nombreGenero of generos) {
            const id_genero = await obtenerOCrearGenero(nombreGenero);
            await agregarGeneroLibro(nuevoLibro.id_libro, id_genero);
        }

        res.status(201).json({
            message: "Libro creado correctamente",
            data: nuevoLibro
        });

    } catch (error) {
        console.error("❌ Error en POST /libros:", error);
        res.status(500).json({
            error: error.code,
            message: error.message
        });
    }
});

api.put("/libros/:id", async (req, res) => {
    const { id } = req.params;
    const { descuento } = req.body;

    try {
        if (descuento < 0 || descuento > 100) {
            return res.status(400).json({
                message: "El descuento debe estar entre 0 y 100"
            });
        }

        const libroActualizado = await updateDescuento(id, descuento);

        res.json(libroActualizado);
    } 
        catch (error) {
        console.error("❌ Error en PUT /libros:", error);
        res.status(500).json({
            error: error.code,
            message: error.message,
        });
    }
});

api.listen(PORT, ()=>{
    //console.log("Server started on http://localhost:"+ process.env.PORT || 3000)
 console.log(`Servidor en http://localhost:${PORT}`);

})

