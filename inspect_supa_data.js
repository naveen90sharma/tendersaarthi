const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
    const { data, error } = await supabase.from('tender_categories').select('*');
    if (data) {
        data.forEach(r => {
            console.log(`Cat: ${r.name}, faq_json type: ${typeof r.faq_json}, value: ${JSON.stringify(r.faq_json)}`);
        });
    }
}

checkData();
