const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const getHealth = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log("✅ Base de datos conectada a las:", result.rows[0].now);
    } catch (error) {
        console.error(" ❌Error conectando a la BD:", error.message);
    }
};

module.exports = { pool, getHealth };