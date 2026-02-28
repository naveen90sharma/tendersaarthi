const SUPABASE_URL = 'https://qtdrgjrvkzbjegiytukd.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZHJnanJ2a3piamVnaXl0dWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTAwNTAsImV4cCI6MjA4NTc2NjA1MH0.tmjV0USXOp5gS56TXCiboe9ZPtPWcjv3sc3ssMNW2yk';
const fs = require('fs');

async function testExtraction() {
    try {
        const formData = new FormData();
        const htmlBuffer = fs.readFileSync('C:\\Users\\PC-TENDER\\Desktop\\for test\\2026_NHAI_267883_1.html');
        const blob = new Blob([htmlBuffer], { type: 'text/html' });
        formData.append('html_file', blob, 'tender.html');

        console.log('Sending request to Supabase Edge Function... (V11)');
        const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-tender`, {
            method: 'POST',
            headers: {
                'apikey': ANON_KEY
            },
            body: formData
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('--- RESPONSE SUCCESS ---');
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('--- RESPONSE ERROR ---');
        console.error('Message:', error.message);
    }
}

testExtraction();
