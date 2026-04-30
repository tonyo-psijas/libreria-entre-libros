const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: 5432,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    allowExitOnIdle: true
});

const getHealth = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log("Base de datos conectada a las:", result.rows[0].now);
    } catch (error) {
        console.error("Error conectando a la BD:", error.message);
    }
};

getHealth();

module.exports = pool;