
document.addEventListener('DOMContentLoaded', () => {
    const productsSection = document.getElementById('products-section');
    const usersSection = document.getElementById('users-section');
    const incomeSection = document.getElementById('income-section');
    const couriersSection = document.getElementById('couriers-section');
    const overviewSection = document.getElementById('overview-section');
    const vehiclesSection = document.getElementById('vehicles-section');


    let products = JSON.parse(localStorage.getItem('products')) || [];
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let couriers = JSON.parse(localStorage.getItem('couriers')) || [];
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Navigation Logic
    document.getElementById('view-products').addEventListener('click', async () => {
        try {
            await showSection(productsSection);
            await renderProducts();
            console.log('Products section rendered successfully.');
        } catch (error) {
            console.error('Failed to render products section:', error);
            alert('Error: Unable to load products section.');
        }
    });
    
    document.getElementById('view-users').addEventListener('click', async () => {
        try {
            await showSection(usersSection);
            await renderUsers();
            console.log('Users section rendered successfully.');
        } catch (error) {
            console.error('Failed to render users section:', error);
            alert('Error: Unable to load users section.');
        }
    });
    
    document.getElementById('view-income').addEventListener('click', async () => {
        try {
            await showSection(incomeSection);
            await renderIncome();
            console.log('Income section rendered successfully.');
        } catch (error) {
            console.error('Failed to render income section:', error);
            alert('Error: Unable to load income section.');
        }
    });
    
    document.getElementById('view-couriers').addEventListener('click', async () => {
        try {
            await showSection(couriersSection);
            await renderCouriers();
            console.log('Couriers section rendered successfully.');
        } catch (error) {
            console.error('Failed to render couriers section:', error);
            alert('Error: Unable to load couriers section.');
        }
    });
    
    document.getElementById('view-overview').addEventListener('click', async () => {
        try {
            await showSection(overviewSection);
            await renderCharts();
            console.log('Overview section rendered successfully.');
        } catch (error) {
            console.error('Failed to render overview section:', error);
            alert('Error: Unable to load overview section.');
        }
    });
    

   // Show Section
const showSection = async (sectionToShow) => {
    try {
        [productsSection, usersSection, incomeSection, couriersSection, overviewSection, vehiclesSection].forEach(section => {
            section.classList.add('hidden');
        });
        sectionToShow.classList.remove('hidden');
        console.log(`Section ${sectionToShow.id} is now visible.`);
    } catch (error) {
        console.error('Error showing section:', error);
        alert('Error: Unable to display the section.');
    }
};

// Render Products
const renderProducts = async () => {
    try {
        const table = document.getElementById('products-table');
        table.innerHTML = '<tr><th>ID</th><th>Name</th><th>Price</th><th>Quantity</th></tr>';
        
        if (!products || products.length === 0) {
            console.warn('No products available to display.');
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = '<td colspan="4">No products available.</td>';
            table.appendChild(noDataRow);
            return;
        }
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
            `;
            table.appendChild(row);
        });
        console.log('Products rendered successfully.');
    } catch (error) {
        console.error('Error rendering products:', error);
        alert('Error: Unable to render products.');
    }
};

// Render Users
const renderUsers = async () => {
    try {
        const table = document.getElementById('users-table');
        table.innerHTML = '<tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr>';
        
        if (!users || users.length === 0) {
            console.warn('No users available to display.');
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = '<td colspan="4">No users available.</td>';
            table.appendChild(noDataRow);
            return;
        }
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
            `;
            table.appendChild(row);
        });
        console.log('Users rendered successfully.');
    } catch (error) {
        console.error('Error rendering users:', error);
        alert('Error: Unable to render users.');
    }
};


    // Render Income
    const renderIncome = () => {
        const table = document.getElementById('income-table');
        if (table) {
            table.innerHTML = '<tr><th>Product</th><th>Total Income</th></tr>';
        }        const incomeData = {};
    
        // Loop through all orders and calculate income for completed orders
        orders.forEach(order => {
            if (order.status === 'complete') {
                order.items.forEach(item => {
                    if (!incomeData[item.name]) {
                        incomeData[item.name] = 0;
                    }
                    incomeData[item.name] += item.price * item.quantity;
                });
            }
        });
    
        // Populate the table with income data
        for (let [product, income] of Object.entries(incomeData)) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product}</td>
                <td>$${income.toFixed(2)}</td>
            `;
            table.appendChild(row);
        }
    
        // Store the income data globally for chart use
        return incomeData;
    };
    

    // Render Couriers
    const renderCouriers = () => {
        const table = document.getElementById('couriers-table');
        table.innerHTML = '<tr><th>Name</th><th>Login</th><th>Actions</th></tr>';
        couriers.forEach((courier, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${courier.name}</td>
                <td>${courier.login}</td>
                <td>
                    <button onclick="editCourier(${index})">Edit</button>
                    <button onclick="deleteCourier(${index})">Delete</button>
                </td>
            `;
            table.appendChild(row);
        });
    };

    // Add Courier
    document.getElementById('add-courier-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('courier-name').value.trim();
        const login = document.getElementById('courier-login').value.trim();
        const password = document.getElementById('courier-password').value.trim();
        if (name && login && password) {
            couriers.push({ name, login, password });
            localStorage.setItem('couriers', JSON.stringify(couriers));
            renderCouriers();
            e.target.reset();
        }
    });

    // Edit Courier
    window.editCourier = (index) => {
        const courier = couriers[index];
        const newName = prompt('Edit Name:', courier.name);
        const newLogin = prompt('Edit Login:', courier.login);
        if (newName && newLogin) {
            courier.name = newName;
            courier.login = newLogin;
            localStorage.setItem('couriers', JSON.stringify(couriers));
            renderCouriers();
        }
    };

    // Delete Courier
    window.deleteCourier = (index) => {
        couriers.splice(index, 1);
        localStorage.setItem('couriers', JSON.stringify(couriers));
        renderCouriers();
    };

    // Render Charts (Chart.js)
   let incomeChartInstance = null;
