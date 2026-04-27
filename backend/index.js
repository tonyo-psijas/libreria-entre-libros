const express = require("express")
const cors = require("cors")
require('dotenv').config()


const api = express()
api.use(express.json())
api.use(cors())

api.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started on http://localhost:"+ process.env.PORT || 3000)
})

api.get("/testlibrary",(req, res)=>{
    res.send("Api funcionando OK")
})