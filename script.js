const form = document.getElementById("productForm");
const inventoryTable = document.querySelector("#inventoryTable tbody");
const totalValueEl = document.getElementById("totalValue");

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

function updateLocalStorage() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

function calculateTotalValue() {
  const total = inventory.reduce((sum, item) => sum + item.quantity * item.price, 0);
  totalValueEl.textContent = total.toFixed(2);
}

function renderTable() {
  inventoryTable.innerHTML = "";
  inventory.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>${(item.quantity * item.price).toFixed(2)}</td>
      <td class="actions">
        <button class="edit" onclick="editItem(${index})">Edit</button>
        <button class="delete" onclick="deleteItem(${index})">Delete</button>
      </td>
    `;
    inventoryTable.appendChild(row);
  });
  calculateTotalValue();
}

function addProduct(name, quantity, price) {
  inventory.push({ name, quantity, price });
  updateLocalStorage();
  renderTable();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("productName").value.trim();
  const quantity = parseInt(document.getElementById("productQuantity").value);
  const price = parseFloat(document.getElementById("productPrice").value);

  if (!name || quantity <= 0 || price < 0) return alert("Please enter valid details!");

  addProduct(name, quantity, price);
  form.reset();
});

function deleteItem(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    inventory.splice(index, 1);
    updateLocalStorage();
    renderTable();
  }
}

function editItem(index) {
  const item = inventory[index];
  const newName = prompt("Edit product name:", item.name);
  const newQty = prompt("Edit quantity:", item.quantity);
  const newPrice = prompt("Edit price:", item.price);

  if (newName && newQty > 0 && newPrice >= 0) {
    inventory[index] = { name: newName, quantity: parseInt(newQty), price: parseFloat(newPrice) };
    updateLocalStorage();
    renderTable();
  } else {
    alert("Invalid input!");
  }
}

// Initial render
renderTable();
