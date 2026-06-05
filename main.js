// KRISHNA COLLECTION - FRONTEND ORCHESTRATOR & DYNAMIC INJECTOR
// Coordinates database content loading and state updates across the website.

// Global registry of products loaded from Supabase to feed into cart.js
if (typeof PRODUCT_DB === 'undefined') {
    window.PRODUCT_DB = {};
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded. Fetching site configuration...");
    
    // 1. Fetch site settings & pages from Supabase
    let settings = {};
    let pages = {};
    let products = [];
    
    try {
        settings = await dbGetSettings();
        pages = await dbGetPages();
        products = await dbGetProducts();
        
        console.log("Data loaded successfully from Supabase.");
    } catch (e) {
        console.error("Failed to load DB content, using local fallbacks:", e);
    }
    
    // 2. Synchronize PRODUCT_DB in cart.js
    products.forEach(p => {
        PRODUCT_DB[p.id] = p;
    });
    
    // 3. Dynamically update common site elements (Branding, Logo, Footer, Contact info)
    updateCommonElements(settings);
    
    // 4. Build navigation including custom pages
    renderNavigation(pages);
    
    // 5. Determine current page and render content
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';
    
    if (pageName === 'index.html' || pageName === '') {
        renderHomePage(pages['home'], products);
    } else if (pageName === 'poshak.html') {
        renderCategoryPage('poshak', pages['poshak'], products);
    } else if (pageName === 'singhasan.html') {
        renderCategoryPage('singhasan', pages['singhasan'], products);
    } else if (pageName === 'shringar.html') {
        renderCategoryPage('shringar', pages['shringar'], products);
    } else if (pageName === 'contact.html') {
        renderContactPage(pages['contact'], settings);
    }
});

// Update common elements like Logo, Footer, Social Links, and Title tags
function updateCommonElements(settings) {
    // 1. Update logo images across the site
    const logos = document.querySelectorAll('.logo-img');
    if (logos.length > 0 && settings.store_logo) {
        logos.forEach(logo => {
            logo.src = settings.store_logo;
            logo.alt = settings.store_name + " Logo";
        });
    }
    
    // 2. Update brand names in footer and text
    const footerBrandTitle = document.querySelector('.footer-brand h2');
    if (footerBrandTitle && settings.store_name) {
        footerBrandTitle.innerText = settings.store_name;
    }
    
    const footerBrandDesc = document.querySelector('.footer-brand p');
    if (footerBrandDesc && settings.store_tagline) {
        footerBrandDesc.innerText = `Premium online store providing handcrafted dresses, designer beds, elegant wooden thrones, crowns, and accessories for Laddu Gopal (Bal Gopal) deity.`;
    }
    
    // 3. Update footer contact information
    const footerContactList = document.querySelectorAll('.footer-col .footer-links');
    if (footerContactList.length > 0) {
        footerContactList.forEach(list => {
            // Find the list with map-pin icons
            const items = list.querySelectorAll('li');
            items.forEach(item => {
                const pinIcon = item.querySelector('.ri-map-pin-line');
                const phoneIcon = item.querySelector('.ri-phone-line');
                const mailIcon = item.querySelector('.ri-mail-line');
                
                if (pinIcon && settings.store_address) {
                    item.innerHTML = `<i class="ri-map-pin-line" style="color: var(--accent);"></i> ${settings.store_address}`;
                } else if (phoneIcon && settings.store_phone) {
                    item.innerHTML = `<i class="ri-phone-line" style="color: var(--accent);"></i> ${settings.store_phone}`;
                } else if (mailIcon && settings.store_email) {
                    item.innerHTML = `<i class="ri-mail-line" style="color: var(--accent);"></i> ${settings.store_email}`;
                }
            });
        });
    }
    
    // 4. Update Social media links
    const socialLinks = document.querySelectorAll('.footer-socials a');
    socialLinks.forEach(link => {
        const aria = link.getAttribute('aria-label') || '';
        if (aria.includes('Facebook') && settings.social_facebook) link.href = settings.social_facebook;
        if (aria.includes('Instagram') && settings.social_instagram) link.href = settings.social_instagram;
        if (aria.includes('Pinterest') && settings.social_pinterest) link.href = settings.social_pinterest;
        if (aria.includes('WhatsApp') && settings.social_whatsapp) link.href = settings.social_whatsapp;
    });
    
    // 5. Update footer copy copyright year & store name
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
        const year = new Date().getFullYear();
        footerBottom.innerHTML = `&copy; ${year} ${settings.store_name || 'Krishna Collection'}. Handcrafted with Love & Devotion. All Rights Reserved.`;
    }
}

