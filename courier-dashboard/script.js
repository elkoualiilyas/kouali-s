document.addEventListener('DOMContentLoaded', () => {
    // Retrieve current logged-in courier details
    const currentCourier = JSON.parse(localStorage.getItem('currentCourier'));

    if (!currentCourier) {
        alert('You are not logged in as a courier. Redirecting to login page.');
        window.location.href = '../login.html';
        return;
    }

    // Display courier's name
    document.getElementById('courier-name').textContent = `Welcome, ${currentCourier.name}`;

    // Retrieve orders assigned to the courier
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const assignedOrders = orders.filter(order => order.courier === currentCourier.name);

    // Render assigned orders
    const renderOrders = () => {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = '';

        if (assignedOrders.length === 0) {
            orderList.innerHTML = '<p>No orders assigned to you yet.</p>';
            return;
        }

        assignedOrders.forEach((order, index) => {
            const user = users.find(u => u.email === order.userEmail) || {};
            const address = user.addresses && user.addresses.length > 0 ? user.addresses[0] : 'No address available';

            const li = document.createElement('li');
            li.className = 'order-item';
            li.innerHTML = `
                <div class="order-header">
                    <strong>Order ID:</strong> ${order.id}
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <ul class="order-details">
                    ${order.items.map(item => `<li>${item.name} - $${item.price} x ${item.quantity}</li>`).join('')}
                </ul>
                <p><strong>Delivery Address:</strong> ${address}</p>
                <div class="order-actions">
                    <label for="status-select-${index}">Update Status:</label>
                    <select id="status-select-${index}" ${order.status === 'confirmed' ? 'disabled' : ''}>
                        <option value="in-transit" ${order.status === 'in-transit' ? 'selected' : ''}>In-Transit</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                    <button onclick="updateOrderStatus(${index})" ${order.status === 'confirmed' ? 'disabled' : ''}>Update</button>
                </div>
            `;
            orderList.appendChild(li);
        });
    };

    // Update order status
    window.updateOrderStatus = (index) => {
        const statusSelect = document.getElementById(`status-select-${index}`);
        const newStatus = statusSelect.value;

        // Update the order status
        assignedOrders[index].status = newStatus;

        if (newStatus === 'delivered') {
            // Automatically confirm the delivered order
            assignedOrders[index].status = 'complete';
        }

        // Save back to localStorage
        localStorage.setItem('orders', JSON.stringify(orders));

        // Re-render orders
        renderOrders();

        alert('Order status updated successfully!');
    };

    // Initial render
    renderOrders();

    // Logout logic
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('currentCourier');
        alert('Logged out successfully!');
        window.location.href = '../login.html';
    });
});
