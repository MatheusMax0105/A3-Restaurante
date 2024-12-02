// Funções para adicionar, editar e remover produtos
async function addProduct() {
  const name = document.querySelector("#productName").value;
  const description = document.querySelector("#productDescription").value;
  const price = parseFloat(document.querySelector("#productPrice").value);
  const category = document.querySelector("#productCategory").value;
  const quantity = parseInt(document.querySelector("#productQuantity").value);

  const response = await fetch("http://localhost:8080/produtos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome: name, descricao: description, preco: price, categoria: category, quantidade: quantity }),
  });

  const data = await response.json();
  loadProducts();
  hideAddProductForm();
}

async function editProduct(id) {
  const name = prompt("Novo nome do produto:");
  const description = prompt("Nova descrição do produto:");
  const price = parseFloat(prompt("Novo preço do produto:"));
  const category = prompt("Nova categoria do produto:");
  const quantity = parseInt(prompt("Nova quantidade do produto:"));

  const response = await fetch(`http://localhost:8080/produtos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome: name, descricao: description, preco: price, categoria: category, quantidade: quantity }),
  });

  const data = await response.json();
  loadProducts();
}

async function removeProduct(id) {
  const response = await fetch(`http://localhost:8080/produtos/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  loadProducts();
}

// Funções para adicionar, editar e remover reservas
async function addReservation() {
  const clientName = document.querySelector("#reservationClientName").value;
  const clientPhone = document.querySelector("#reservationClientPhone").value;
  const tableId = parseInt(document.querySelector("#reservationTableId").value);
  const date = document.querySelector("#reservationDate").value;

  const response = await fetch("http://localhost:8080/reservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cliente_nome: clientName, cliente_telefone: clientPhone, mesa_id: tableId, data_reserva: date }),
  });

  const data = await response.json();
  loadReservations();
  hideAddReservationForm();
}

async function editReservation(id) {
  const clientName = prompt("Novo nome do cliente:");
  const clientPhone = prompt("Novo telefone do cliente:");
  const tableId = parseInt(prompt("Nova mesa:"));
  const date = prompt("Nova data da reserva:");

  const response = await fetch(`http://localhost:8080/reservas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cliente_nome: clientName, cliente_telefone: clientPhone, mesa_id: tableId, data_reserva: date }),
  });

  const data = await response.json();
  loadReservations();
}

async function removeReservation(id) {
  const response = await fetch(`http://localhost:8080/reservas/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  loadReservations();
}

// Funções para adicionar, editar e remover pedidos
async function addOrder() {
  const tableId = document.querySelector("#orderTableId").value;
  const status = document.querySelector("#orderStatus").value;
  const products = [];  // Preencher com os produtos selecionados

  const response = await fetch("http://localhost:8080/pedidos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mesa_id: tableId, status: status, produtos: products }),
  });

  const data = await response.json();
  loadOrders();
}

async function editOrder(id) {
  const status = prompt("Novo status do pedido:");

  const response = await fetch(`http://localhost:8080/pedidos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: status }),
  });

  const data = await response.json();
  loadOrders();
}

async function removeOrder(id) {
  const response = await fetch(`http://localhost:8080/pedidos/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  loadOrders();
}

window.onload = function() {
  loadProducts();  // Carregar produtos
  loadReservations();  // Carregar reservas
  loadOrders();  // Carregar pedidos
}

