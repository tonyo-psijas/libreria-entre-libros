require('dotenv').config({ path: '../.env'})
const bcrypt = require('bcryptjs')
const pool = require('../database/db')

const actualizarPasswords = async () => {
    const { rows } = await pool.query(
        `SELECT id_cliente, password_hash FROM cliente 
         WHERE password_hash NOT LIKE '$2b$%'`
    )
    
    for (const cliente of rows) {
        const hash = await bcrypt.hash(cliente.password_hash, 10)
        await pool.query(
            `UPDATE cliente SET password_hash = $1 WHERE id_cliente = $2`,
            [hash, cliente.id_cliente]
        )
        console.log(`✅ Cliente ${cliente.id_cliente} actualizado`)
    }
    
    console.log('Listo')
    process.exit()
}

actualizarPasswords()