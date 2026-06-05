// KRISHNA COLLECTION - SUPABASE DATABASE CONNECTOR & INTERFACES

// Local Fallbacks in case Supabase is not seeded or fails
const LOCAL_PRODUCTS_FALLBACK = [
    { id: 'poshak-01', name: 'Royal Peacock Designer Poshak', price: 799, image: 'assets/poshak_royal.webp', category: 'poshak', rating: 5, badge: 'Best Seller', description: 'Beautiful royal peacock designer poshak handcrafted from pure silk.' },
    { id: 'poshak-02', name: 'Premium Velvet Pearl Poshak', price: 999, image: 'assets/poshak_velvet.webp', category: 'poshak', rating: 5, badge: 'New Arrival', description: 'Luxurious red velvet poshak studded with high-quality pearls.' },
    { id: 'singhasan-01', name: 'Handcrafted Golden Singhasan', price: 1899, image: 'assets/singhasan_royal.webp', category: 'singhasan', rating: 5, badge: 'Divine Choice', description: 'Premium quality wooden throne painted with royal gold.' },
    { id: 'palag-01', name: 'Premium Velvet Laddu Gopal Palag', price: 1249, image: 'assets/palag_bed.webp', category: 'singhasan', rating: 5, badge: 'Trending', description: 'Super soft cushioned bed lined with velvet for Laddu Gopal.' },
    { id: 'mukut-01', name: 'Premium Pearl & Feather Mukut', price: 349, image: 'assets/mukut_shringar.webp', category: 'shringar', rating: 5, badge: 'Divine Shringar', description: 'Handcrafted crown adorned with peacock feathers and pearls.' },
    { id: 'mukut-02', name: 'Royal Blue Diamond Mukut', price: 499, image: 'assets/mukut_royal_blue.webp', category: 'shringar', rating: 5, badge: 'Premium Pick', description: 'Royal blue Mukut studded with beautiful diamond crystals.' },
    { id: 'mukut-03', name: 'Designer Peacock Pearl Mukut', price: 599, image: 'assets/mukut_peacock_designer.webp', category: 'shringar', rating: 5, badge: 'Best Seller', description: 'Specially designed crown with peacock theme and pearl chains.' },
    { id: 'mukut-04', name: 'Vrindavan Peacock Pagdi Mukut', price: 649, image: 'assets/mukut_peacock_stand.webp', category: 'shringar', rating: 5, badge: 'Special Edition', description: 'Traditional Vrindavan style pagdi mukut for festival days.' },
    { id: 'bansuri-01', name: 'Royal Gold Plated Jeweled Bansuri', price: 199, image: 'assets/bansuri_gold.webp', category: 'shringar', rating: 4, badge: 'Popular', description: 'Gold-plated flute decorated with sparkling gems.' }
];

