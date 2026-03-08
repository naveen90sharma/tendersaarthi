const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkAndInitialize() {
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        database: 'postgres' // Connect to default first
    });

    try {
        await client.connect();
        console.log('Connected to Google Cloud SQL (postgres)');

        // Check if database 'tendersaarthi' exists
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
        console.error('Connection error:', err);
    }
}

checkAndInitialize();