let productChartInstance = null;
const renderCharts = async () => {
    try {
        const chartContainer = document.getElementById('chart-container');

        // Clear any existing charts
        chartContainer.innerHTML = '';

        // Create containers for charts dynamically
        chartContainer.innerHTML = `
            <div class="chart-box">
                <canvas id="income-chart"></canvas>
            </div>
            <div class="chart-box">
                <canvas id="product-chart"></canvas>
            </div>
        `;

        // Select the new canvas elements
        const ctxIncome = document.getElementById('income-chart').getContext('2d');
        const ctxProducts = document.getElementById('product-chart').getContext('2d');

        // Destroy existing chart instances if they exist
        if (typeof incomeChartInstance !== 'undefined' && incomeChartInstance) incomeChartInstance.destroy();
        if (typeof productChartInstance !== 'undefined' && productChartInstance) productChartInstance.destroy();

        // Fetch income data for the charts
        const incomeData = renderIncome();
        const productNames = Object.keys(incomeData);
        const productIncome = Object.values(incomeData);

        // Render the income chart
        if (productNames.length > 0) {
            incomeChartInstance = new Chart(ctxIncome, {
                type: 'bar',
                data: {
                    labels: productNames,
                    datasets: [{
                        label: 'Total Income ($)',
                        data: productIncome,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true },
                        tooltip: { enabled: true }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                },
            });
        } else {
            console.warn('No income data available.');
        }

        // Prepare data for the product chart
        const productLabels = products.map(p => p.name);
        const productQuantities = products.map(p => p.quantity);

        // Render the product chart
        if (products.length > 0) {
            productChartInstance = new Chart(ctxProducts, {
                type: 'pie',
                data: {
                    labels: productLabels,
                    datasets: [{
                        label: 'Product Quantities',
                        data: productQuantities,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(169, 169, 169, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                        ],
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true },
                        tooltip: { enabled: true }
                    },
                },
            });
        } else {
            console.warn('No product data available.');
        }
    } catch (error) {
        console.error('Error rendering charts:', error);
        alert('Error: Unable to render charts.');
    }
};

// Navigation for vehicles section
document.getElementById('view-vehicles').addEventListener('click', async () => {
    try {
        console.log('Navigating to Vehicles Section');
        console.log('vehiclesSection:', vehiclesSection);
        await showSection(vehiclesSection);
        await renderVehicles();
        console.log('Vehicles section rendered successfully.');
    } catch (error) {
        console.error('Error navigating to Vehicles Section:', error);
        alert('Error: Unable to load the vehicles section.');
    }
});

// Render vehicles
const renderVehicles = async () => {
    try {
        const vehiclesTable = document.getElementById('vehicles-table');
        let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

        vehiclesTable.innerHTML = `
            <tr>
                <th>Mark</th>
                <th>Model</th>
                <th>Image</th>
                <th>Assigned Courier</th>
                <th>Actions</th>
            </tr>
        `;

        if (!vehicles || vehicles.length === 0) {
            console.warn('No vehicles available to display.');
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = '<td colspan="5">No vehicles available.</td>';
            vehiclesTable.appendChild(noDataRow);
            return;
        }

        vehicles.forEach((vehicle, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.mark}</td>
                <td>${vehicle.model}</td>
                <td><img src="${vehicle.image}" alt="Vehicle Image" width="50"></td>
                <td>${vehicle.assignedCourier || 'Not Assigned'}</td>
                <td>
                    <button onclick="assignVehicle(${index})" class="btn btn-primary">Assign</button>
                    <button onclick="deleteVehicle(${index})" class="btn btn-danger">Delete</button>
                </td>
            `;
            vehiclesTable.appendChild(row);
        });

        console.log('Vehicles rendered successfully.');
    } catch (error) {
        console.error('Error rendering vehicles:', error);
        alert('Error: Unable to render vehicles.');
    }
};

// Add Vehicle
document.getElementById('add-vehicle-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        const mark = document.getElementById('vehicle-mark').value.trim();
        const model = document.getElementById('vehicle-model').value.trim();
        const imageInput = document.getElementById('vehicle-image');

        if (!mark || !model || !imageInput.files.length) {
            alert('Please fill in all fields and upload an image.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const newVehicle = {
                mark,
                model,
                image: reader.result,
                assignedCourier: null,
            };
            vehicles.push(newVehicle);
            localStorage.setItem('vehicles', JSON.stringify(vehicles));
            renderVehicles(); // Re-render vehicles after adding
            e.target.reset();
            alert('Vehicle added successfully!');
        };
        reader.readAsDataURL(imageInput.files[0]);
    } catch (error) {
        console.error('Error adding vehicle:', error);
        alert('Error: Unable to add the vehicle.');
    }
});


window.assignVehicle = (index) => { 
   let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vehicle = vehicles[index];
    // Create a dropdown for couriers
    const dropdown = document.createElement('select');
    couriers.forEach((courier, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = courier.name;
        dropdown.appendChild(option);
    });

    const assignButton = document.createElement('button');
    assignButton.textContent = 'Assign';
    assignButton.onclick = () => {
        const selectedCourierIndex = dropdown.value;
        if (selectedCourierIndex !== null) {
            vehicle.assignedCourier = couriers[selectedCourierIndex].name;
            localStorage.setItem('vehicles', JSON.stringify(vehicles));
            renderVehicles();
            alert('Vehicle assigned successfully!');
        }
    };

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modal.appendChild(dropdown);
    modal.appendChild(assignButton);
    document.body.appendChild(modal);
};

  // Delete vehicle
  window.deleteVehicle = (index) => {
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    vehicles.splice(index, 1);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    renderVehicles();
};

// Initial render
renderVehicles();
    
    
    
    // Logout Logic
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        alert('You have been logged out successfully!');
        window.location.href = '../login.html';
    });
    
});

function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        alert('No data available to export.');
        return;
    }

    // Exclude the `image` property
    const filteredData = data.map(({ image, ...rest }) => rest);

    const csvContent = [];
    const headers = Object.keys(filteredData[0]); // Get keys from filtered data
    csvContent.push(headers.join(',')); // Add headers

    filteredData.forEach(row => {
        const values = headers.map(header => `"${row[header] || ''}"`);
        csvContent.push(values.join(','));
    });

    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



function exportToPDF(data, title) {
    if (!data || data.length === 0) {
        alert('No data available to export.');
        return;
    }

    // Access jsPDF from the namespace
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    doc.text(title, 10, 10);

    // Exclude the `image` property
    const filteredData = data.map(({ image, ...rest }) => rest);

    const headers = Object.keys(filteredData[0]);
    const rows = filteredData.map(item => headers.map(header => item[header] || ''));

    doc.autoTable({
        head: [headers],
        body: rows,
        startY: 20,
        theme: 'grid'
    });

    doc.save(`${title}.pdf`);
}






document.getElementById('export-products-csv').addEventListener('click', () => {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    console.log('Products before exporting CSV:', products); // Add this line
    exportToCSV(products, 'products');
});

document.getElementById('export-products-pdf').addEventListener('click', () => {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    console.log('Products before exporting PDF:', products); // Add this line
    exportToPDF(products, 'Product Report');
});


document.getElementById('export-users-csv').addEventListener('click', () => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Users before exporting CSV:', users); // Debugging
    exportToCSV(users, 'users');
});

document.getElementById('export-users-pdf').addEventListener('click', () => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Users before exporting PDF:', users); // Debugging
    exportToPDF(users, 'User Report');
});


   