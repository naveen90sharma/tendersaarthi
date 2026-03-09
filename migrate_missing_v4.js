const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
});

function isUUID(str) {
    if (typeof str !== 'string') return false;
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(str);
}

async function migrateTable(tableName) {
    console.log(`\nMigrating table: ${tableName}`);

    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
        console.error(`- Error fetching ${tableName}:`, error.message);
        return;
    }

    if (!data || data.length === 0) return;

    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    const colDefs = columns.map(col => {
        const val = firstRow[col];
        let type = 'TEXT';
        if (col === 'id') {
            if (isUUID(val)) type = 'UUID PRIMARY KEY';
            else if (typeof val === 'number') type = 'NUMERIC PRIMARY KEY';
            else type = 'TEXT PRIMARY KEY';
        }
        else if (typeof val === 'number') type = 'NUMERIC';
        else if (typeof val === 'boolean') type = 'BOOLEAN';
        else if (col.endsWith('_at') || col.endsWith('_date') || col.endsWith('_ts')) type = 'TIMESTAMPTZ';
        else if (typeof val === 'object' && val !== null) type = 'JSONB';
        return `"${col}" ${type}`;
    });

    const client = await pool.connect();
    try {
        await client.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
        await client.query(`CREATE TABLE "${tableName}" (${colDefs.join(', ')})`);

        for (const row of data) {
            const keys = Object.keys(row);
            const vals = Object.values(row).map(v => {
                if (v !== null && typeof v === 'object') return JSON.stringify(v);
                return v;
            });
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            const cols = keys.map(k => `"${k}"`).join(', ');

            await client.query(`
                INSERT INTO "${tableName}" (${cols}) 
                VALUES (${placeholders}) 
                ON CONFLICT DO NOTHING
            `, vals);
        }
        console.log(`- Successfully migrated ${data.length} records into ${tableName}`);
    } catch (err) {
        console.error(`- Error migrating ${tableName}:`, err.message);
    } finally {
        client.release();
    }
}

async function run() {
    const tables = ['tender_categories', 'authorities', 'states', 'portals'];
    for (const table of tables) {
        await migrateTable(table);
    }
    await pool.end();
}

run();
