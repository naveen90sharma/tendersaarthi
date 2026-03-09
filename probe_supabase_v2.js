const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listSupabaseTables() {
    console.log('Probing Supabase Tables...');

    const tables = [
        'tenders', 'news', 'contractors', 'profiles', 'tender_categories',
        'authorities', 'states', 'portals', 'saved_tenders',
        'testimonials', 'homepage_metrics'
    ];

    for (const table of tables) {
        const { data, count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`- ${table}: ERROR - ${error.message}`);
        } else {
            console.log(`- ${table}: EXISTS - Count: ${count}`);
        }
    }
}

listSupabaseTables();
