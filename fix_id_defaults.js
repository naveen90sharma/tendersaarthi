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

async function fixDefaults() {
    const client = await pool.connect();
    try {
        console.log('Ensuring pgcrypto extension is enabled...');
        await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

        const tables = [
            'tenders', 'news', 'contractors', 'profiles', 'tender_categories',
            'authorities', 'states', 'portals', 'saved_tenders',
            'testimonials', 'homepage_metrics', 'seo_metadata'
        ];

        for (const table of tables) {
            console.log(`Checking table: ${table}`);
            const res = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1 AND column_name = 'id'
            `, [table]);

            if (res.rows.length > 0) {
                const col = res.rows[0];
                if (col.data_type === 'uuid') {
                    console.log(`- Setting DEFAULT gen_random_uuid() for ${table}.id`);
                    await client.query(`ALTER TABLE "${table}" ALTER COLUMN id SET DEFAULT gen_random_uuid()`);
                } else if (col.data_type === 'numeric' || col.data_type === 'integer' || col.data_type === 'bigint') {
                    // Check if it's already a sequence or needs one
                    const defRes = await client.query(`
                        SELECT column_default 
                        FROM information_schema.columns 
                        WHERE table_name = $1 AND column_name = 'id'
                    `, [table]);

                    if (!defRes.rows[0].column_default) {
                        console.log(`- Creating sequence and setting DEFAULT for ${table}.id (Numeric)`);
                        const seqName = `${table}_id_seq`;
                        await client.query(`CREATE SEQUENCE IF NOT EXISTS "${seqName}"`);
                        await client.query(`ALTER TABLE "${table}" ALTER COLUMN id SET DEFAULT nextval('${seqName}')`);
                    }
                }
            }
        }
        console.log('\nSUCCESS: All ID defaults have been fixed!');
    } catch (err) {
        console.error('Error fixing defaults:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

fixDefaults();