const LOCAL_PAGES_FALLBACK = {
    'home': {
        id: 'home',
        title: 'Krishna Collection - Premium Bal Gopal Clothes & Shringar Items',
        slug: 'home',
        subtitle: '✨ Pure Handcrafted Devotion',
        description: 'Explore our hand-selected collections of premium designer peacock-feather dresses, handcrafted royal golden beds, thrones, and jeweled flutes made specifically for Laddu Gopal.',
        hero_image: 'assets/poshak_royal.webp',
        content: {
            hero_title: "Decorate Your Bal Gopal With Divine Royal Splendor",
            hero_btn_text: "Shop Poshak Now",
            section_title_products: "Divine Best Sellers",
            testimonial_title: "Words of Love & Devotion"
        }
    },
    'poshak': {
        id: 'poshak',
        title: 'Bal Gopal Poshak Collection',
        slug: 'poshak',
        subtitle: '🌸 Royal & Soft Fabrics',
        description: 'Special handcrafted silk, satin, and red velvet clothes with heavy gold zari work to make Laddu Gopal look absolutely royal.',
        hero_image: 'assets/poshak_royal.webp',
        content: {}
    },
    'singhasan': {
        id: 'singhasan',
        title: 'Singhasan & Beds',
        slug: 'singhasan',
        subtitle: '👑 Handcrafted Royal Furniture',
        description: 'Provide absolute royal comfort to your Bal Gopal with premium golden wooden Singhasans and soft, velvet cushioned Palags.',
        hero_image: 'assets/singhasan_royal.webp',
        content: {}
    },
    'shringar': {
        id: 'shringar',
        title: 'Mukut & Shringar Collection',
        slug: 'shringar',
        subtitle: '💎 Divine Royal Accessories',
        description: 'Adorn your Laddu Gopal with our premium handpicked heavy stone work crowns (mukut), pearl necklaces (mala), and jeweled gold flutes.',
        hero_image: 'assets/mukut_shringar.webp',
        content: {}
    },
    'contact': {
        id: 'contact',
        title: 'Contact & Feedback',
        slug: 'contact',
        subtitle: '📞 Get in Touch',
        description: 'Have questions, feedback, or want custom orders? Reach out to us, and we will serve you with joy.',
        hero_image: 'assets/poshak_royal.webp',
        content: {}
    }
};

const LOCAL_SETTINGS_FALLBACK = {
    'store_name': 'Krishna Collection',
    'store_tagline': 'Premium Bal Gopal Clothes & Shringar Items',
    'store_address': '108 Vrindavan Heights, Mathura Road, Vrindavan, UP, India',
    'store_phone': '+91 98765 43210',
    'store_email': 'support@krishnacollection.com',
    'store_logo': 'assets/logo.webp',
    'social_facebook': '#',
    'social_instagram': '#',
    'social_pinterest': '#',
    'social_whatsapp': '#'
};

// Initialize Supabase Clients
let dbPublic = null;
let dbAdmin = null;

function initSupabase() {
    if (typeof supabase !== 'undefined') {
        try {
            // Use Public Key for everything since RLS is disabled in our SQL schema.
            // This prevents the "Forbidden use of secret API key in browser" error.
            dbPublic = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
            dbAdmin = dbPublic; // Use the same client for admin tasks
            
            console.log("Supabase client initialized successfully with Public Key.");
        } catch (e) {
            console.error("Error initializing Supabase client:", e);
        }
    } else {
        console.warn("Supabase library not loaded yet. Running in local fallback mode.");
    }
}

// Initialize on script load
initSupabase();

// --- DATABASE FUNCTIONS ---

// 1. Authenticate Admin User
async function dbLoginAdmin(email, password) {
    // Normalize commas to dots for email
    const normalizedEmail = email.replace(/,/g, '.').trim().toLowerCase();
    
    // Attempt local verification first as a robust check
    const localMatch = (normalizedEmail === ADMIN_DEFAULT_EMAIL.replace(/,/g, '.').trim().toLowerCase()) && (password === ADMIN_DEFAULT_PASSWORD);
    
    if (dbPublic) {
        try {
            // First check if the database table admin_users is accessible and has credentials
            const { data, error } = await dbPublic
                .from('admin_users')
                .select('*')
                .or(`email.eq.${normalizedEmail},email.eq.${email.trim().toLowerCase()}`)
                .eq('password', password);
                
            if (!error && data && data.length > 0) {
                return { success: true, user: data[0] };
            }
        } catch (e) {
            console.warn("Admin query failed, using local config fallback:", e);
        }
    }
    
    // Local fallback if database is not initialized yet
    if (localMatch) {
        return { success: true, user: { email: ADMIN_DEFAULT_EMAIL, is_fallback: true } };
    }
    
    return { success: false, error: "Invalid Email ID or Password" };
}

