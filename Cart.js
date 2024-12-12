// Listen for the DOMContentLoaded event to ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Function to load cart data from local storage
    function loadCartData() {
        const storedData = localStorage.getItem('cartData'); // Retrieve cart data from local storage
        if (storedData) { // Check if there is any cart data stored
            const { orderDetails, total } = JSON.parse(storedData); // Parse the JSON stored data into an object
            const tbody = document.querySelector('tbody'); // Select the table body where cart items are displayed
            tbody.innerHTML = ''; // Clear any existing rows in the table body

            // Loop through each item in order details and add it to the table
            orderDetails.forEach(item => {
                const row = tbody.insertRow(); // Create a new row for each item
                row.insertCell(0).textContent = item.title; // Set the title in the first cell
                row.insertCell(1).textContent = item.quantity; // Set the quantity in the second cell
                row.insertCell(2).textContent = `$${item.price.toFixed(2)}`; // Set the price in the third cell formatted as currency
            });

            const totalDisplay = document.getElementById('total-price'); // Select the element that displays the total price
            if (totalDisplay) {
                totalDisplay.textContent = total; // Update the total price display
            }
        } else {
            console.warn("No cart data found in localStorage."); // Log a warning if no data is found in local storage
        }
    }

    loadCartData(); // Immediately call loadCartData to populate the cart on page load

    // Handle payment processing
    const payButton = document.querySelector('button[type="pay"]'); // Select the pay button
    if (payButton) { // Check if the pay button is found
        payButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default form submission action

            // Validate required form fields
            const formFields = document.querySelectorAll(
                '#Reservation-Form input[required], #Reservation-Form textarea[required], #Reservation-Form select[required]'
            ); // Select all required fields within the form
            let allFieldsValid = true; // Initialize a flag to track field validity

            // Loop through each field and check for validation
            formFields.forEach(field => {
                console.log(`Validating field: ${field.name}, Value: ${field.value}`); // Log field details for debugging

                if (!field.value.trim()) { // Check if the field is empty or contains only whitespace
                    allFieldsValid = false; // Set the validity flag to false

                    // Highlight invalid fields
                    field.style.border = '2px solid red'; // Set the border color to red for visibility

                    // Check for and manage error messages
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMessage = document.createElement('span'); // Create a new span element for the error message
                        errorMessage.className = 'error-message'; // Set the class for styling
                        errorMessage.textContent = 'This field is required.'; // Set the error message text
                        errorMessage.style.color = 'red'; // Set the text color for visibility
                        errorMessage.style.fontSize = '0.8em'; // Set a smaller font size for the error message
                        field.insertAdjacentElement('afterend', errorMessage); // Insert the error message after the field
                    }
                } else {
                    // Reset styles for valid fields
                    field.style.border = ''; // Remove the red border
                    if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                        field.nextElementSibling.remove(); // Remove any existing error messages
                    }
                }
            });

            const tbody = document.querySelector('tbody'); // Select the table body again
            if (tbody.children.length === 0) { // Check if the cart is empty
                alert('Your cart is empty. Please add some products before proceeding to payment.'); // Alert the user
                return; // Exit the function to prevent further execution
            }

            if (!allFieldsValid) { // Check if all fields are valid
                alert('Please fill in all required fields before proceeding to payment.'); // Alert the user to fill all fields
                return; // Exit the function to prevent further execution
            }

            // Calculate the estimated delivery date
            const deliveryDate = new Date(); // Get the current date
            deliveryDate.setDate(deliveryDate.getDate() + 2); // Add two days to the current date for delivery
            const formattedDate = deliveryDate.toLocaleDateString('en-US', { // Format the delivery date
                weekday: 'long', // Include the day of the week
                month: 'long', // Include the full month name
                day: 'numeric', // Include the day of the month
                year: 'numeric' // Include the year
            });

            // Display a success message with the estimated delivery date
            alert(`Thank you for your purchase! Your order will be delivered by ${formattedDate}.`);

            // Clear cart data after successful payment
            localStorage.removeItem('cartData'); // Remove cart data from local storage
            document.querySelector('tbody').innerHTML = ''; // Clear the table
            document.getElementById('total-price').textContent = '$0.00'; // Reset the total price display
        });
    } else {
        console.error("Pay button not found."); // Log an error if the pay button is not found
    }
});