// Render dynamic navbar including any custom pages
function renderNavigation(pages) {
    const mainNav = document.getElementById('main-nav');
    if (!mainNav) return;
    
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Standard default links
    const defaultLinks = [
        { key: 'home', name: 'Home', href: 'index.html' },
        { key: 'poshak', name: 'Poshak', href: 'poshak.html' },
        { key: 'singhasan', name: 'Singhasan & Beds', href: 'singhasan.html' },
        { key: 'shringar', name: 'Shringar', href: 'shringar.html' },
        { key: 'contact', name: 'Contact & Feedback', href: 'contact.html' }
    ];
    
    let html = '';
    
    defaultLinks.forEach(link => {
        let isActive = false;
        if (link.key === 'home') {
            isActive = (pageName === 'index.html' || pageName === '');
        } else {
            isActive = pageName.startsWith(link.href);
        }
        
        const activeClass = isActive ? 'active' : '';
        html += `<a href="${link.href}" class="nav-link ${activeClass}">${link.name}</a>`;
    });
    
    // Add custom pages
    Object.values(pages).forEach(p => {
        if (p.is_custom) {
            const href = `page.html?id=${p.id}`;
            const searchParams = new URLSearchParams(window.location.search);
            const isActive = pageName.startsWith('page.html') && searchParams.get('id') === p.id;
            const activeClass = isActive ? 'active' : '';
            html += `<a href="${href}" class="nav-link ${activeClass}">${p.title}</a>`;
        }
    });
    
    mainNav.innerHTML = html;
}

// Render product card HTML helper
function generateProductHTML(p) {
    if (!p) return '';
    
    // Fallbacks to prevent crashes if data is missing
    const category = p.category || 'Product';
    const name = p.name || 'Unnamed Product';
    const price = p.price || 0;
    const rating = p.rating || 5;
    const image = p.image || 'https://placehold.co/250x250?text=Krishna';

    const stars = '<i class="ri-star-fill"></i>'.repeat(rating) + '<i class="ri-star-line"></i>'.repeat(5 - rating);
    const badgeHTML = p.badge ? `<div class="product-badge">${p.badge}</div>` : '';
    
    return `
        <div class="product-card" data-category="${category}" data-price="${price}">
            ${badgeHTML}
            <div class="product-image-container">
                <img src="${image}" alt="${name}" class="product-img" onerror="this.src='https://placehold.co/250x250?text=Krishna'">
            </div>
            <div class="product-content">
                <span class="product-cat">${category.toUpperCase()}</span>
                <h4 class="product-title">${name}</h4>
                <div class="product-rating">
                    ${stars}
                </div>
                <div class="product-footer">
                    <span class="product-price">₹${price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart('${p.id}')" aria-label="Add to Cart"><i class="ri-shopping-bag-line"></i></button>
                </div>
            </div>
        </div>
    `;
}

// 1. Home Page rendering
function renderHomePage(pageData, products) {
    if (!pageData) return;
    
    // Document title
    document.title = pageData.title || "Krishna Collection - Premium Bal Gopal Clothes & Shringar Items";
    
    // Update Hero elements
    const tag = document.querySelector('.hero-tagline');
    if (tag && pageData.subtitle) tag.innerText = pageData.subtitle;
    
    const title = document.querySelector('.hero-title');
    if (title && pageData.content && pageData.content.hero_title) {
        title.innerHTML = pageData.content.hero_title;
    }
    
    const desc = document.querySelector('.hero-desc');
    if (desc && pageData.description) desc.innerText = pageData.description;
    
    const img = document.querySelector('.hero-main-img');
    if (img && pageData.hero_image) img.src = pageData.hero_image;
    
    const heroBtn = document.getElementById('hero-btn-shop');
    if (heroBtn && pageData.content && pageData.content.hero_btn_text) {
        heroBtn.innerText = pageData.content.hero_btn_text;
    }
    
    // Update products section title
    const prodSecTitle = document.querySelector('#featured-products .section-title');
    if (prodSecTitle && pageData.content && pageData.content.section_title_products) {
        prodSecTitle.innerText = pageData.content.section_title_products;
    }
    
    // Render featured products grid (Showing top 20 products)
    const grid = document.getElementById('home-products-grid');
    if (grid) {
        grid.innerHTML = '';
        // Increased slice to 20 to ensure edited products don't disappear from view
        products.slice(0, 20).forEach(p => {
            grid.innerHTML += generateProductHTML(p);
        });
    }
}

