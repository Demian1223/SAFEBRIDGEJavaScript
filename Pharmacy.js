// Wait until the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Fetch and display product data from a JSON file
    fetch('Medicine.json')
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            displayProducts(data.categories); // Display the product categories and products dynamically
            loadCartData(); // Load saved cart data from localStorage
        })
        .catch(error => console.error('Error loading the products:', error)); // Handle fetch errors

    // Define button variables for adding and applying favourites
    const addToFavouritesButton = document.getElementById('addToFavourites');
    const applyFavouritesButton = document.getElementById('applyFavourites');



                                                // 1. Function to displaying products dynamically

    function displayProducts(categories) {
        const categoriesContainer = document.getElementById('categories-container'); // Get the container for categories
        categories.forEach(category => {
            const section = document.createElement('section'); // Create a new section for each category
            section.className = 'Wellness_flex'; // Assign a class for styling
            const h2 = document.createElement('h2'); // Create a heading for the category name
            h2.textContent = category.name; // Set the category name
            section.appendChild(h2); // Add the heading to the section

            const shopContainer = document.createElement('div'); // Create a container for products
            shopContainer.className = 'Shop-container'; // Assign a class for styling
            category.products.forEach(product => {
                const shopBox = document.createElement('div'); // Create a box for each product
                shopBox.className = 'Shop-box'; // Assign a class for styling
                // Set the inner HTML of the product box with product details
                shopBox.innerHTML = `
                    <img src="${product.image}" alt="Image of ${product.name}" style="max-width:180px;">
                    <div class="Shop-content">
                        <h3 class="title">${product.name}</h3>
                        <p>${product.description}</p>
                        <label for="${product.id}-quantity">Quantity (Per card):</label>
                        <input type="number" id="${product.id}-quantity" min="0" step="1">
                        <p class="price-display">Price: $${product.price.toFixed(2)}</p>
                        <button class="add-to-cart" data-product="${product.id}">Add to Cart</button>
                    </div>
                `;
                shopContainer.appendChild(shopBox); // Add the product box to the shop container
            });
            section.appendChild(shopContainer); // Add the shop container to the section
            categoriesContainer.appendChild(section); // Add the section to the main container
        });
    }


                                                // 2.Event delegation for dynamically added "Add to Cart" buttons


    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-to-cart')) {
            const button = event.target; // Identify the button clicked
            const shopBox = button.closest('.Shop-box'); // Find the closest shop box
            const title = shopBox.querySelector('.title').textContent; // Get the product title
            const quantityInput = shopBox.querySelector('input[type="number"]'); // Get the quantity input field
            const quantity = parseInt(quantityInput.value); // Convert input value to integer
            const price = parseFloat(shopBox.querySelector('.price-display').textContent.replace('Price: $', '')); // Extract and parse the product price



                                            // 3.Confirming  and validating the quantity before adding to cart


            if (confirm(`Add ${title} to your cart?`)) {
                if (quantity > 0 && quantity <= 10) { // Check if the quantity is within allowed limits
                    addToOrderTable(title, quantity, price); // Add to the order table
                    updateTotal(); // Update the total cost display
                    saveCartData(); // Save the cart data to localStorage
                    alert(`${title} of ${quantity} has been added to your cart.`);
                } else if (quantity > 10) {//This condition is mutually exclusive to the first it only evaluates if the first if condition fails
                    alert("We are sorry, you cannot purchase more than 10 items."); // Alert for max quantity limit
                } else {
                    alert("Please enter a valid quantity."); // Alert for invalid quantity
                }
            }
        }
    });




                                                // 4.Adding item details to the order table


    function addToOrderTable(title, quantity, price) {
        const orderTable = document.querySelector('tbody'); // Select the table body
        const row = orderTable.insertRow(); // Insert a new row
        row.insertCell(0).textContent = title; // Insert product title
        row.insertCell(1).textContent = quantity; // Insert product quantity
        const calculatedPrice = price * quantity; // Calculate total price for the quantity
        row.insertCell(2).textContent = `$${calculatedPrice.toFixed(2)}`; // Display the calculated price
    }

    
                                                    // 5.Calculating and update the total price


    function updateTotal() {
        const totalDisplay = document.getElementById('total-price'); // Select the total price display element
        const prices = document.querySelectorAll('tbody tr td:nth-child(3)'); // Select all price elements from the table
        const total = Array.from(prices, cell => parseFloat(cell.textContent.replace('$', ''))).reduce((acc, price) => acc + price, 0); // Calculate total price from all rows
        totalDisplay.textContent = `$${total.toFixed(2)}`; // Update the display with the new total
    }



                                                         // 6.Save cart data to localStorage


    function saveCartData() {
        const rows = document.querySelectorAll('tbody tr'); // Select all rows in the table
        const orderDetails = Array.from(rows).map(row => ({
            title: row.cells[0].textContent, // Get the title from each row
            quantity: parseInt(row.cells[1].textContent), // Get the quantity from each row
            price: parseFloat(row.cells[2].textContent.replace('$', '')) // Get the price from each row
        }));
        const total = document.getElementById('total-price').textContent; // Get the total price text

        const cartData = { orderDetails, total }; // Create an object with the cart data
        localStorage.setItem('cartData', JSON.stringify(cartData)); // Store the cart data in localStorage as a JSON string
        console.log('Cart data saved:', cartData); // Log the saved data
    }


                                                 //7. Loading cart data from localStorage


    function loadCartData() {
        const storedData = localStorage.getItem('cartData'); // Retrieve the cart data from localStorage
        if (storedData) {
            const { orderDetails, total } = JSON.parse(storedData); // Parse the JSON stored data
            const orderTable = document.querySelector('tbody'); // Select the table body
            orderTable.innerHTML = ''; // Clear the current table contents

            orderDetails.forEach(item => { // For each item in the stored data
                const row = orderTable.insertRow(); // Create a new row
                row.insertCell(0).textContent = item.title; // Add the title
                row.insertCell(1).textContent = item.quantity; // Add the quantity
                row.insertCell(2).textContent = `$${item.price.toFixed(2)}`; // Add the price
            });

            const totalDisplay = document.getElementById('total-price'); // Select the total display element
            if (totalDisplay) {
                totalDisplay.textContent = total; // Update the total display
            }
        }
    }


                             //8. Helping function to retrieve order details from the table


    function getOrderDetails() {
        const rows = document.querySelectorAll('tbody tr'); // Select all rows in the table
        return Array.from(rows, row => ({
            title: row.cells[0].textContent, // Get the title from each row
            quantity: parseInt(row.cells[1].textContent), // Get the quantity from each row
            price: parseFloat(row.cells[2].textContent.replace('$', '')) // Get the price from each row
        }));
    }



                                            // 9.Clear the order table
    function clearOrderTable() {
        document.querySelector('tbody').innerHTML = ''; // Clear the table body
    }



                                     // 10.Resetong the cart and clear localStorage

    document.getElementById('resetCart').addEventListener('click', function () {
        clearOrderTable(); // Clear the table
        updateTotal(); // Update the total display
        localStorage.removeItem('cartData'); // Remove the cart data from localStorage
    });

    
                                        // 11. Saving the current cart as a favourite

    if (addToFavouritesButton) {
        addToFavouritesButton.addEventListener('click', function () {
            const orderDetails = getOrderDetails(); // Get the current order details
            if (orderDetails.length === 0) {
                alert('Your cart is empty. Please add items to save as a favorite.'); // Alert if the cart is empty
                return;
            }
            const total = document.getElementById('total-price').textContent; // Get the total price
            const favouriteCart = { orderDetails, total }; // Create an object for the favourite cart
            localStorage.setItem('favouriteCart', JSON.stringify(favouriteCart)); // Store the favourite cart in localStorage
            alert('Your favorite order has been saved.'); // Alert that the favourite has been saved
        });
    }

                                    // 12. Applying a previously saved favourite to the cart

    if (applyFavouritesButton) {
        applyFavouritesButton.addEventListener('click', function () {
            const storedFavourites = localStorage.getItem('favouriteCart'); // Retrieve the favourite cart from localStorage
            if (!storedFavourites) {
                alert('Oops! No favorite order found. Please save a favorite order first.'); // Alert if no favourite is found
                return;
            }
            const { orderDetails, total } = JSON.parse(storedFavourites); // Parse the stored favourite cart
            if (orderDetails.length === 0) {
                alert('Oops! Your favorite order is empty. Please save a valid order.'); // Alert if the favourite cart is empty
                return;
            }
            clearOrderTable(); // Clear the current cart
            orderDetails.forEach(item => {
                addToOrderTable(item.title, item.quantity, item.price / item.quantity); // Add each item to the cart
            });
            const totalDisplay = document.getElementById('total-price'); // Select the total display element
            totalDisplay.textContent = total; // Update the total display
            alert('Your favorite medicines have been applied to your cart.'); // Alert that the favourite has been applied
        });
    }

    
                                            // 13. Handle "Buy Now" button functionality

    const buyNowButton = document.getElementById('BuyNow'); // Get the "Buy Now" button
    if (buyNowButton) {
        buyNowButton.addEventListener('click', function (event) {
            const tbody = document.querySelector('tbody'); // Select the table body
            if (tbody.children.length === 0) {
                alert('Opps! Your cart is empty. Please add some products before proceeding to checkout.'); // Alert if the cart is empty
                event.preventDefault(); // Prevent the default action
                return;
            }

            // Save cart data and navigate to the cart page
            saveCartData(); // Save the cart data
            console.log('Redirecting to Cart page...'); // Log the redirection
            window.location.href = "8,1CART.html"; // Change the location to the cart page
        });
    } else {
        console.error('Buy Now button not found.'); // Log if the "Buy Now" button is not found
    }
});
