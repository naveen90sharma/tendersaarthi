const { createClient } = require('@supabase/supabase-js');
const URL = 'https://qtdrgjrvkzbjegiytukd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJnanJ2a3piamVnaXl0dWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTAwNTAsImV4cCI6MjA4NTc2NjA1MH0.tmjV0USXOp5gS56TXCiboe9ZPtPWcjv3sc3ssMNW2yk';
const supabase = createClient(URL, KEY);

async function check() {
    console.log('--- Authorities ---');
    const { data: auth, error: authErr } = await supabase.from('authorities').select('*').limit(1);
    if (authErr) console.error(authErr); else console.log(Object.keys(auth[0] || {}));

    console.log('--- Tender Categories ---');
    const { data: cat, error: catErr } = await supabase.from('tender_categories').select('*').limit(1);
    if (catErr) console.error(catErr); else console.log(Object.keys(cat[0] || {}));
}

check();
