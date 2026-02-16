
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://qtdrgjrvkzbjegiytukd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJnanJ2a3piamVnaXl0dWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTAwNTAsImV4cCI6MjA4NTc2NjA1MH0.tmjV0USXOp5gS56TXCiboe9ZPtPWcjv3sc3ssMNW2yk';

const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
    console.log(msg);
    fs.appendFileSync('debug_output.txt', msg + '\n');
}

async function checkValues() {
    log('Fetching tenders within the problematic range...');

    // The user set minPrice = 3434 Cr = 34,340,000,000
    const minPrice = 34340000000;

    log(`Checking count of tenders with tender_value_numeric >= ${minPrice}`);

    const { count, error: countError } = await supabase
        .from('tenders')
        .select('*', { count: 'exact', head: true })
        .gte('tender_value_numeric', minPrice);

    if (countError) {
        log('Error fetching count: ' + JSON.stringify(countError));
    } else {
        log(`Total matching tenders: ${count}`);
    }

    // Now verify the specific problematic tenders
    // 1873000000 is 1.87 Billion (187 Cr)
    // 25100000 is 2.51 Cr

    log('\nChecking specific IDs/Values mentioned by user...');
    const { data: problemTenders, error: probError } = await supabase
        .from('tenders')
        .select('id, title, tender_value, tender_value_numeric')
        .or(`tender_value_numeric.eq.1873000000,tender_value_numeric.eq.25100000`)
        .limit(5);

    if (probError) {
        log('Error fetching problem tenders: ' + JSON.stringify(probError));
    } else {
        log(`Found ${problemTenders.length} problematic tenders mentioned by user.`);
        problemTenders.forEach(t => {
            log(simplify(t));
            if (t.tender_value_numeric >= minPrice) {
                log('CRITICAL: This tender has tender_value_numeric >= minPrice! Database value is incorrectly huge?');
            } else {
                log('Confirmed: tender_value_numeric < minPrice. Filtering logic appears sound at DB level.');
            }
        });
    }

    // Check if tender_value_numeric is somehow text?
    // We can try to order by it and see if 9 comes after 10 (text sort)
    // Or just trust the `gte` worked or not.
}

function simplify(t) {
    return `${t.id}: ${t.title ? t.title.substring(0, 30) : 'No Title'}... | Val: ${t.tender_value} | Num: ${t.tender_value_numeric}`;
}

checkValues();
