

// Cart functionality
let cart = [];

// Load cart from localStorage
function loadCart() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Loaded cart from storage:', cart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    console.log('Updating cart display, current cart:', cart);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        console.log('Updated cart count to:', totalItems);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartTotal();
}

function updateCartTotal() {
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartTotalElement = document.getElementById('cartTotal');
    const orderTotalElement = document.getElementById('orderTotal');
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    }
    if (orderTotalElement) {
        orderTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    }
}

function addToCart(productId, name, price, image) {
    if (!productId || !name || !price) {
        console.error('Invalid product data:', { productId, name, price, image });
        return;
    }
    
    console.log('Adding to cart:', { productId, name, price, image });
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Updated existing item quantity:', existingItem);
    } else {
        const newItem = {
            id: productId,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        };
        cart.push(newItem);
        console.log('Added new item:', newItem);
    }
    
    updateCartDisplay();
    showCartNotification();
}

function removeFromCart(productId) {
    console.log('Removing from cart:', productId);
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    renderCart();
}

function updateQuantity(productId, newQuantity) {
    console.log('Updating quantity:', { productId, newQuantity });
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, newQuantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
            renderCart();
        }
    }
}

function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 100);
}

function renderCart() {
    console.log('Rendering cart page, current cart:', cart);
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) {
        console.log('Not on cart page, skipping render');
        return;
    }
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty. <a href="../index.html#shop">Continue shopping</a></p>';
        console.log('Cart is empty, showing empty message');
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                </div>
                <div class="col-md-10">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-8">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text">$${item.price.toFixed(2)}</p>
                            </div>
                            <div class="col-md-4">
                                <div class="quantity-controls">
                                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                    <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart('${item.id}')">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    console.log('Updated cart page HTML');

    // Update cart totals
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalElement = document.getElementById('cartTotal');
    const orderTotalElement = document.getElementById('orderTotal');
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
    if (orderTotalElement) {
        orderTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function proceedToCheckout() {
    alert('Checkout functionality coming soon!');
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing cart...');
    
    // Load cart from localStorage
    loadCart();
    
    // Initialize cart display
    updateCartDisplay();
    renderCart();

    // Add event listeners to Add to Cart buttons
    function initializeAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        console.log('Found add to cart buttons:', addToCartButtons.length);
        
        addToCartButtons.forEach(button => {
            // Remove any existing click listeners
            button.removeEventListener('click', handleAddToCart);
            // Add new click listener
            button.addEventListener('click', handleAddToCart);
        });
    }

    function handleAddToCart(e) {
        e.preventDefault();
        console.log('Add to cart button clicked');
        
        // Get data from the parent product card
        const productCard = this.closest('.product-card');
        console.log('Found product card:', productCard);
        
        if (!productCard) {
            console.error('No product card found!');
            return;
        }
        
        const productId = productCard.dataset.productId;
        const name = productCard.dataset.name;
        const price = productCard.dataset.price;
        const image = productCard.dataset.image;
        
        console.log('Product data:', { productId, name, price, image });
        
        // Get quantity if available (on product detail pages)
        const quantityInput = document.getElementById('quantity');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        console.log('Quantity:', quantity);
        
        // Add to cart
        addToCart(productId, name, price, image);
    }

    // Initialize buttons
    initializeAddToCartButtons();

    // Re-initialize buttons when content changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                initializeAddToCartButtons();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize donation button
    const donateButton = document.querySelector('#donate button');
    if (donateButton) {
        donateButton.addEventListener('click', function() {
            alert('Donation feature coming soon! We will integrate with a secure payment processor.');
        });
    }

    // Add loading animation for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
});

// Listen for cart changes in other tabs/windows
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        console.log('Cart updated in another tab');
        cart = JSON.parse(e.newValue) || [];
        updateCartDisplay();
        renderCart();
    }
});

        updateCartDisplay();
        renderCart();
    }
});

