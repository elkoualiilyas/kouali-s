
const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Retrieve logged-in user details
if (!currentUser || !currentUser.email) {
    alert('You are not logged in. Redirecting to the login page.');
    window.location.href = '../login.html'; // Redirect if not logged in
}

document.addEventListener('DOMContentLoaded', () => {
    const productCatalog = document.getElementById('product-catalog');
    const shoppingCart = document.getElementById('shopping-cart');
    const creditCardManagement = document.getElementById('credit-card-management');
    const productList = document.getElementById('product-list');
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    const proceedCheckout = document.getElementById('proceed-checkout');
    const creditCardList = document.getElementById('credit-card-list');
    const creditCardForm = document.getElementById('credit-card-form');
    const getWishlist = () => {
        const currentUserEmail = currentUser.email;
        const wishlistKey = `wishlist-${currentUserEmail}`;
        return JSON.parse(localStorage.getItem(wishlistKey)) || [];
    };
    const setWishlist = (wishlist) => {
        const currentUserEmail = currentUser.email;
        const wishlistKey = `wishlist-${currentUserEmail}`;
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    };



    const viewProductsButton = document.getElementById('view-products-button');
    const viewCartButton = document.getElementById('view-cart-button');
    const viewCreditCardButton = document.getElementById('view-credit-card-button');

    const getProducts = () => JSON.parse(localStorage.getItem('products')) || [];
    const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
    const setCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));
    const getCreditCard = () => {
        const allCards = JSON.parse(localStorage.getItem('creditCards')) || {};
        return allCards[currentUser.email] || null; // Use the email to fetch the user's card
    };
    
    const setCreditCard = (card) => {
        const allCards = JSON.parse(localStorage.getItem('creditCards')) || {};
        allCards[currentUser.email] = card; // Use the email to save the user's card
        localStorage.setItem('creditCards', JSON.stringify(allCards));
    };
    const categoryDropdown = document.getElementById('categories-dropdown'); // Correct ID
    categoryDropdown.addEventListener("change", (event) => {
        const selectedCategory = event.target.value;
        console.log("Selected Category:", selectedCategory); // Debugging
        renderProducts(selectedCategory);
    });
    const renderCategories = () => {
    const categoryDropdown = document.getElementById('categories-dropdown'); // Correct ID

    // Ensure the dropdown exists
    if (!categoryDropdown) {
        console.error("Category dropdown element not found!");
        return;
    }

    // Reset the dropdown
    categoryDropdown.innerHTML = '<option value="all">All Categories</option>';

    // Get products from localStorage
    const products = getProducts();
    if (!products || products.length === 0) {
        console.warn("No products found in localStorage.");
        return;
    }

    // Extract unique categories and populate the dropdown
    const categories = [...new Set(products.map(product => product.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryDropdown.appendChild(option);
    });
};
renderCategories(); // Populate dropdown

    const getOrders = () => JSON.parse(localStorage.getItem('orders')) || [];
    const setOrders = (orders) => localStorage.setItem('orders', JSON.stringify(orders));
    
    const getReview = (productId) => JSON.parse(localStorage.getItem(`review-${productId}`)) || null;
    const setReview = (productId, review) => localStorage.setItem(`review-${productId}`, JSON.stringify(review));
    const deleteReview = (productId) => localStorage.removeItem(`review-${productId}`);

    const renderOrders = () => {
        const orders = getOrders();
        const couriers = JSON.parse(localStorage.getItem('couriers')) || []; // Fetch couriers from localStorage
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = '';
    
        orders.forEach((order, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Order ID:</strong> ${order.id} | 
                <strong>Status:</strong> ${order.status} |
                <strong>Courier:</strong> ${order.courier || 'Not Assigned'}
                <ul>
                    ${order.items.map(item => `<li>${item.name} - $${item.price} x ${item.quantity}</li>`).join('')}
                </ul>
                <select id="courier-select-${index}" ${order.status !== 'on-going' ? 'disabled' : ''}>
                    <option value="">Assign Courier</option>
                    ${couriers.map(courier => `<option value="${courier.name}">${courier.name}</option>`).join('')}
                </select>
                <button class="btn btn-primary" onclick="assignCourier(${index})" ${order.status !== 'on-going' ? 'disabled' : ''}>Assign</button>
                <button class="btn btn-success" onclick="confirmOrder(${index})" ${order.status !== 'on-going' ? 'disabled' : ''}>Confirm</button>
                <button class="btn btn-danger" onclick="cancelOrder(${index})" ${order.status !== 'on-going' ? 'disabled' : ''}>Cancel</button>
                <button class="btn btn-danger" onclick="deleteOrder(${index})" ${order.status === 'on-going' ? 'disabled' : ''}>Delete</button>
            `;
            orderList.appendChild(li);
        });
    };
    
    // Function to assign a courier to an order
    window.assignCourier = (index) => {
        const orders = getOrders();
        const courierSelect = document.getElementById(`courier-select-${index}`);
        const selectedCourier = courierSelect.value;
    
        if (!selectedCourier) {
            alert('Please select a courier.');
            return;
        }
    
        orders[index].courier = selectedCourier; // Assign courier to the order
        setOrders(orders); // Save updated orders to localStorage
        renderOrders(); // Re-render the orders list
        alert(`Courier ${selectedCourier} assigned to Order ID: ${orders[index].id}`);
    };
    
    
    // Function to delete orders
    window.deleteOrder = (index) => {
        const orders = getOrders();
        if (orders[index].status !== 'on-going') {
            orders.splice(index, 1); // Remove the order from the array
            setOrders(orders); // Update localStorage
            renderOrders(); // Re-render the orders list
        } else {
            alert('You cannot delete orders that are still ongoing.');
        }
    };
    
    window.confirmOrder = (index) => {
        const orders = getOrders();
        if (orders[index].status === 'on-going') {
            orders[index].status = 'complete';
            setOrders(orders);
            renderOrders();
        }
    };
    
    window.cancelOrder = (index) => {
        const orders = getOrders();
        if (orders[index].status === 'on-going') {
            orders[index].status = 'canceled';
            setOrders(orders);
            renderOrders();
        }
    };
    const viewOrdersButton = document.getElementById('view-orders-button');

viewOrdersButton.addEventListener('click', () => {
    showSection(document.getElementById('orders-section'));
    renderOrders();
});

    
    const showSection = (sectionToShow) => {
        productCatalog.classList.add('hidden');
        shoppingCart.classList.add('hidden');
        creditCardManagement.classList.add('hidden');

        sectionToShow.classList.remove('hidden');
    };

    viewCreditCardButton.addEventListener('click', () => {
        showSection(creditCardManagement);
    });

    viewProductsButton.addEventListener('click', () => {
        showSection(productCatalog);
    });

    viewCartButton.addEventListener('click', () => {
        showSection(shoppingCart);
    });

    const renderProducts = (selectedCategory = "all") => {
        const products = getProducts(); // Fetch all products from localStorage
        productList.innerHTML = ''; // Clear the product list
    
        // Filter products by the selected category
        const filteredProducts = selectedCategory === "all"
            ? products
            : products.filter(product => product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
    
        // Check if there are products to display
        if (filteredProducts.length === 0) {
            productList.innerHTML = '<p class="no-products">No products available in this category.</p>';
            return;
        }
    
        // Render each product
        filteredProducts.forEach(product => {
            const li = document.createElement('li');
            const existingReview = getReview(product.id); // Retrieve existing reviews for the product
    
            li.innerHTML = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p>$${product.price} (${product.quantity} available)</p>
                        <input 
                            type="number" 
                            min="1" 
                            max="${product.quantity}" 
                            value="1" 
                            id="product-quantity-${product.id}" 
                            class="product-quantity-input"
                        >
                        <button 
                            class="btn btn-primary add-to-cart-btn" 
                            onclick="addToCart(${product.id})"
                        >
                            Add to Cart
                        </button>
                        <button 
                            class="wishlist-btn" 
                            onclick="toggleWishlist(${product.id})"
                        >
                            <i class="fa fa-heart ${getWishlist().some(item => item.id === product.id) ? 'wishlist-active' : ''}"></i>
                        </button>
                        <div class="review-section">
                            <h4>Review</h4>
                            <div id="review-display-${product.id}">
                                ${
                                    existingReview
                                        ? `<p><strong>${existingReview.user}:</strong> ${existingReview.text}</p>
                                           ${
                                               existingReview.user === currentUser.email
                                                   ? `<button class="btn btn-warning" onclick="editReview(${product.id})">Edit</button>
                                                      <button class="btn btn-danger" onclick="removeReview(${product.id})">Delete</button>`
                                                   : ''
                                           }`
                                        : `<textarea 
                                                id="review-text-${product.id}" 
                                                placeholder="Write a review..."
                                            ></textarea>
                                           <button 
                                                class="btn btn-secondary" 
                                                onclick="addReview(${product.id})"
                                           >
                                                Add Review
                                           </button>`
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `;
    
            productList.appendChild(li); // Append the product card to the list
        });
    };
    
    window.toggleWishlist = (productId) => {
        const wishlist = getWishlist(); // Fetch wishlist for the current user
        const products = getProducts();
        const product = products.find(p => p.id === productId);
    
        if (!product) return;
    
        const index = wishlist.findIndex(item => item.id === productId);
    
        if (index === -1) {
            wishlist.push(product); // Add to wishlist
            alert(`${product.name} has been added to your wishlist.`);
        } else {
            wishlist.splice(index, 1); // Remove from wishlist
            alert(`${product.name} has been removed from your wishlist.`);
        }
    
        setWishlist(wishlist); // Save updated wishlist for the current user
        renderProducts(); // Update product display to reflect wishlist state
    };
    
    

 window.addReview = (productId) => {
    const reviewText = document.getElementById(`review-text-${productId}`).value.trim();
    if (reviewText) {
        const review = {
            text: reviewText,
            user: currentUser.name || currentUser.email, // Use the name or email as the reviewer's identifier
        };
        setReview(productId, review);
        renderProducts(); // Re-render products to reflect the review
    }
};

    

    window.editReview = (productId) => {
        const existingReview = getReview(productId);
    
        if (existingReview && existingReview.user === currentUser.email) {
            const newReviewText = prompt('Edit your review:', existingReview.text);
    
            if (newReviewText !== null && newReviewText.trim() !== '') {
                setReview(productId, { text: newReviewText.trim(), user: currentUser.email });
                renderProducts(); // Re-render products to reflect the updated review
            }
        } else {
            alert("You can only edit your own reviews!");
        }
    };
    
    window.removeReview = (productId) => {
        const existingReview = getReview(productId);
    
        if (existingReview && existingReview.user === currentUser.email) {
            deleteReview(productId);
            renderProducts(); // Re-render products to remove the review
        } else {
            alert("You can only delete your own reviews!");
        }
    };
    

    const renderCart = () => {
        const cart = getCart();
        cartList.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name} - $${item.price} x ${item.quantity}</span>
                <input type="number" min="1" value="${item.quantity}" onchange="updateCart(${index}, this.value)">
                <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartList.appendChild(li);
        });

        cartTotal.textContent = total.toFixed(2);
        proceedCheckout.disabled = cart.length === 0 || !getCreditCard();
    };

    const renderCreditCard = () => {
        const card = getCreditCard(); // Fetch the current user's card
        creditCardList.innerHTML = ''; // Clear the UI
    
        if (card) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${card.cardNumber} - ${card.cardHolder} (Expiry: ${card.cardExpiry})</span>
                <button class="btn btn-warning" onclick="editCreditCard()">Edit</button>
                <button class="btn btn-danger" onclick="deleteCreditCard()">Delete</button>
            `;
            creditCardList.appendChild(li);
            proceedCheckout.disabled = false;
        } else {
            proceedCheckout.disabled = true;
        }
    };
    

    window.addToCart = (productId) => {
        const products = getProducts();
        const cart = getCart();
        const product = products.find(p => p.id === productId);
        const quantityInput = document.getElementById(`product-quantity-${productId}`);
        const quantity = parseInt(quantityInput.value);

        if (quantity > 0 && quantity <= product.quantity) {
            product.quantity -= quantity;
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity += quantity;
            } else {
                cart.push({ ...product, quantity });
            }
            localStorage.setItem('products', JSON.stringify(products));
            setCart(cart);
            renderProducts();
            renderCart();
        } else {
            alert('Invalid quantity!');
        }
    };

    window.updateCart = (index, newQuantity) => {
        const products = getProducts();
        const cart = getCart();
        const item = cart[index];
        newQuantity = parseInt(newQuantity);
        if (newQuantity > 0) {
            const product = products.find(p => p.id === item.id);
            product.quantity += item.quantity - newQuantity;
            item.quantity = newQuantity;
            localStorage.setItem('products', JSON.stringify(products));
            setCart(cart);
            renderProducts();
            renderCart();
        } else {
            removeFromCart(index);
        }
    };

    window.removeFromCart = (index) => {
        const products = getProducts();
        const cart = getCart();
        const item = cart.splice(index, 1)[0];
        const product = products.find(p => p.id === item.id);
        product.quantity += item.quantity;
        localStorage.setItem('products', JSON.stringify(products));
        setCart(cart);
        renderProducts();
        renderCart();
    };

    creditCardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cardNumber = document.getElementById('card-number').value.trim();
        const cardHolder = document.getElementById('card-holder').value.trim();
        const cardExpiry = document.getElementById('card-expiry').value.trim();
        if (cardNumber && cardHolder && cardExpiry) {
            setCreditCard({ cardNumber, cardHolder, cardExpiry });
            renderCreditCard();
            creditCardForm.reset();
        }
    });

    window.editCreditCard = () => {
        const card = getCreditCard();
        if (!card) {
            alert('No credit card found to edit.');
            return;
        }
        document.getElementById('card-number').value = card.cardNumber;
        document.getElementById('card-holder').value = card.cardHolder;
        document.getElementById('card-expiry').value = card.cardExpiry;
        deleteCreditCard();
    };
    const deleteCreditCard = () => {
        const allCards = JSON.parse(localStorage.getItem('creditCards')) || {};
        delete allCards[currentUser.email]; // Remove the card associated with the current user
        localStorage.setItem('creditCards', JSON.stringify(allCards));
        renderCreditCard(); // Re-render the UI
    };
    
   
    

    proceedCheckout.addEventListener('click', () => {
        const cart = getCart();
        const card = getCreditCard();
    
        if (!cart.length) {
            alert("Your cart is empty!");
            return;
        }
    
        if (!card) {
            alert("Please add a credit card before proceeding!");
            return;
        }
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const currentUserData = users.find(user => user.email === currentUser.email);
        const userAddress =
        currentUserData?.addresses?.length > 0
            ? currentUserData.addresses[0] // Default to the first address
            : "No address available";
        const orders = getOrders();
        // Create a new order
        const newOrder = {
            id: orders.length + 1,
            status: 'on-going',
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            userEmail: currentUser.email, // Add user's email
            deliveryAddress: userAddress, // Add user's address
            date: new Date().toLocaleString() // Optional: Add timestamp
        };
    
        // Add the new order to the orders array
        orders.push(newOrder);
        setOrders(orders);
    
        // Clear the cart after checkout
        setCart([]);
        renderCart();
        renderOrders();
    
        // Notify the user
        alert("Checkout Successful! Your order has been placed.");
    });
    
    

    showSection(productCatalog);
    renderProducts();
    renderCart();
    renderCreditCard();
});
document.getElementById('logout-button').addEventListener('click', () => {
    // Clear user-related data from localStorage
    localStorage.removeItem('currentUser'); // Adjust the key if necessary
    localStorage.removeItem('cart'); // Clear the cart

    // Redirect to the login page
    alert('You have been logged out successfully!');
    window.location.href = '../login.html'; // Replace with your actual login page URL
});


console.log('Current User:', currentUser);
console.log('Credit Cards in LocalStorage:', JSON.parse(localStorage.getItem('creditCards')));
