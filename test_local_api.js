const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testApi() {
    try {
        console.log('Fetching /api/tenders...');
        const resTenders = await fetch('http://localhost:3000/api/tenders?limit=8');
        const dataTenders = await resTenders.json();
        console.log(`Tenders API status: ${resTenders.status}`);
        console.log(`Tenders found: ${Array.isArray(dataTenders) ? dataTenders.length : 'Error'}`);
        if (dataTenders.error) console.log(`Error: ${dataTenders.error}`);

        console.log('\nFetching /api/db/tender_categories...');
        const resCats = await fetch('http://localhost:3000/api/db/tender_categories');
        const dataCats = await resCats.json();
        console.log(`Categories API status: ${resCats.status}`);
        console.log(`Categories found: ${Array.isArray(dataCats) ? dataCats.length : 'Error'}`);
        if (dataCats.error) console.log(`Error: ${dataCats.error}`);
    } catch (err) {
        console.error('Fetch failed:', err.message);
    }
}

testApi();
