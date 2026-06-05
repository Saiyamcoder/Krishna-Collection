    -- KRISHNA COLLECTION - SUPABASE DATABASE INITIALIZATION SCHEMA
    -- Copy and paste this script into the Supabase SQL Editor and click 'Run'.

    -- 1. Create ADMIN USERS Table
    CREATE TABLE IF NOT EXISTS public.admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- 2. Create PRODUCTS Table
    CREATE TABLE IF NOT EXISTS public.products (
        id TEXT PRIMARY KEY, -- using readable IDs like 'poshak-01', 'singhasan-01'
        name TEXT NOT NULL,
        price NUMERIC NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        badge TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- 3. Create PAGES Table (For dynamic page contents and adding custom pages)
    CREATE TABLE IF NOT EXISTS public.pages (
        id TEXT PRIMARY KEY, -- e.g., 'home', 'poshak', 'singhasan', 'shringar', 'contact'
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        subtitle TEXT,
        description TEXT,
        hero_image TEXT,
        content JSONB DEFAULT '{}'::jsonb, -- stores flexible A to Z details
        is_custom BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- 4. Create FEEDBACKS Table
    CREATE TABLE IF NOT EXISTS public.feedbacks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT,
        message TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- 5. Create ORDERS Table (Customer COD orders from checkout)
    CREATE TABLE IF NOT EXISTS public.orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        customer_address TEXT NOT NULL,
        customer_city TEXT NOT NULL,
        customer_state TEXT NOT NULL,
        customer_pincode TEXT NOT NULL,
        payment_method TEXT DEFAULT 'COD',
        items JSONB NOT NULL,       -- Full cart array: [{id, name, price, quantity, image}]
        total_amount NUMERIC NOT NULL,
        status TEXT DEFAULT 'pending',  -- pending / confirmed / shipped / delivered
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- 5. Create SITE SETTINGS Table (For store info, contact, logo, colors etc)
    CREATE TABLE IF NOT EXISTS public.site_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );

    -- Disable Row Level Security (RLS) on tables for simple integration, 
    -- or enable RLS and add basic security policies.
    -- For a static client-side site, we disable RLS to allow direct operations with the keys.
    ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.pages DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.feedbacks DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

    -- 6. SEED INITIAL DATA

    -- Seed Admin User
    INSERT INTO public.admin_users (email, password)
    VALUES 
    ('saiyamgelot@gmail.com', 'Krishna@87800'),
    ('saiyamgelot@gmail,com', 'Krishna@87800') -- Handle the comma typo gracefully
    ON CONFLICT (email) DO NOTHING;

    -- Seed Products
    INSERT INTO public.products (id, name, price, image, category, rating, badge, description)
    VALUES
    ('poshak-01', 'Royal Peacock Designer Poshak', 799, 'assets/poshak_royal.png', 'poshak', 5, 'Best Seller', 'Beautiful royal peacock designer poshak handcrafted from pure silk.'),
    ('poshak-02', 'Premium Velvet Pearl Poshak', 999, 'assets/poshak_velvet.png', 'poshak', 5, 'New Arrival', 'Luxurious red velvet poshak studded with high-quality pearls.'),
    ('singhasan-01', 'Handcrafted Golden Singhasan', 1899, 'assets/singhasan_royal.png', 'singhasan', 5, 'Divine Choice', 'Premium quality wooden throne painted with royal gold.'),
    ('palag-01', 'Premium Velvet Laddu Gopal Palag', 1249, 'assets/palag_bed.png', 'singhasan', 5, 'Trending', 'Super soft cushioned bed lined with velvet for Laddu Gopal.'),
    ('mukut-01', 'Premium Pearl & Feather Mukut', 349, 'assets/mukut_shringar.png', 'shringar', 5, 'Divine Shringar', 'Handcrafted crown adorned with peacock feathers and pearls.'),
    ('mukut-02', 'Royal Blue Diamond Mukut', 499, 'assets/mukut_royal_blue.jpg', 'shringar', 5, 'Premium Pick', 'Royal blue Mukut studded with beautiful diamond crystals.'),
    ('mukut-03', 'Designer Peacock Pearl Mukut', 599, 'assets/mukut_peacock_designer.jpg', 'shringar', 5, 'Best Seller', 'Specially designed crown with peacock theme and pearl chains.'),
    ('mukut-04', 'Vrindavan Peacock Pagdi Mukut', 649, 'assets/mukut_peacock_stand.jpg', 'shringar', 5, 'Special Edition', 'Traditional Vrindavan style pagdi mukut for festival days.'),
    ('bansuri-01', 'Royal Gold Plated Jeweled Bansuri', 199, 'assets/bansuri_gold.png', 'shringar', 4, 'Popular', 'Gold-plated flute decorated with sparkling gems.')
    ON CONFLICT (id) DO NOTHING;

    -- Seed Pages content
    INSERT INTO public.pages (id, title, slug, subtitle, description, hero_image, content, is_custom)
    VALUES
    ('home', 'Krishna Collection - Premium Bal Gopal Clothes & Shringar Items', 'home', '✨ Pure Handcrafted Devotion', 'Explore our hand-selected collections of premium designer peacock-feather dresses, handcrafted royal golden beds, thrones, and jeweled flutes made specifically for Laddu Gopal.', 'assets/poshak_royal.png', '{
        "hero_title": "Decorate Your Bal Gopal With Divine Royal Splendor",
        "hero_btn_text": "Shop Poshak Now",
        "section_title_products": "Divine Best Sellers",
        "testimonial_title": "Words of Love & Devotion"
    }'::jsonb, false),

    ('poshak', 'Bal Gopal Poshak Collection', 'poshak', '🌸 Royal & Soft Fabrics', 'Special handcrafted silk, satin, and red velvet clothes with heavy gold zari work to make Laddu Gopal look absolutely royal.', 'assets/poshak_royal.png', '{}'::jsonb, false),

    ('singhasan', 'Singhasan & Beds', 'singhasan', '👑 Handcrafted Royal Furniture', 'Provide absolute royal comfort to your Bal Gopal with premium golden wooden Singhasans and soft, velvet cushioned Palags.', 'assets/singhasan_royal.png', '{}'::jsonb, false),

    ('shringar', 'Mukut & Shringar Collection', 'shringar', '💎 Divine Royal Accessories', 'Adorn your Laddu Gopal with our premium handpicked heavy stone work crowns (mukut), pearl necklaces (mala), and jeweled gold flutes.', 'assets/mukut_shringar.png', '{}'::jsonb, false),

    ('contact', 'Contact & Feedback', 'contact', '📞 Get in Touch', 'Have questions, feedback, or want custom orders? Reach out to us, and we will serve you with joy.', 'assets/poshak_royal.png', '{}'::jsonb, false)
    ON CONFLICT (id) DO NOTHING;

    -- Seed Site Settings
    INSERT INTO public.site_settings (key, value)
    VALUES
    ('store_name', 'Krishna Collection'),
    ('store_tagline', 'Premium Bal Gopal Clothes & Shringar Items'),
    ('store_address', '108 Vrindavan Heights, Mathura Road, Vrindavan, UP, India'),
    ('store_phone', '+91 98765 43210'),
    ('store_email', 'support@krishnacollection.com'),
    ('store_logo', 'assets/logo.png'),
    ('social_facebook', '#'),
    ('social_instagram', '#'),
    ('social_pinterest', '#'),
    ('social_whatsapp', '#')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
