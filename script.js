// Sample menu data
const menuItems = [
    { id: 1, name: 'Masala Dosa', category: 'breakfast', price: 45, description: 'Crispy dosa with potato filling and sambhar', emoji: '🥞' },
    { id: 2, name: 'Idli Sambhar', category: 'breakfast', price: 35, description: 'Steamed rice cakes with lentil curry', emoji: '🍚' },
    { id: 3, name: 'Poha', category: 'breakfast', price: 25, description: 'Flattened rice with vegetables and spices', emoji: '🍛' },
    { id: 4, name: 'Rajma Rice', category: 'lunch', price: 65, description: 'Kidney beans curry with basmati rice', emoji: '🍛' },
    { id: 5, name: 'Dal Chawal', category: 'lunch', price: 55, description: 'Lentil curry with steamed rice', emoji: '🍚' },
    { id: 6, name: 'Chole Bhature', category: 'lunch', price: 70, description: 'Spiced chickpeas with fried bread', emoji: '🍞' },
    { id: 7, name: 'Samosa', category: 'snacks', price: 15, description: 'Crispy triangular pastry with potato filling', emoji: '🥟' },
    { id: 8, name: 'Vada Pav', category: 'snacks', price: 20, description: 'Spiced potato fritter in a bun', emoji: '🍔' },
    { id: 9, name: 'Pani Puri', category: 'snacks', price: 30, description: 'Crispy shells with spiced water', emoji: '🫧' },
    { id: 10, name: 'Tea', category: 'beverages', price: 10, description: 'Hot masala chai', emoji: '🍵' },
    { id: 11, name: 'Coffee', category: 'beverages', price: 15, description: 'Fresh filter coffee', emoji: '☕' },
    { id: 12, name: 'Fresh Lime Soda', category: 'beverages', price: 25, description: 'Refreshing lime drink with soda', emoji: '🥤' }
];

let cart = [];
let currentItem = null;
let currentUser = null;
let users = []; // In-memory user storage

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
        displayMenuItems(filteredItems);
    });

    // Modal close functionality
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('buyNowModal').style.display = 'none';
    });

    // Form submission
    document.getElementById('studentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitOrder();
    });

    // Click outside modal to close
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('buyNowModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainContent();
    } else {
        showLoginRequired();
    }
}

function showLogin() {
    document.getElementById('authContainer').classList.add('active');
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('loginRequiredContent').classList.add('hidden');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    clearMessages();
}

function showSignup() {
    document.getElementById('authContainer').classList.add('active');
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('loginRequiredContent').classList.add('hidden');
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    clearMessages();
}

function showLoginRequired() {
    document.getElementById('authContainer').classList.remove('active');
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('loginRequiredContent').classList.remove('hidden');
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('cartButton').style.display = 'none';
    document.getElementById('searchBarContainer').style.display = 'none';
}

function showMainContent() {
    document.getElementById('authContainer').classList.remove('active');
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('loginRequiredContent').classList.add('hidden');
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('cartButton').style.display = 'block';
    document.getElementById('searchBarContainer').style.display = 'block';
    document.getElementById('userName').textContent = currentUser.name;
    
    displayMenuItems(menuItems);
    updateCartCount();
    updateCartDisplay();
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Load users from localStorage
    const savedUsers = localStorage.getItem('canteenUsers');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    // Check if user exists and password matches
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainContent();
        clearMessages();
    } else {
        showError('loginError', 'Invalid email or password. Please try again.');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const rollNumber = document.getElementById('signupRollNumber').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showError('signupError', 'Passwords do not match.');
        return;
    }
    
    if (!/^[0-9]{10}$/.test(phone)) {
        showError('signupError', 'Please enter a valid 10-digit phone number.');
        return;
    }
    
    // Load existing users
    const savedUsers = localStorage.getItem('canteenUsers');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showError('signupError', 'An account with this email already exists.');
        return;
    }
    
    if (users.find(u => u.rollNumber === rollNumber)) {
        showError('signupError', 'An account with this roll number already exists.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        rollNumber,
        phone,
        password
    };
    
    users.push(newUser);
    localStorage.setItem('canteenUsers', JSON.stringify(users));
    
    showSuccess('signupSuccess', 'Account created successfully! You can now login.');
    
    // Clear form
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupRollNumber').value = '';
    document.getElementById('signupPhone').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
    
    // Switch to login form after a delay
    setTimeout(() => {
        showLogin();
    }, 2000);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    cart = [];
    showLoginRequired();
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    successElement.textContent = message;
    successElement.style.display = 'block';
}

function clearMessages() {
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('signupError').style.display = 'none';
    document.getElementById('signupSuccess').style.display = 'none';
}

