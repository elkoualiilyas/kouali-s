document.addEventListener('DOMContentLoaded', () => {
    const categoryList = document.getElementById('category-list');
    const productList = document.getElementById('product-list');
    const categoryManagementList = document.getElementById('categories-management-list');
    const productManagementList = document.getElementById('products-management-list');
    const productCategorySelect = document.getElementById('product-category');
    const userTotalCategories = document.getElementById('user-total-categories');
    const userTotalProducts = document.getElementById('user-total-products');

    
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];

  // Asynchronous function to update local storage with error handling
const updateLocalStorage = async () => {
    try {
        await Promise.resolve();
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('products', JSON.stringify(products));
        console.log('LocalStorage updated successfully.');
    } catch (error) {
        console.error('Failed to update LocalStorage:', error);
    }
};

// Asynchronous function to convert a file to Base64 with error handling
const convertToBase64 = async (file) => {
    try {
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    } catch (error) {
        console.error('Failed to convert file to Base64:', error);
        throw error; // Re-throw the error for the caller to handle
    }
};

// Asynchronous function to update user info with error handling
const updateUserInfo = async () => {
    try {
        await Promise.resolve(); // Simulate async behavior
        userTotalCategories.textContent = `Total Categories: ${categories.length}`;
        userTotalProducts.textContent = `Total Products: ${products.length}`;
        console.log('User info updated successfully.');
    } catch (error) {
        console.error('Failed to update user info:', error);
    }
};

const renderCategories = async () => {
    try {
        // Clear existing content
        categoryList.innerHTML = '';
        categoryManagementList.innerHTML = '';
        productCategorySelect.innerHTML = '';

        // Iterate through categories
        categories.forEach((category, index) => {
            // Render category in the main list
            const li = document.createElement('li');
            li.textContent = category;
            categoryList.appendChild(li);

            // Render category in the management list with edit/delete options
            const manageLi = document.createElement('li');
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = category;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editCategory(index, editInput.value);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteCategory(index);

            manageLi.appendChild(editInput);
            manageLi.appendChild(editButton);
            manageLi.appendChild(deleteButton);
            categoryManagementList.appendChild(manageLi);

            // Add category to the product category dropdown
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            productCategorySelect.appendChild(option);
        });

        // Update user info
        await updateUserInfo();
        console.log('Categories rendered successfully.');
    } catch (error) {
        console.error('Failed to render categories:', error);
    }
};


const renderProducts = async () => {
    try {
        // Clear existing content
        productList.innerHTML = '';
        productManagementList.innerHTML = '';

        // Iterate through products
        products.forEach((product, index) => {
            // Render product in the main product list
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;">
                ${product.name} - $${product.price} (${product.quantity})
            `;
            productList.appendChild(li);

            // Render product in the management list with edit/delete options
            const manageLi = document.createElement('li');
            manageLi.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;">
                ${product.name} - $${product.price} (${product.quantity}) (${product.category})
            `;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = async () => {
                try {
                    await editProduct(index);
                } catch (error) {
                    console.error(`Failed to edit product at index ${index}:`, error);
                }
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = async () => {
                try {
                    await deleteProduct(index);
                } catch (error) {
                    console.error(`Failed to delete product at index ${index}:`, error);
                }
            };

            manageLi.appendChild(editButton);
            manageLi.appendChild(deleteButton);
            productManagementList.appendChild(manageLi);
        });

        // Update user information
        await updateUserInfo();
        console.log('Products rendered successfully.');
    } catch (error) {
        console.error('Failed to render products:', error);
    }
};

    

    document.getElementById('add-category-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const categoryName = document.getElementById('category-name').value.trim();
        if (categoryName && !categories.includes(categoryName)) {
            categories.push(categoryName);
            updateLocalStorage();
            renderCategories();
            e.target.reset();
        }
    });
    document.getElementById('add-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const productName = document.getElementById('product-name').value.trim();
            const productPrice = parseFloat(document.getElementById('product-price').value.trim());
            const productQuantity = parseInt(document.getElementById('product-quantity').value.trim());
            const productCategory = productCategorySelect.value;
            const productImageInput = document.getElementById('product-image');
            const productImage = productImageInput.files[0];
    
            if (productName && productPrice && productQuantity && productCategory && productImage) {
                const base64Image = await convertToBase64(productImage);
    
                const product = {
                    id: products.length + 1,
                    name: productName,
                    price: productPrice,
                    quantity: productQuantity,
                    category: productCategory,
                    image: base64Image,
                };
    
                products.push(product);
                await updateLocalStorage();
                await renderProducts();
                e.target.reset();
                console.log('Product added successfully.');
            } else {
                throw new Error('All fields are required to add a product.');
            }
        } catch (error) {
            console.error('Failed to add product:', error);
            alert(`Error: ${error.message}`);
        }
    });
    
    const editProduct = async (index) => {
        try {
            const product = products[index];
        
            // Prompt for new product details
            const newName = prompt("Enter new product name:", product.name);
            if (newName !== null && newName.trim() !== "") {
                product.name = newName.trim();
            }
    
            const newPrice = prompt("Enter new product price:", product.price);
            if (newPrice !== null && !isNaN(newPrice) && parseFloat(newPrice) > 0) {
                product.price = parseFloat(newPrice);
            }
    
            const newQuantity = prompt("Enter new product quantity:", product.quantity);
            if (newQuantity !== null && !isNaN(newQuantity) && parseInt(newQuantity) >= 0) {
                product.quantity = parseInt(newQuantity);
            }
    
            // Save changes to localStorage and re-render products
            await updateLocalStorage();
            await renderProducts();
            console.log(`Product at index ${index} updated successfully.`);
        } catch (error) {
            console.error(`Failed to edit product at index ${index}:`, error);
            alert(`Error: ${error.message}`);
        }
    };
    
    

    const editCategory = async (index, newName) => {
        try {
            if (newName && !categories.includes(newName)) {
                categories[index] = newName;
                await updateLocalStorage();
                await renderCategories();
                console.log(`Category at index ${index} updated successfully to "${newName}".`);
            } else {
                throw new Error('Invalid category name or category already exists.');
            }
        } catch (error) {
            console.error(`Failed to edit category at index ${index}:`, error);
            alert(`Error: ${error.message}`);
        }
    };
    

    const deleteCategory = async (index) => {
        try {
            categories.splice(index, 1);
            await updateLocalStorage();
            await renderCategories();
            console.log(`Category at index ${index} deleted successfully.`);
        } catch (error) {
            console.error(`Failed to delete category at index ${index}:`, error);
            alert(`Error: ${error.message}`);
        }
    };
    

    const deleteProduct = async (index) => {
        try {
            products.splice(index, 1);
            await updateLocalStorage();
            await renderProducts();
            console.log(`Product at index ${index} deleted successfully.`);
        } catch (error) {
            console.error(`Failed to delete product at index ${index}:`, error);
            alert(`Error: ${error.message}`);
        }
    };
    

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        alert('You have been logged out successfully!');
        window.location.href = '../login.html';
    });

    document.getElementById('manage-categories-button').addEventListener('click', () => {
        document.getElementById('overview').classList.add('hidden');
        document.getElementById('manage-categories').classList.remove('hidden');
        document.getElementById('manage-products').classList.add('hidden');
    });

    document.getElementById('manage-products-button').addEventListener('click', () => {
        document.getElementById('overview').classList.add('hidden');
        document.getElementById('manage-categories').classList.add('hidden');
        document.getElementById('manage-products').classList.remove('hidden');
    });

    renderCategories();
    renderProducts();
});