// 2. Category Page rendering (Poshak, Singhasan, Shringar)
function renderCategoryPage(category, pageData, products) {
    if (!pageData) return;
    
    document.title = pageData.title;
    
    // Update Hero elements
    const tag = document.querySelector('.hero-tagline');
    if (tag && pageData.subtitle) tag.innerText = pageData.subtitle;
    
    const title = document.querySelector('.hero-title');
    if (title) title.innerHTML = pageData.title.replace('Collection', '<span>Collection</span>').replace('& Beds', '& <span>Beds</span>').replace('& Bansuri', '& <span>Bansuri</span>');
    
    const desc = document.querySelector('.hero-desc');
    if (desc && pageData.description) desc.innerText = pageData.description;
    
    // Filter and render products (Normalize cases to prevent items disappearing)
    const catProducts = products.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const tCat = (category || '').toLowerCase();
        return pCat === tCat;
    });
    
    // Update count labels
    const countLabel = document.getElementById('products-count-label') || document.querySelector('.products-filter-bar span');
    if (countLabel) {
        countLabel.innerText = `Showing ${catProducts.length} premium products`;
    }
    
    const grid = document.getElementById(`${category}-products-grid`);
    if (grid) {
        grid.innerHTML = '';
        catProducts.forEach(p => {
            grid.innerHTML += generateProductHTML(p);
        });
    }
}

// 3. Contact Page rendering
function renderContactPage(pageData, settings) {
    if (!pageData) return;
    
    document.title = pageData.title;
    
    const tag = document.querySelector('.hero-tagline');
    if (tag && pageData.subtitle) tag.innerText = pageData.subtitle;
    
    const desc = document.querySelector('.hero-desc');
    if (desc && pageData.description) desc.innerText = pageData.description;
    
    // Update contact details panel dynamically
    const details = document.querySelector('.contact-info-panel');
    if (details) {
        const addressPara = details.querySelector('.ri-map-pin-2-line').closest('.contact-card-item').querySelector('p');
        if (addressPara && settings.store_address) addressPara.innerText = settings.store_address;
        
        const phonePara = details.querySelector('.ri-phone-line').closest('.contact-card-item').querySelector('p');
        if (phonePara && settings.store_phone) phonePara.innerText = `${settings.store_phone} (Mon-Sat, 9 AM - 7 PM)`;
        
        const emailPara = details.querySelector('.ri-mail-send-line').closest('.contact-card-item').querySelector('p');
        if (emailPara && settings.store_email) emailPara.innerHTML = `${settings.store_email}<br>orders@${settings.store_email.split('@')[1]}`;
    }
}

// Intercept contact.html's submit feedback form in order to direct to Supabase
async function handleFeedbackSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('feedback-name').value;
    const email = document.getElementById('feedback-email').value;
    const rating = parseInt(document.getElementById('selected-rating').value);
    const message = document.getElementById('feedback-msg').value;
    
    if (rating === 0) {
        alert("Please select a star rating!");
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Submitting...";
    submitBtn.disabled = true;
    
    try {
        const feedback = {
            name,
            email,
            rating,
            message
        };
        
        await dbSaveFeedback(feedback);
        
        showToast(`Thank you, ${name}! Your feedback has been submitted successfully.`);
        event.target.reset();
        setRating(0); // Reset star rating display
    } catch (e) {
        console.error(e);
        showToast("Feedback submitted locally due to connection lag.");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}
