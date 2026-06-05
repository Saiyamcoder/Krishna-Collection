/**
 * KRISHNA COLLECTION - E-Commerce Shopping Cart System & Database Engine
 * Handles persistent multi-page localStorage coordination.
 */

// Global Product Database
const PRODUCT_DB = {
    // Poshaks
    'poshak-01': { id: 'poshak-01', name: 'Royal Peacock Designer Poshak', price: 799, image: 'assets/poshak_royal.webp', category: 'poshak', rating: 5, badge: 'Best Seller' },
    'poshak-02': { id: 'poshak-02', name: 'Premium Velvet Pearl Poshak', price: 999, image: 'assets/poshak_velvet.webp', category: 'poshak', rating: 5, badge: 'New Arrival' },
    
    // Singhasans
    'singhasan-01': { id: 'singhasan-01', name: 'Handcrafted Golden Singhasan', price: 1899, image: 'assets/singhasan_royal.webp', category: 'singhasan', rating: 5, badge: 'Divine Choice' },
    'palag-01': { id: 'palag-01', name: 'Premium Velvet Laddu Gopal Palag', price: 1249, image: 'assets/palag_bed.webp', category: 'singhasan', rating: 5, badge: 'Trending' },
    
    // Shringars
    'mukut-01': { id: 'mukut-01', name: 'Premium Pearl & Feather Mukut', price: 349, image: 'assets/mukut_shringar.webp', category: 'shringar', rating: 5, badge: 'Divine Shringar' },
    'mukut-02': { id: 'mukut-02', name: 'Royal Blue Diamond Mukut', price: 499, image: 'assets/mukut_royal_blue.webp', category: 'shringar', rating: 5, badge: 'Premium Pick' },
    'mukut-03': { id: 'mukut-03', name: 'Designer Peacock Pearl Mukut', price: 599, image: 'assets/mukut_peacock_designer.webp', category: 'shringar', rating: 5, badge: 'Best Seller' },
    'mukut-04': { id: 'mukut-04', name: 'Vrindavan Peacock Pagdi Mukut', price: 649, image: 'assets/mukut_peacock_stand.webp', category: 'shringar', rating: 5, badge: 'Special Edition' },
    'bansuri-01': { id: 'bansuri-01', name: 'Royal Gold Plated Jeweled Bansuri', price: 199, image: 'assets/bansuri_gold.webp', category: 'shringar', rating: 4, badge: 'Popular' }
};

// Initialize Cart Array
let cart = [];

// Load Cart from localStorage on startup
function loadCart() {
    try {
        const storedCart = localStorage.getItem('krishna_collection_cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        } else {
            cart = [];
        }
    } catch (e) {
        console.error("Failed to load shopping cart:", e);
        cart = [];
    }
}

// Save Cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('krishna_collection_cart', JSON.stringify(cart));
        // Disseminate custom events for multi-page sync
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
        console.error("Failed to save shopping cart:", e);
    }
}

// Add Item to Cart
function addToCart(productId) {
    const product = PRODUCT_DB[productId];
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    renderCartDrawer();
    openCartDrawer();
    showToast(`${product.name} added to cart!`);
}

// Remove Item from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartDrawer();
}

// Update Quantity
function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        renderCartDrawer();
    }
}

// Toggle Cart Drawer
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.add('open');
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.remove('open');
    }
}

