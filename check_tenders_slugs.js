const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
});

async function checkSlugs() {
    const client = await pool.connect();
    const res = await client.query('SELECT id, slug, title FROM tenders LIMIT 5');
    console.log('Tenders Slugs:');
    res.rows.forEach(r => console.log(`- ID: ${r.id}, Slug: ${r.slug}, Title: ${r.title.substring(0, 30)}...`));
    client.release();
    await pool.end();
}

checkSlugs();
