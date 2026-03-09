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

async function checkTenders() {
    try {
        const client = await pool.connect();
        const now = new Date().toISOString();
        console.log(`Current Time (ISO): ${now}`);

        const allRes = await client.query('SELECT id, title, bid_end_ts FROM tenders');
        console.log(`Total Tenders: ${allRes.rows.length}`);
        allRes.rows.forEach(r => {
            console.log(`- ID: ${r.id}, End: ${r.bid_end_ts}, Future: ${r.bid_end_ts > now}`);
        });

        const filteredRes = await client.query('SELECT COUNT(*) FROM tenders WHERE bid_end_ts > $1', [now]);
        console.log(`Tenders matching filter (bid_end_ts > now): ${filteredRes.rows[0].count}`);

        client.release();
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkTenders();
