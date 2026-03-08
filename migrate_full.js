const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrate() {
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
        console.log('Connected to Cloud SQL');

        // 1. Create Tables
        console.log('Creating tables...');

        await pgClient.query(`
            CREATE TABLE IF NOT EXISTS tenders (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                tender_id TEXT UNIQUE,
                title TEXT,
                reference_no TEXT,
                authority TEXT,
                location TEXT,
                tender_value TEXT,
                tender_value_numeric NUMERIC,
                emd_amount TEXT,
                tender_fee TEXT,
                tender_type TEXT,
                tender_category TEXT,
                description TEXT,
                published_date TIMESTAMPTZ,
                bid_submission_end TIMESTAMPTZ,
                bid_opening_date TIMESTAMPTZ,
                bid_end_ts TIMESTAMPTZ,
                period_of_work TEXT,
                bid_validity TEXT,
                official_link TEXT,
                form_of_contract TEXT,
                organisation_chain TEXT,
                status TEXT DEFAULT 'Active',
                state TEXT,
                nit_document TEXT,
                boq_document TEXT,
                html_document TEXT,
                created_by UUID,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS tender_drafts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                tender_id TEXT,
                title TEXT,
                status TEXT DEFAULT 'Draft',
                created_by UUID,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                data JSONB
            );

            CREATE TABLE IF NOT EXISTS saved_tenders (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID,
                tender_id UUID REFERENCES tenders(id),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS news (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title TEXT,
                content TEXT,
                slug TEXT UNIQUE,
                image_url TEXT,
                published_at TIMESTAMPTZ DEFAULT NOW(),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log('Tables created.');

        // 2. Migrate Tenders
        console.log('Migrating tenders...');
        const { data: supaTenders, error: supaError } = await supabase.from('tenders').select('*');
        if (supaError) {
            console.error('Supabase Tenders fetch error:', supaError);
        } else if (supaTenders) {
            console.log(`Found ${supaTenders.length} tenders.`);
            for (const t of supaTenders) {
                try {
                    await pgClient.query(`
                        INSERT INTO tenders (
                            id, tender_id, title, reference_no, authority, location, tender_value, 
                            tender_value_numeric, emd_amount, tender_fee, tender_type, tender_category, 
                            description, published_date, bid_submission_end, bid_opening_date, bid_end_ts, 
                            period_of_work, bid_validity, official_link, form_of_contract, organisation_chain, 
                            status, state, nit_document, boq_document, html_document, created_by, created_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
                        ON CONFLICT (tender_id) DO NOTHING
                    `, [
                        t.id, t.tender_id, t.title, t.reference_no, t.authority, t.location, t.tender_value,
                        t.tender_value_numeric, t.emd_amount, t.tender_fee, t.tender_type, t.tender_category,
                        t.description, t.published_date, t.bid_submission_end, t.bid_opening_date, t.bid_end_ts,
                        t.period_of_work, t.bid_validity, t.official_link || t.officialLink, t.form_of_contract, t.organisation_chain,
                        t.status, t.state, t.nit_document, t.boq_document, t.html_document, t.created_by, t.created_at
                    ]);
                } catch (e) {
                    console.error('Insert error for tender:', t.tender_id, e.message);
                }
            }
        }

        // 3. Migrate News
        console.log('Migrating news...');
        const { data: supaNews, error: newsError } = await supabase.from('news').select('*');
        if (newsError) {
            console.error('Supabase News fetch error:', newsError);
        } else if (supaNews) {
            for (const n of supaNews) {
                await pgClient.query(`
                    INSERT INTO news (id, title, content, slug, image_url, published_at, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (slug) DO NOTHING
                `, [n.id, n.title, n.content, n.slug, n.image_url, n.published_at, n.created_at]);
            }
        }

        console.log('Migration finished successfully!');
        await pgClient.end();
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrate();
