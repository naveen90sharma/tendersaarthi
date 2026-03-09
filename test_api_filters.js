const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testApi() {
    try {
        console.log('Testing neq filter...');
        // First get one tender to get its id
        const res1 = await fetch('http://localhost:3000/api/db/tenders?limit=1');
        const data1 = await res1.json();
        if (data1.length > 0) {
            const id = data1[0].id;
            console.log(`Excluding ID: ${id}`);
            const res2 = await fetch(`http://localhost:3000/api/db/tenders?id=neq.${id}`);
            const data2 = await res2.json();
            console.log(`Tenders remaining: ${data2.length}`);
            if (data2.some(t => t.id === id)) {
                console.error('FAILED: Excluded ID still present!');
            } else {
                console.log('SUCCESS: ID excluded correctly.');
            }
        }

        console.log('\nTesting ilike filter...');
        const res3 = await fetch('http://localhost:3000/api/db/tenders?title=ilike.work');
        const data3 = await res3.json();
        console.log(`Tenders matching 'work': ${data3.length}`);

        console.log('\nTesting offset filter...');
        const res4 = await fetch('http://localhost:3000/api/db/tenders?limit=2&offset=1');
        const data4 = await res4.json();
        console.log(`Range results: ${data4.length}`);

    } catch (err) {
        console.error('Fetch failed:', err.message);
    }
}

testApi();