function displayMenuItems(items) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';

    items.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.className = 'menu-item';
        menuItemDiv.innerHTML = `
            <div class="item-image">${item.emoji}</div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-price">₹${item.price}</div>
                <div class="item-actions">
                    <button class="btn btn-secondary" onclick="addToCart(${item.id})">Add to Cart</button>
                    <button class="btn btn-primary" onclick="buyNow(${item.id})">Buy Now</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(menuItemDiv);
    });
}

function filterCategory(category) {
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter and display items
    const filteredItems = category === 'all' ? menuItems : menuItems.filter(item => item.category === category);
    displayMenuItems(filteredItems);
}

function addToCart(itemId) {
    if (!currentUser) {
        alert('Please login to add items to cart.');
        return;
    }
    
    const item = menuItems.find(item => item.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...item, quantity: 1});
    }

    updateCartCount();
    updateCartDisplay();

    // Show brief feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.background = '#28a745';
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1000);
}

function buyNow(itemId) {
    if (!currentUser) {
        alert('Please login to place an order.');
        return;
    }
    
    const item = menuItems.find(item => item.id === itemId);
    currentItem = {...item, quantity: 1};

    // Pre-fill user data
    document.getElementById('rollNumber').value = currentUser.rollNumber;
    document.getElementById('phoneNumber').value = currentUser.phone;

    // Populate order summary
    document.getElementById('orderSummary').innerHTML = `
        <h3>Order Summary</h3>
        <div style="display: flex; justify-content: space-between; margin: 1rem 0;">
            <span>${item.name} × 1</span>
            <strong>₹${item.price}</strong>
        </div>
        <div style="border-top: 1px solid #ddd; padding-top: 1rem; display: flex; justify-content: space-between;">
            <strong>Total: ₹${item.price}</strong>
        </div>
    `;

    document.getElementById('buyNowModal').style.display = 'block';
}

function submitOrder() {
    const rollNumber = document.getElementById('rollNumber').value;
    const campusBlock = document.getElementById('campusBlock').value;
    const degree = document.getElementById('degree').value;
    const floorNumber = document.getElementById('floorNumber').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    if (!rollNumber || !campusBlock || !degree || !floorNumber || !phoneNumber) {
        alert('Please fill in all required fields.');
        return;
    }

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }

    // Format message for WhatsApp
    let message;
    if (currentItem.isMultiple) {
        message = `🍽️ *New Order from College Canteen*\n\n📋 *Order Details:*\n${cart.map(item => `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}\n\n💰 *Total Price: ₹${currentItem.price}*\n\n👨‍🎓 *Student Details:*\n• Name: ${currentUser.name}\n• Roll Number: ${rollNumber}\n• Campus Block: ${campusBlock}\n• Degree: ${degree}\n• Floor: ${floorNumber}\n• Phone: ${phoneNumber}\n\n📞 Please confirm this order and provide estimated delivery time.`;
    } else {
        message = `🍽️ *New Order from College Canteen*\n\n📋 *Order Details:*\n• Item: ${currentItem.name}\n• Quantity: ${currentItem.quantity}\n• Total Price: ₹${currentItem.price}\n\n👨‍🎓 *Student Details:*\n• Name: ${currentUser.name}\n• Roll Number: ${rollNumber}\n• Campus Block: ${campusBlock}\n• Degree: ${degree}\n• Floor: ${floorNumber}\n• Phone: ${phoneNumber}\n\n📞 Please confirm this order and provide estimated delivery time.`;
    }

    // WhatsApp number (replace with actual canteen WhatsApp number)
    const canteenWhatsApp = '6281560065'; // Replace with actual number

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${canteenWhatsApp}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');

    // Close modal and reset form
    document.getElementById('buyNowModal').style.display = 'none';
    document.getElementById('studentForm').reset();
    
    // If this was a cart checkout, clear the cart
    if (currentItem.isMultiple) {
        cart = [];
        updateCartCount();
        updateCartDisplay();
        toggleCart(); // Close cart sidebar
    }
}

function toggleCart() {
    if (!currentUser) {
        alert('Please login to view your cart.');
        return;
    }
    
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">Your cart is empty</div>';
        cartTotal.textContent = '0';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <div>₹${item.price} each</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="margin: 0 1rem;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="margin-left: 1rem; background: #ff4757; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total;
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    updateCartDisplay();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Create order summary for multiple items
    const orderSummary = cart.map(item => `${item.name} × ${item.quantity}`).join(', ');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    currentItem = {
        name: orderSummary,
        quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
        price: total,
        isMultiple: true
    };

    // Pre-fill user data
    document.getElementById('rollNumber').value = currentUser.rollNumber;
    document.getElementById('phoneNumber').value = currentUser.phone;

    // Populate order summary
    let summaryHTML = '<h3>Order Summary</h3>';
    cart.forEach(item => {
        summaryHTML += `
            <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
                <span>${item.name} × ${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `;
    });
    summaryHTML += `
        <div style="border-top: 1px solid #ddd; padding-top: 1rem; display: flex; justify-content: space-between;">
            <strong>Total: ₹${total}</strong>
        </div>
    `;

    document.getElementById('orderSummary').innerHTML = summaryHTML;
    document.getElementById('buyNowModal').style.display = 'block';
}