// 2. Fetch Products
async function dbGetProducts() {
    if (dbPublic) {
        try {
            const { data, error } = await dbPublic.from('products').select('*').order('created_at', { ascending: false });
            if (!error && data && data.length > 0) {
                return data;
            }
            if (error) console.warn("Supabase products fetch error:", error.message);
        } catch (e) {
            console.error("Failed to fetch products from Supabase:", e);
        }
    }
    return LOCAL_PRODUCTS_FALLBACK;
}

// 3. Save / Update Product (Admin)
async function dbSaveProduct(product) {
    if (!dbAdmin) throw new Error("Database client not available");
    
    const { data, error } = await dbAdmin
        .from('products')
        .upsert(product)
        .select();
        
    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}

// 4. Delete Product (Admin)
async function dbDeleteProduct(productId) {
    if (!dbAdmin) throw new Error("Database client not available");
    
    const { error } = await dbAdmin
        .from('products')
        .delete()
        .eq('id', productId);
        
    if (error) {
        throw new Error(error.message);
    }
    return true;
}

// 5. Fetch Pages
async function dbGetPages() {
    if (dbPublic) {
        try {
            const { data, error } = await dbPublic.from('pages').select('*').order('created_at', { ascending: true });
            if (!error && data && data.length > 0) {
                // Map array to object key matching slug/id
                const pagesObj = {};
                data.forEach(p => {
                    pagesObj[p.id] = p;
                });
                return pagesObj;
            }
        } catch (e) {
            console.error("Failed to fetch pages from Supabase:", e);
        }
    }
    return LOCAL_PAGES_FALLBACK;
}

// 6. Fetch Single Page content
async function dbGetPage(pageId) {
    if (dbPublic) {
        try {
            const { data, error } = await dbPublic.from('pages').select('*').eq('id', pageId).single();
            if (!error && data) {
                return data;
            }
        } catch (e) {
            console.error(`Failed to fetch page ${pageId} from Supabase:`, e);
        }
    }
    return LOCAL_PAGES_FALLBACK[pageId] || null;
}

// 7. Save / Update Page (Admin)
async function dbSavePage(page) {
    if (!dbAdmin) throw new Error("Database client not available");
    
    const { data, error } = await dbAdmin
        .from('pages')
        .upsert(page)
        .select();
        
    if (error) {
        throw new Error(error.message);
    }
    return data[0];
}

// 8. Delete Page (Admin - only custom pages)
async function dbDeletePage(pageId) {
    if (!dbAdmin) throw new Error("Database client not available");
    
    const { error } = await dbAdmin
        .from('pages')
        .delete()
        .eq('id', pageId)
        .eq('is_custom', true); // Safe check
        
    if (error) {
        throw new Error(error.message);
    }
    return true;
}

// 9. Fetch Site Settings
async function dbGetSettings() {
    if (dbPublic) {
        try {
            const { data, error } = await dbPublic.from('site_settings').select('*');
            if (!error && data) {
                const settings = {};
                data.forEach(item => {
                    settings[item.key] = item.value;
                });
                return settings;
            }
        } catch (e) {
            console.error("Failed to fetch settings from Supabase:", e);
        }
    }
    return LOCAL_SETTINGS_FALLBACK;
}

// 10. Save Settings (Admin)
async function dbSaveSettings(settingsObj) {
    if (!dbAdmin) throw new Error("Database client not available");
    
    const rows = Object.entries(settingsObj).map(([key, value]) => ({ key, value }));
    const { error } = await dbAdmin
        .from('site_settings')
        .upsert(rows);
        
    if (error) {
        throw new Error(error.message);
    }
    return true;
}

// 11. Fetch Feedbacks (Admin)
async function dbGetFeedbacks() {
    if (dbPublic) {
        try {
            const { data, error } = await dbPublic.from('feedbacks').select('*').order('created_at', { ascending: false });
            if (!error) return data;
        } catch (e) {
            console.error("Failed to fetch feedbacks:", e);
        }
    }
    return [];
}

