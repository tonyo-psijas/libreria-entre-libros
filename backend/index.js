const express = require("express")
const cors = require("cors")
require('dotenv').config()
const pool = require("./database/db.js");


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
        const result = await pool.query("SELECT * FROM libro");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error obteniendo libros");
    }
});


api.listen(PORT, ()=>{
    //console.log("Server started on http://localhost:"+ process.env.PORT || 3000)
 console.log(`Servidor en http://localhost:${PORT}`);

})

// api.get("/testlibrary",(req, res)=>{
//     res.send("Api funcionando OK")
// })