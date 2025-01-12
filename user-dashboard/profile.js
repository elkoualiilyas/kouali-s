document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const wishlist = JSON.parse(localStorage.getItem(`wishlist-${currentUser.email}`)) || [];
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const allCards = JSON.parse(localStorage.getItem('creditCards')) || {};

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
                currentUser.profilePicture = reader.result;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                profilePicture.src = reader.result;
                alert('Profile picture updated successfully!');
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
});
