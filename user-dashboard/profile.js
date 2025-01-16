document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const wishlist = JSON.parse(localStorage.getItem(`wishlist-${currentUser.email}`)) || [];
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const allCards = JSON.parse(localStorage.getItem('creditCards')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Populate profile form with user data
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profilePicture = document.getElementById('profile-picture');
    const profilePictureUpload = document.getElementById('profile-picture-upload');
    const saveProfilePicture = document.getElementById('save-profile-picture');

    profileName.value = currentUser.name || '';
    profileEmail.value = currentUser.email || '';
    profilePicture.src = currentUser.profilePicture || 'profile.png';

    // Save profile changes
    document.getElementById('edit-profile-form').addEventListener('submit', (event) => {
        event.preventDefault();

        const updatedUser = {
            ...currentUser,
            name: profileName.value,
            email: profileEmail.value,
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
    });

    // Profile picture upload and save
    document.querySelector('.upload-overlay').addEventListener('click', () => {
        profilePictureUpload.click(); // Trigger file input click
    });

    profilePictureUpload.addEventListener('change', () => {
        const file = profilePictureUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                profilePicture.src = reader.result; // Preview the selected image
            };
            reader.readAsDataURL(file);
        }
    });

    saveProfilePicture.addEventListener('click', () => {
        const file = profilePictureUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // Update the profile picture in `currentUser`
                currentUser.profilePicture = reader.result;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                profilePicture.src = reader.result;
    
                // Fetch and update the user's record in the `users` array
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(user => user.email === currentUser.email);
    
                if (userIndex !== -1) {
                    users[userIndex].profilePicture = reader.result; // Update profile picture
                    localStorage.setItem('users', JSON.stringify(users)); // Save updated users array
                    alert('Profile picture updated successfully!');
                } else {
                    console.error('User not found in users table.');
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a picture.');
        }
    });
    

    // Display wishlist
    const wishlistList = document.getElementById('wishlist-list');
    wishlistList.innerHTML = ''; // Clear previous items

    wishlist.forEach((wishlistItem) => {
        const product = allProducts.find(p => p.id === wishlistItem.id);

        if (product) {
            const li = document.createElement('li');
            li.classList.add('wishlist-item');

            li.innerHTML = `
                <div class="wishlist-item-card">
                    <img src="${product.image}" alt="${product.name}" class="wishlist-item-image">
                    <div class="wishlist-item-details">
                        <h3>${product.name}</h3>
                        <p>Price: $${product.price}</p>
                    </div>
                </div>
            `;

            li.addEventListener('click', () => {
                window.location.href = `index.html?highlight=${product.id}`;
            });

            wishlistList.appendChild(li);
        }
    });

    // Display current user's credit card info
    const creditCardList = document.getElementById('credit-card-list');
    creditCardList.innerHTML = ''; // Clear previous content

    const userCard = allCards[currentUser.email];
    if (userCard) {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="credit-card-details">
                <p><strong>Card Number:</strong> ${userCard.cardNumber}</p>
                <p><strong>Card Holder:</strong> ${userCard.cardHolder}</p>
                <p><strong>Expiry Date:</strong> ${userCard.cardExpiry}</p>
            </div>
        `;
        creditCardList.appendChild(li);
    } else {
        creditCardList.innerHTML = '<p>No credit card found for this user.</p>';
    }

    // Back button functionality
    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    const mapContainer = document.getElementById('map');
    const addressInput = document.getElementById('address-input');
    const saveAddressButton = document.getElementById('save-address');
    const addressList = document.getElementById('address-list');

    // Initialize Leaflet map
    const defaultLocation = [40.7128, -74.0060]; // Default to New York City
    const map = L.map(mapContainer).setView(defaultLocation, 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add draggable marker
    const marker = L.marker(defaultLocation, { draggable: true }).addTo(map);

    // Reverse geocoding to get address using Nominatim
    function getAddress(lat, lng) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.display_name) {
                    addressInput.value = data.display_name;
                } else {
                    addressInput.value = 'Address not found';
                }
            })
            .catch((error) => {
                console.error('Error fetching address:', error);
                addressInput.value = 'Unable to retrieve address';
            });
    }

    // Update address input when the marker is moved
    marker.on('moveend', () => {
        const { lat, lng } = marker.getLatLng();
        getAddress(lat, lng);
    });

    // Load user's saved addresses
    function loadAddresses() {
        const userIndex = users.findIndex((user) => user.email === currentUser.email);
        if (userIndex !== -1 && users[userIndex].addresses) {
            addressList.innerHTML = '';
            users[userIndex].addresses.forEach((address, index) => {
                const li = document.createElement('li');
                li.textContent = address;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'btn btn-danger';
                deleteButton.onclick = () => deleteAddress(index);
                li.appendChild(deleteButton);
                addressList.appendChild(li);
            });
        }
    }

    // Save address
    saveAddressButton.addEventListener('click', () => {
        const address = addressInput.value.trim();
        if (address) {
            const userIndex = users.findIndex((user) => user.email === currentUser.email);
            if (userIndex !== -1) {
                if (!users[userIndex].addresses) users[userIndex].addresses = [];
                users[userIndex].addresses.push(address);
                localStorage.setItem('users', JSON.stringify(users));
                loadAddresses();
                alert('Address saved successfully!');
            } else {
                console.error('User not found in user list.');
            }
        } else {
            alert('Please select a valid address.');
        }
    });

    // Delete address
    function deleteAddress(index) {
        const userIndex = users.findIndex((user) => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].addresses.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            loadAddresses();
        }
    }

    // Load addresses on page load
    loadAddresses();
});