// Dynamically Render Persistent Cart UI Bottom Drawer ("niche dikhti rahe")
function renderCartDrawer() {
    const badge = document.getElementById('cart-badge');
    const drawerContainer = document.getElementById('cart-drawer-container');
    const miniCartBar = document.getElementById('mini-cart-bar');
    
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update Badge Count
    if (badge) {
        badge.innerText = totalCount;
        badge.style.display = totalCount > 0 ? 'flex' : 'none';
    }
    
    // Render Mini Sticky Bar (shows if drawer closed but has items)
    if (miniCartBar) {
        const miniCount = document.getElementById('mini-cart-count');
        const miniTotal = document.getElementById('mini-cart-total');
        if (miniCount) miniCount.innerText = totalCount;
        if (miniTotal) miniTotal.innerText = `₹${subtotal}`;
        
        const isCheckoutPage = window.location.pathname.includes('checkout.html');
        if (totalCount > 0 && !isCheckoutPage) {
            miniCartBar.classList.add('active');
        } else {
            miniCartBar.classList.remove('active');
        }
    }
    
    // Check if drawer exists
    if (!drawerContainer) return;
    
    if (cart.length === 0) {
        drawerContainer.innerHTML = `
            <div class="cart-drawer-header">
                <h3 class="cart-drawer-title"><i class="ri-shopping-cart-line"></i> Your Sacred Cart</h3>
                <div class="close-cart-btn" onclick="closeCartDrawer()"><i class="ri-close-line"></i></div>
            </div>
            <div class="cart-drawer-body" style="text-align: center; padding: 3rem 1rem;">
                <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1rem;">Your shopping cart is currently empty.</p>
                <a href="poshak.html" class="btn btn-primary" onclick="closeCartDrawer()">Shop Poshak Now</a>
            </div>
        `;
        // Hide persistent drawer if empty
        closeCartDrawer();
        return;
    }
    
    let itemsHTML = '';
    cart.forEach(item => {
        itemsHTML += `
            <div class="cart-drawer-item">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" onerror="this.src='assets/poshak_royal.webp'">
                    <div>
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-price">₹${item.price} each</div>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="qty-control">
                        <span class="qty-btn" onclick="updateQuantity('${item.id}', -1)"><i class="ri-subtract-line"></i></span>
                        <span class="qty-val">${item.quantity}</span>
                        <span class="qty-btn" onclick="updateQuantity('${item.id}', 1)"><i class="ri-add-line"></i></span>
                    </div>
                    <span class="remove-item-btn" onclick="removeFromCart('${item.id}')"><i class="ri-delete-bin-line"></i></span>
                </div>
            </div>
        `;
    });
    
    drawerContainer.innerHTML = `
        <div class="cart-drawer-header">
            <h3 class="cart-drawer-title"><i class="ri-shopping-cart-line"></i> Your Cart Items (${totalCount})</h3>
            <div class="close-cart-btn" onclick="closeCartDrawer()"><i class="ri-close-line"></i></div>
        </div>
        <div class="cart-drawer-body">
            ${itemsHTML}
        </div>
        <div class="cart-drawer-footer">
            <div class="cart-total-box">
                <span class="total-lbl">Subtotal Amount</span>
                <span class="total-val">₹${subtotal}</span>
            </div>
            <a href="checkout.html" class="cart-checkout-btn">
                <span>Proceed to Checkout</span>
                <i class="ri-arrow-right-line"></i>
            </a>
        </div>
    `;
}

// Show micro interaction Toast notifications
function showToast(message) {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--primary);
            color: #fff;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 100000;
            box-shadow: var(--shadow-hover);
            border-left: 5px solid var(--accent);
            font-weight: 600;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="ri-checkbox-circle-fill" style="color: var(--accent); font-size: 1.2rem;"></i> ${message}`;
    setTimeout(() => { toast.style.transform = 'translateX(0)'; }, 50);
    setTimeout(() => { toast.style.transform = 'translateX(120%)'; }, 3000);
}

// Setup elements dynamically when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Inject Bottom Persistent Drawer HTML structure if it doesn't exist
    if (!document.getElementById('cart-drawer')) {
        const drawerDiv = document.createElement('div');
        drawerDiv.id = 'cart-drawer';
        drawerDiv.className = 'cart-drawer';
        drawerDiv.innerHTML = `<div id="cart-drawer-container"></div>`;
        document.body.appendChild(drawerDiv);
    }
    
    // Inject Floating Mini Cart Bar
    if (!document.getElementById('mini-cart-bar')) {
        const miniBar = document.createElement('div');
        miniBar.id = 'mini-cart-bar';
        miniBar.className = 'mini-cart-bar';
        miniBar.onclick = () => {
            renderCartDrawer();
            openCartDrawer();
        };
        miniBar.innerHTML = `
            <i class="ri-shopping-cart-fill"></i>
            <span id="mini-cart-count">0</span> Items | <span id="mini-cart-total">₹0</span>
        `;
        document.body.appendChild(miniBar);
    }
    
    // Core Render
    renderCartDrawer();
    
    // Listen to localStorage updates across pages
    window.addEventListener('cartUpdated', () => {
        loadCart();
        renderCartDrawer();
    });
    
    // Sync active state in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.includes(href) && href !== '#') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
