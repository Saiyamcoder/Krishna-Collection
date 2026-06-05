const { Client } = require('pg');

const connectionString = 'postgresql://postgres:Krishna@87800@db.fckwikbneaphuftbwfbl.supabase.co:6543/postgres';

console.log("Testing PostgreSQL connection with rejectUnauthorized: false...");

async function test() {
    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });
    try {
        await client.connect();
        console.log("SUCCESS! Connected to PostgreSQL database directly.");
        
        // Let's run a simple query to see if it works
        const res = await client.query('SELECT version();');
        console.log("Version:", res.rows[0].version);
        
        await client.end();
    } catch (err) {
        console.error("Connection failed:", err.message);
    }
}

test();
