🍽️ Aditya Campus Canteen - Food Delivery System
A modern, responsive web application designed for college campuses to streamline food ordering from the canteen. This system allows students to browse the daily menu, manage a cart, and place orders directly to the canteen staff via WhatsApp integration.

✨ Features
🔐 User Authentication
Sign Up & Login: Securely handles user registration with local storage persistence.

Profile Management: Stores student details like Roll Number and Phone Number to automate the checkout process.

Session Persistence: Keeps users logged in even after page refreshes.

🍱 Menu & Exploration
Category Filtering: Easily switch between Breakfast, Lunch, Snacks, and Beverages.

Real-time Search: Instantly find specific food items using the dynamic search bar.

Interactive UI: Hover effects, smooth transitions, and emoji-based food representation.

🛒 Ordering System
Shopping Cart: Add multiple items, adjust quantities, or remove items before ordering.

"Buy Now" Quick Order: Skip the cart for a single-item fast checkout.

Smart Forms: Automatically pulls student data into the order form to save time.

WhatsApp Integration: Generates a professional, formatted order summary and opens WhatsApp to send the order directly to the canteen's official number.

📸 Preview
🚀 How It Works
Authentication: Users must log in or create an account to view the menu and place orders.

Selection: Browse categories or search for items like "Masala Dosa" or "Coffee."

Details: Click "Buy Now" or "Proceed to Checkout" to open the Delivery Details modal.

Location: Select your specific Campus Block (e.g., Academic Block A) and Floor Number.

Finalize: Click "Send Order via WhatsApp." The app formats a message like this:

🍽️ New Order from College Canteen
📋 Order Details:
• Item: Masala Dosa × 1
• Total Price: ₹45
👨‍🎓 Student Details:
• Name: [User Name]
• Roll Number: [Roll No]
• Campus Block: Academic Block A

🛠️ Technical Implementation
Frontend Architecture
HTML5: Semantic structure for better accessibility.

CSS3: Uses Flexbox and CSS Grid for a fully responsive layout. Features a glassmorphism header and smooth modal animations.

Vanilla JavaScript: Handles state management (cart, user sessions, filtering) without the need for heavy frameworks.

Storage
Local Storage: Used to store canteenUsers and the current sessionUser, ensuring data persists without a backend database.

📂 File Structure
Plaintext
Aditya Canteen/
├── index.html    # Main structure and modals
├── styles.css    # Layout, animations, and responsiveness
└── script.js     # Logic for auth, cart, and WhatsApp API
⚙️ Setup Instructions
Clone the Repository:

Bash
git clone https://github.com/your-username/aditya-canteen.git
Navigate to the Folder:

Bash
cd aditya-canteen
Launch:
Simply open index.html in any modern web browser.

Note: To change the receiving WhatsApp number, update the canteenWhatsApp variable in script.js (Line 274).
