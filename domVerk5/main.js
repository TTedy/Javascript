document.addEventListener("DOMContentLoaded", function () {
  // Get references to the HTML elements
  const itemsList = document.getElementById("items");
  const addButton = document.getElementById("add");
  const removeButton = document.getElementById("remove");

  // reference to the HTML element for total price and count of items
  const totalpricehtml = document.getElementById("totalprice");
  const count = document.getElementById("count");

  const listtotalprice = [];

  // Initialize an array to store the shopping list items
  let shoppingList = {
    items: [], // Initialize as an empty array
    total: 0
  };

  // Function to retrieve items from local storage and initialize shoppingList.items
  function initializeItemsFromLocalStorage() {
    const storedItems = localStorage.getItem("items");
    if (storedItems) {
      shoppingList.items = JSON.parse(storedItems);
      shoppingList.total = shoppingList.items.length;
    }
  }

  // Call the initialization function when the page loads
  initializeItemsFromLocalStorage();
  displayItems();

  // ... rest of your code ...

  // Event listeners for the Add and Remove buttons
  addButton.addEventListener("click", addItem);
  removeButton.addEventListener("click", removeItem);

  // Function to add an item to the shopping list
  function addItem() {
    const newItemText = prompt("Enter the item you want to add:");
    const newItemPrice = parseFloat(prompt("Enter the price of the item you want to add:"));

    if (newItemText && !isNaN(newItemPrice)) {
      // Add the item to the list and the array
      const newItem = { name: newItemText, price: newItemPrice };
      shoppingList.items.push(newItem);
      shoppingList.total++;
      localStorage.setItem("items", JSON.stringify(shoppingList.items)); // Update local storage
      displayItems();
    }
  }

  // Function to remove the last item from the shopping list
  function removeItem() {
    if (shoppingList.total > 0) {
      const newRemoveText = prompt("Enter the item you want to remove:");
      console.log("keyrt hefur verið remove fallið");
      // Find the index of the item in the array
      const index = shoppingList.items.findIndex(item => item.name === newRemoveText);

      if (index !== -1) {
        // Remove the item from the list and the array
        shoppingList.items.splice(index, 1);
        shoppingList.total--;
        localStorage.setItem("items", JSON.stringify(shoppingList.items)); // Update local storage
        displayItems();
      } else {
        alert("Item not found in the list.");
      }
    }
  }

  // Function to calculate the total price
  function totalprice() {
    let listtotal = 0;
    for (let i = 0; i < shoppingList.items.length; i++) {
      listtotal += shoppingList.items[i].price;
    }
    return listtotal;
  }

  // Function to display the items in the shopping list
  function displayItems() {
    itemsList.innerHTML = "";
    for (const item of shoppingList.items) {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name} - $${item.price}`;
      itemsList.appendChild(listItem);
    }

    // Update total price and count of items
    listtotalprice.pop();
    listtotalprice.push(totalprice());
    totalpricehtml.textContent = `$${listtotalprice[0].toFixed(2)}`;
    count.textContent = shoppingList.total;
  }

  // Initial display of items
  displayItems();
});
