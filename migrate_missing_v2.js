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

async function migrateTable(tableName) {
    console.log(`\nMigrating table: ${tableName}`);

    // 1. Fetch from Supabase
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
        console.error(`- Error fetching ${tableName} from Supabase:`, error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log(`- Table ${tableName} is empty in Supabase.`);
        return;
    }

    console.log(`- Found ${data.length} records in Supabase.`);

    // 2. Determine columns and types
    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    // Simple type mapping based on first row values
    const colDefs = columns.map(col => {
        const val = firstRow[col];
        let type = 'TEXT';
        if (col === 'id') type = 'UUID PRIMARY KEY';
        else if (typeof val === 'number') type = 'NUMERIC';
        else if (typeof val === 'boolean') type = 'BOOLEAN';
        else if (val instanceof Date) type = 'TIMESTAMPTZ';
        else if (col.endsWith('_at') || col.endsWith('_date') || col.endsWith('_ts')) type = 'TIMESTAMPTZ';
        else if (typeof val === 'object' && val !== null) type = 'JSONB';
        return `"${col}" ${type}`;
    });

    const client = await pool.connect();
    try {
        // 3. Create Table
        console.log(`- Creating table ${tableName} in PostgreSQL if it doesn't exist...`);
        const createQuery = `CREATE TABLE IF NOT EXISTS "${tableName}" (${colDefs.join(', ')})`;
        await client.query(createQuery);

        // 4. Insert Data
        console.log(`- Inserting ${data.length} records...`);
        for (const row of data) {
            const keys = Object.keys(row);
            const vals = Object.values(row);
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            const cols = keys.map(k => `"${k}"`).join(', ');

            try {
                await client.query(`
                    INSERT INTO "${tableName}" (${cols}) 
                    VALUES (${placeholders}) 
                    ON CONFLICT DO NOTHING
                `, vals);
            } catch (err) {
                console.error(`  - Error inserting into ${tableName}:`, err.message);
            }
        }
        console.log(`- Successfully migrated ${tableName}`);
    } catch (err) {
        console.error(`- Migration failed for ${tableName}:`, err.message);
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
    console.log('\nAll migrations completed!');
}

run();
