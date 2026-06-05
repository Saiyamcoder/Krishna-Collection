const { createClient } = require('@supabase/supabase-js');

// We'll try using the publishable (anon) key and the secret key
const SUPABASE_URL = 'https://fckwikbneaphuftbwfbl.supabase.co';
const SUPABASE_SECRET_KEY = 'sb_secret_0kZjSOIKf2uyVrorU1qqVg_xV9yEq-F';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_SqfjqkoQbRuP5VyXPMRl_Q_u_m-gHZB';

console.log("Testing Supabase connection...");
console.log("URL:", SUPABASE_URL);

async function test() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
    
    // Check if we can query any tables or get schema details
    // Since we don't know the tables, let's try querying standard tables or system info
    try {
        // Try listing schemas/tables using PostgREST RPC if any exists, 
        // or just try to query a common table name like 'products' or 'pages'
        console.log("\nAttempting to query 'products' table...");
        const { data: pData, error: pError } = await supabase.from('products').select('*').limit(1);
        if (pError) {
            console.log("Products table query returned error:", pError.message);
        } else {
            console.log("Products table exists! Sample data:", pData);
        }
        
        console.log("\nAttempting to query 'pages' table...");
        const { data: pgData, error: pgError } = await supabase.from('pages').select('*').limit(1);
        if (pgError) {
            console.log("Pages table query returned error:", pgError.message);
        } else {
            console.log("Pages table exists! Sample data:", pgData);
        }
        
        console.log("\nAttempting to query 'site_content' table...");
        const { data: scData, error: scError } = await supabase.from('site_content').select('*').limit(1);
        if (scError) {
            console.log("Site_content table query returned error:", scError.message);
        } else {
            console.log("Site_content table exists! Sample data:", scData);
        }

    } catch (err) {
        console.error("Unexpected error during query:", err);
    }
}

test();
