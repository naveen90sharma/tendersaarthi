const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    console.log('Testing Database Connection...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`DB: ${process.env.DB_NAME}`);

    try {
        const client = await pool.connect();
        console.log('Successfully connected to the database!');

        const tables = [
            'tenders', 'news', 'contractors', 'profiles', 'tender_categories',
            'authorities', 'states', 'portals', 'saved_tenders',
            'testimonials', 'homepage_metrics'
        ];

        for (const table of tables) {
            try {
                const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
                console.log(`- ${table}: ${res.rows[0].count} rows`);
            } catch (err) {
                console.error(`- ${table}: Error fetching count - ${err.message}`);
            }
        }

        client.release();
    } catch (err) {
        console.error('Failed to connect to the database:', err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
