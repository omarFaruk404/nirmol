document.addEventListener('DOMContentLoaded', () => {
    // Update cart count on load
    updateCartCount();

    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            addToCart({ id, name, price, quantity: 1 });
            
            // Visual feedback
            const originalText = button.innerText;
            button.innerText = 'Added!';
            button.style.backgroundColor = 'var(--color-primary-green-dark)';
            setTimeout(() => {
                button.innerText = originalText;
                button.style.backgroundColor = '';
            }, 1000);
        });
    });

    // Mobile Menu Toggle (Global)
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
});

function getCart() {
    return JSON.parse(localStorage.getItem('nirmol_cart')) || [];
}

function addToCart(item) {
    const cart = getCart();
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }
    
    localStorage.setItem('nirmol_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.innerText = count;
    }
}
