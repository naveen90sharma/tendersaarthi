const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkAndInitialize() {
    console.log('Using DB_HOST:', process.env.DB_HOST);
    console.log('Using DB_USER:', process.env.DB_USER);

    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        database: 'postgres',
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to Google Cloud SQL (postgres) with SSL');

        const res = await client.query("SELECT 1 FROM pg_database WHERE datname='tendersaarthi'");
        if (res.rowCount === 0) {
            console.log("Database 'tendersaarthi' does not exist. Creating...");
            await client.query("CREATE DATABASE tendersaarthi");
            console.log("Database created successfully.");
        } else {
            console.log("Database 'tendersaarthi' already exists.");
        }
        await client.end();
    } catch (err) {
        console.error('Connection error details:', err);
    }
}

checkAndInitialize();
