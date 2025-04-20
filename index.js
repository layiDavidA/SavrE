// --- Data: Restaurant Menus ---
const menuData = {
    mcdonalds: ["Big Mac", "McChicken", "Fries", "McNuggets (10pc)", "Coke", "McFlurry", "Quarter Pounder w/ Cheese", "Cheeseburger", "McDouble", "Filet-O-Fish", "Crispy Chicken Sandwich", "Egg McMuffin", "Sausage McMuffin w/ Egg", "Hash Browns", "Apple Pie"],
    chipotle: ["Burrito Bowl", "Tacos (Steak)", "Quesadilla (Chicken)", "Guacamole", "Chips", "Salad", "Burrito (Chicken)", "Chips & Guacamole", "Chips & Queso Blanco", "Queso Blanco (Side)", "Kid's Build Your Own (Taco)"],
    wendys: ["Baconator", "Dave's Single", "Chili", "Frosty", "Spicy Chicken Sandwich", "Fries"],
    panda_express: ["Orange Chicken", "Beijing Beef", "Broccoli Beef", "Kung Pao Chicken", "Teriyaki Chicken", "Chow Mein (Side)", "Fried Rice (Side)", "Steamed White Rice (Side)", "Cream Cheese Rangoon (3pc)", "Veggie Spring Roll (2pc)", "Chicken Egg Roll (1pc)"]
    // Add more restaurant menus here following the same pattern
    // restaurant_key: ["Item 1", "Item 2", ...]
};

// --- Get DOM Elements ---
const restaurantSelect = document.getElementById('restaurantSelect');
const menuSection = document.getElementById('menuSection');
const itemSelect = document.getElementById('itemSelect');
const addItemBtn = document.getElementById('addItemBtn');
const orderList = document.getElementById('orderList');