// 12. Save Customer Feedback (Public Form)
async function dbSaveFeedback(feedback) {
    if (dbPublic) {
        try {
            const { data, error } = await dbPublic.from('feedbacks').insert(feedback).select();
            if (error) throw new Error(error.message);
            return data[0];
        } catch (e) {
            console.error("Failed to save feedback in Supabase:", e);
            // Fallback: save to localStorage to not lose form submits
            const localFeedbacks = JSON.parse(localStorage.getItem('krishna_feedbacks') || '[]');
            localFeedbacks.push({ ...feedback, id: 'local-' + Date.now(), created_at: new Date().toISOString() });
            localStorage.setItem('krishna_feedbacks', JSON.stringify(localFeedbacks));
            return feedback;
        }
    }
    // Storage fallback
    const localFeedbacks = JSON.parse(localStorage.getItem('krishna_feedbacks') || '[]');
    localFeedbacks.push({ ...feedback, id: 'local-' + Date.now(), created_at: new Date().toISOString() });
    localStorage.setItem('krishna_feedbacks', JSON.stringify(localFeedbacks));
    return feedback;
}

// 13. Save Customer Order (from Checkout)
async function dbSaveOrder(orderData) {
    if (dbPublic) {
        try {
            const { data, error } = await dbPublic.from('orders').insert(orderData).select();
            if (error) throw new Error(error.message);
            return data[0];
        } catch (e) {
            console.error("Failed to save order in Supabase:", e);
            // Fallback: store locally so orders are never lost
            const localOrders = JSON.parse(localStorage.getItem('krishna_orders') || '[]');
            localOrders.push({ ...orderData, id: 'local-' + Date.now(), created_at: new Date().toISOString() });
            localStorage.setItem('krishna_orders', JSON.stringify(localOrders));
            return orderData;
        }
    }
    // Full local fallback
    const localOrders = JSON.parse(localStorage.getItem('krishna_orders') || '[]');
    localOrders.push({ ...orderData, id: 'local-' + Date.now(), created_at: new Date().toISOString() });
    localStorage.setItem('krishna_orders', JSON.stringify(localOrders));
    return orderData;
}

// 14. Fetch All Orders (Admin Panel)
async function dbGetOrders() {
    if (dbPublic) {
        try {
            const { data, error } = await dbPublic
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data) {
                // Merge with any locally stored orders
                const localOrders = JSON.parse(localStorage.getItem('krishna_orders') || '[]');
                return [...data, ...localOrders.filter(lo => lo.id && lo.id.startsWith('local-'))];
            }
        } catch (e) {
            console.error("Failed to fetch orders:", e);
        }
    }
    // Fallback: return orders saved in localStorage
    return JSON.parse(localStorage.getItem('krishna_orders') || '[]');
}

// 15. Update Order Status (Admin)
async function dbUpdateOrderStatus(orderId, status) {
    if (!dbAdmin) throw new Error("Database client not available");
    const { error } = await dbAdmin
        .from('orders')
        .update({ status })
        .eq('id', orderId);
    if (error) throw new Error(error.message);
    return true;
}

// 13. File/Image Upload helper to Supabase Storage (Admin)
async function dbUploadImage(file, bucketName = 'site-assets') {
    if (!dbAdmin) throw new Error("Database client not available");
    
    // Sanitize filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `images/${fileName}`;
    
    // Upload image file
    const { data, error } = await dbAdmin.storage
        .from(bucketName)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });
        
    if (error) {
        // If bucket doesn't exist, we explain and throw
        if (error.message.includes("Bucket not found") || error.message.includes("does not exist")) {
            throw new Error(`Storage bucket '${bucketName}' not found in Supabase. Please create this bucket in your Supabase Dashboard Storage section, set it to public, and try again!`);
        }
        throw new Error(error.message);
    }
    
    // Get Public URL
    const { data: publicUrlData } = dbAdmin.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
    return publicUrlData.publicUrl;
}
