const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrateEverything() {
    const pgClient = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await pgClient.connect();
        console.log('Connected to Cloud SQL - Full Migration Starting');

        // 1. All Table Definitions
        const queries = [
            `CREATE TABLE IF NOT EXISTS contractors (
                id UUID PRIMARY KEY,
                full_name TEXT,
                email TEXT UNIQUE,
                phone TEXT,
                company_name TEXT,
                state TEXT,
                category TEXT,
                status TEXT DEFAULT 'active',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )`,
            `CREATE TABLE IF NOT EXISTS tender_bidders (
                id UUID PRIMARY KEY,
                tender_id UUID REFERENCES tenders(id),
                bidder_name TEXT,
                bid_amount NUMERIC,
                bid_status TEXT DEFAULT 'pending',
                created_at TIMESTAMPTZ DEFAULT NOW()
            )`,
            `CREATE TABLE IF NOT EXISTS profiles (
                id UUID PRIMARY KEY,
                full_name TEXT,
                email TEXT,
                phone TEXT,
                role TEXT DEFAULT 'user',
                created_at TIMESTAMPTZ DEFAULT NOW()
            )`,
            `CREATE TABLE IF NOT EXISTS analytics (
                id UUID PRIMARY KEY,
                page_url TEXT,
                user_id UUID,
                visit_ts TIMESTAMPTZ DEFAULT NOW()
            )`,
            `CREATE TABLE IF NOT EXISTS testimonials (
                id UUID PRIMARY KEY,
                name TEXT,
                role TEXT,
                content TEXT,
                image_url TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )`,
            `CREATE TABLE IF NOT EXISTS homepage_metrics (
                id UUID PRIMARY KEY,
                label TEXT,
                value TEXT,
                icon TEXT,
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )`,
            `CREATE TABLE IF NOT EXISTS seo_metadata (
                id UUID PRIMARY KEY,
                page_path TEXT UNIQUE,
                title TEXT,
                description TEXT,
                keywords TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS whatsapp_logs (
                id UUID PRIMARY KEY,
                to_number TEXT,
                message TEXT,
                status TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )`,
            `CREATE TABLE IF NOT EXISTS email_logs (
                id UUID PRIMARY KEY,
                to_email TEXT,
                subject TEXT,
                status TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )`
        ];

        for (const q of queries) {
            await pgClient.query(q);
        }
        console.log('Extra tables created.');

        // 2. Data Migration Function
        const tablesToMigrate = [
            'contractors', 'profiles', 'testimonials',
            'homepage_metrics', 'seo_metadata'
        ];

        for (const table of tablesToMigrate) {
            console.log(`Migrating ${table}...`);
            const { data: records, error } = await supabase.from(table).select('*');
            if (error) {
                console.error(`Error fetching from ${table}:`, error.message);
                continue;
            }
            if (records && records.length > 0) {
                console.log(`- Found ${records.length} records in ${table}`);
                for (const row of records) {
                    const keys = Object.keys(row);
                    const values = Object.values(row);
                    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
                    const columns = keys.join(', ');

                    try {
                        await pgClient.query(`
                            INSERT INTO ${table} (${columns}) 
                            VALUES (${placeholders}) 
                            ON CONFLICT DO NOTHING
                        `, values);
                    } catch (e) {
                        console.error(`- Error in ${table}:`, e.message);
                    }
                }
            }
        }

        console.log('Full data migration finished successfully!');
        await pgClient.end();
    } catch (err) {
        console.error('Final migration failed:', err);
    }
}

migrateEverything();