// --- Event Listener for Restaurant Selection ---
restaurantSelect.addEventListener('change', function() {
    const selectedRestaurant = this.value; // Get the chosen restaurant key (e.g., 'mcdonalds')

    // Clear previous items from the item dropdown
    itemSelect.innerHTML = '';
    orderList.innerHTML = ''; // Also clear the current order when changing restaurants

    if (selectedRestaurant) {
        // Restaurant is selected
        menuSection.style.display = 'block'; // Show the menu item selection area

        // Get the menu items for the selected restaurant
        const items = menuData[selectedRestaurant] || []; // Use empty array if restaurant not found

        if (items.length > 0) {
            // Add a default "select item" option
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "-- Select an Item --";
            itemSelect.appendChild(defaultOption);

            // Populate the item dropdown with actual menu items
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item; // Use the item name as the value
                option.textContent = item; // Display the item name
                itemSelect.appendChild(option);
            });
            itemSelect.disabled = false; // Ensure item dropdown is enabled
            addItemBtn.disabled = false; // Ensure add button is enabled

        } else {
             // If restaurant exists in dropdown but has no menu items defined
            const noItemOption = document.createElement('option');
            noItemOption.textContent = "-- No items available --";
            itemSelect.appendChild(noItemOption);
            itemSelect.disabled = true; // Disable dropdown
            addItemBtn.disabled = true; // Disable button
        }

    } else {
        // No restaurant selected (the default "-- Select --" option)
        menuSection.style.display = 'none'; // Hide the menu item selection area
        itemSelect.disabled = true;
        addItemBtn.disabled = true;
    }
});

               // --- Event Listener for Adding Item to Order ---
        addItemBtn.addEventListener('click', function() {
            const selectedItemName = itemSelect.value;
            const selectedRestaurant = restaurantSelect.value;

            if (selectedItemName && selectedRestaurant && menuData[selectedRestaurant]) {
                const itemPrice = menuData[selectedRestaurant][selectedItemName];

                // --- Add to Main Order ---
                if (typeof itemPrice === 'number') {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${selectedItemName} - $${formatPrice(itemPrice)}`;
                    orderList.appendChild(listItem);

                    currentTotal += itemPrice;
                    totalPriceSpan.textContent = formatPrice(currentTotal);

                    // --- Add to Ingredient Cost List ---
                    let ingredientCost = "N/A"; // Default cost if not found
                    let ingredients = []; // Default to empty array for ingredients

                    // Check if restaurant and item exist in ingredient cost data
                    if (ingredientCostData[selectedRestaurant] && typeof ingredientCostData[selectedRestaurant][selectedItemName] === 'number') {
                        ingredientCost = ingredientCostData[selectedRestaurant][selectedItemName];
                        currentIngredientTotal += ingredientCost; // Add to ingredient total ONLY if it's a number
                    }

                    // Check if restaurant and item exist in ingredient list data
                    if (ingredientListData[selectedRestaurant] && Array.isArray(ingredientListData[selectedRestaurant][selectedItemName])) {
                        ingredients = ingredientListData[selectedRestaurant][selectedItemName];
                    }

                    // -- Create the Ingredient List Item --
                    const ingredientListItem = document.createElement('li');

                    // Create a header for the item name and its estimated cost
                    const itemHeader = document.createElement('div'); // Use a div for the header
                    const displayIngredientCost = (typeof ingredientCost === 'number') ? `$${formatPrice(ingredientCost)}` : ingredientCost;
                    // Use innerHTML to make the name bold easily
                    itemHeader.innerHTML = `<strong>${selectedItemName}</strong> (Est. Cost: ${displayIngredientCost})`;
                    // Optional styling for the header
                    itemHeader.style.marginBottom = '5px'; // Add space below header
                    itemHeader.style.fontWeight = 'bold'; // Ensure whole header line is bold if desired, or just use the <strong> tag

                    ingredientListItem.appendChild(itemHeader); // Add the header first

                    // Create and append the nested list for the ingredients if available
                    if (ingredients.length > 0) {
                        const ingredientsUL = document.createElement('ul');
                        ingredientsUL.style.marginLeft = '20px';
                        ingredientsUL.style.fontSize = '0.9em';
                        ingredientsUL.style.listStyleType = 'disc';
                        ingredientsUL.style.marginTop = '0px'; // Adjust spacing if needed
                        ingredientsUL.style.marginBottom = '10px'; // Add space after the list

                        ingredients.forEach(ingredient => {
                            const ingredientLI = document.createElement('li');
                            ingredientLI.textContent = ingredient;
                            ingredientLI.style.lineHeight = '1.4'; // Adjust line spacing if needed
                            ingredientsUL.appendChild(ingredientLI);
                        });
                        ingredientListItem.appendChild(ingredientsUL); // Add the nested list after the header
                    } else {
                         // Optionally, add a note if ingredients aren't listed (under the header)
                         const noIngredientsP = document.createElement('p');
                         noIngredientsP.textContent = "Ingredient list not available.";
                         noIngredientsP.style.marginLeft = '20px';
                         noIngredientsP.style.fontSize = '0.9em';
                         noIngredientsP.style.fontStyle = 'italic';
                          noIngredientsP.style.marginTop = '0px';
                         noIngredientsP.style.marginBottom = '10px';
                         ingredientListItem.appendChild(noIngredientsP);
                    }

                    ingredientCostList.appendChild(ingredientListItem); // Add the complete item to the main list

                    // Update ingredient total display
                    ingredientTotalPriceSpan.textContent = formatPrice(currentIngredientTotal);

                    itemSelect.value = ""; // Reset dropdown
                } else {
                     console.error(`Price not found for item: ${selectedItemName} at ${selectedRestaurant}`);
                     alert("Error: Could not find the price for the selected item.");
                }
            } else if (!selectedItemName) {
                alert("Please select an item from the menu first.");
            } else {
                 alert("Please select a valid restaurant first.");
            }
        });

        // --- Data: Estimated Ingredient Lists (SUBJECTIVE!) ---
    const ingredientListData = {
         mcdonalds: {
            "Big Mac": ["Buns", "Beef Patty", "Special Sauce", "Lettuce", "Cheese", "Pickles", "Onion"],
            "McChicken": ["Bun", "Chicken Patty", "Lettuce", "Mayonnaise"],
            "Fries": ["Potatoes", "Vegetable Oil", "Salt"],
            "McNuggets (10pc)": ["Chicken Breast", "Batter/Breading", "Vegetable Oil"],
            "Coke": ["Carbonated Water", "HFCS", "Caramel Color", "Phosphoric Acid", "Natural Flavors", "Caffeine"], // Example breakdown
            "McFlurry": ["Vanilla Soft Serve", "Candy/Cookie Topping"],
            "Quarter Pounder w/ Cheese": ["Bun", "Quarter Pound Beef Patty", "Cheese", "Ketchup", "Mustard", "Pickle Slices", "Onion"],
            "Cheeseburger": ["Bun", "Beef Patty", "Cheese", "Ketchup", "Mustard", "Pickle Slice", "Onion"],
            "McDouble": ["Bun", "Two Beef Patties", "Cheese", "Ketchup", "Mustard", "Pickle Slice", "Onion"],
            "Filet-O-Fish": ["Bun (Steamed)", "Fish Filet Patty", "Tartar Sauce", "Cheese"],
            "Crispy Chicken Sandwich": ["Potato Roll Bun", "Crispy Chicken Fillet", "Crinkle Cut Pickles"],
            "Egg McMuffin": ["English Muffin", "Egg", "Canadian Bacon", "Cheese"],
            "Sausage McMuffin w/ Egg": ["English Muffin", "Egg", "Sausage Patty", "Cheese"],
            "Hash Browns": ["Potatoes", "Vegetable Oil", "Salt"],
            "Apple Pie": ["Crust", "Apple Filling", "Sugar Glaze"]
        },
        chipotle: {
            "Burrito Bowl": ["Rice", "Beans", "Protein (Varies)", "Salsa", "Optional Toppings (Lettuce, Cheese, Sour Cream etc.)"],
            "Tacos (Steak)": ["Tortillas (Soft/Hard)", "Steak", "Salsa", "Optional Toppings"],
            "Quesadilla (Chicken)": ["Flour Tortilla", "Chicken", "Cheese", "Optional Fajita Veggies"],
            "Guacamole": ["Avocado", "Red Onion", "Cilantro", "Jalapeño", "Lime Juice", "Salt"],
            "Chips": ["Corn Tortillas", "Lime Juice", "Salt", "Oil"],
            "Salad": ["Supergreens Lettuce Blend", "Protein (Varies)", "Beans", "Salsa", "Vinaigrette", "Optional Toppings"],
            "Burrito (Chicken)": ["Flour Tortilla", "Chicken", "Rice", "Beans", "Salsa", "Optional Toppings"],
            "Chips & Guacamole": ["Corn Tortillas", "Lime Juice", "Salt", "Oil", "Avocado", "Red Onion", "Cilantro", "Jalapeño"],
            "Chips & Queso Blanco": ["Corn Tortillas", "Lime Juice", "Salt", "Oil", "Milk", "Cheese", "Peppers", "Tomatoes"],
            "Queso Blanco (Side)": ["Milk", "Cheese", "Peppers", "Tomatoes"],
            "Kid's Build Your Own (Taco)": ["Tortillas", "Protein", "Cheese", "Side (Rice/Beans)", "Drink", "Fruit/Chips"]
        },
        wendys: {
            "Baconator": ["Buns", "Two Beef Patties", "Cheese", "Bacon", "Ketchup", "Mayonnaise"],
            "Dave's Single": ["Bun", "Beef Patty", "Cheese", "Lettuce", "Tomato", "Onion", "Pickle", "Ketchup", "Mayonnaise"],
            "Chili": ["Ground Beef", "Kidney Beans", "Pinto Beans", "Tomatoes", "Onions", "Peppers", "Celery", "Chili Seasoning"],
            "Frosty": ["Milk", "Sugar", "Cream", "Cocoa (Chocolate)", "Natural Flavors"],
            "Spicy Chicken Sandwich": ["Bun", "Spicy Chicken Fillet", "Lettuce", "Mayonnaise"],
            "Fries": ["Potatoes", "Vegetable Oil", "Sea Salt"]
        },
        panda_express: {
            "Orange Chicken": ["Chicken", "Batter", "Orange Sauce (Sugar, Vinegar, Soy Sauce, Orange Flavor)", "Oil"],
            "Beijing Beef": ["Beef", "Batter", "Beijing Sauce (Sweet & Tangy)", "Onions", "Bell Peppers", "Oil"],
            "Broccoli Beef": ["Beef", "Broccoli", "Ginger Garlic Sauce", "Soy Sauce"],
            "Kung Pao Chicken": ["Chicken", "Zucchini", "Bell Peppers", "Onions", "Chili Peppers", "Peanuts", "Kung Pao Sauce"],
            "Teriyaki Chicken": ["Chicken Thigh", "Teriyaki Glaze"],
            "Chow Mein (Side)": ["Egg Noodles", "Cabbage", "Celery", "Onions", "Soy Sauce", "Oil"],
            "Fried Rice (Side)": ["Rice", "Egg", "Peas", "Carrots", "Green Onions", "Soy Sauce", "Oil"],
            "Steamed White Rice (Side)": ["Rice", "Water"],
            "Cream Cheese Rangoon (3pc)": ["Wonton Wrapper", "Cream Cheese", "Green Onion"],
            "Veggie Spring Roll (2pc)": ["Wrapper", "Cabbage", "Carrots", "Celery", "Black Mushrooms"],
            "Chicken Egg Roll (1pc)": ["Wrapper", "Chicken", "Cabbage", "Carrots", "Onion"]
        }
    };

// --- Initial State ---
// Ensure the item select and add button are disabled initially
itemSelect.disabled = true;
addItemBtn.disabled = true;