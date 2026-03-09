const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkColumns() {
    const tables = ['tender_categories', 'authorities', 'states', 'portals'];
    for (const table of tables) {
        console.log(`Checking columns for ${table}...`);
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`Error for ${table}:`, error.message);
        } else if (data && data[0]) {
            console.log(`Columns: ${Object.keys(data[0]).join(', ')}`);
        } else {
            console.log(`Table ${table} is empty but structure might be available.`);
        }
    }
}

checkColumns();
