// Array que almacena todos los productos agregados al carrito
// Cada producto será un objeto con título, precio y cantidad
let cartItems = [];

// Espera a que todo el HTML esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene referencias a elementos HTML que necesitaremos manipular
    const cartButton = document.getElementById('cartButton');         // Botón del carrito en la navegación
    const cartModal = document.getElementById('cartModal');          // Ventana modal del carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');  // Todos los botones de "Agregar al Carrito"

    // Configura qué sucede cuando se hace clic en el ícono del carrito
    cartButton.addEventListener('click', () => {
        updateCartDisplay();                // Actualiza la lista de productos en el carrito
        cartModal.style.display = 'block';  // Hace visible la ventana modal
    });

    // Configura el cierre del modal cuando se hace clic en la X
    document.querySelector('.close').addEventListener('click', () => {
        cartModal.style.display = 'none';   // Oculta la ventana modal
    });

    // Cierra el modal si se hace clic fuera de él
    window.addEventListener('click', event => {
        if(event.target == cartModal) {     // Si el clic fue en el fondo oscuro
            cartModal.style.display = 'none'; // Oculta el modal
        }
    });

    // Agrega funcionalidad a cada botón de "Agregar al Carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Obtiene información del producto desde los atributos del botón
            const title = button.getAttribute('data-title');   // Obtiene el nombre del producto
            const price = parseFloat(button.getAttribute('data-price')); // Obtiene y convierte el precio a número
            addToCart(button, title, price); // Llama a la función para agregar al carrito
        });
    });
});

// Función que agrega un producto al carrito
function addToCart(button, title, price) {
    // Busca si el producto ya existe en el carrito
    const existingItem = cartItems.find(item => item.title === title);
    
    if (existingItem) {
        existingItem.quantity++;    // Si existe, aumenta la cantidad
    } else {
        // Si no existe, agrega el nuevo producto al array
        cartItems.push({ title, price, quantity: 1 });
    }
    
    updateCartDisplay();    // Actualiza la vista del carrito
    updateCartCount();      // Actualiza el número en el ícono del carrito
    
    // Cambia el aspecto del botón para mostrar que se agregó
    button.textContent = 'Agregado';
    button.classList.remove('btn-primary');
    button.classList.add('btn-success');
}

// Función que actualiza el número mostrado en el ícono del carrito
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    // Suma todas las cantidades de productos en el carrito
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    // Muestra el total en el círculo rojo
    cartCountElement.textContent = totalCount;
}

// Función para eliminar un producto del carrito
function removeFromCart(title) {
    // Filtra el array para excluir el producto que se quiere eliminar
    cartItems = cartItems.filter(item => item.title !== title);
    updateCartDisplay();    // Actualiza la vista del carrito
    updateCartCount();      // Actualiza el contador
    resetAddToCartButton(title); // Restaura el botón original
}

// Función para restaurar el botón de "Agregar al Carrito" a su estado inicial
function resetAddToCartButton(title) {
    if (cartItems.length === 0) {
        // Si el carrito está vacío, restaura todos los botones
        const buttons = document.querySelectorAll('.add-to-cart-button');
        buttons.forEach(button => {
            button.textContent = 'Agregar al Carrito';
            button.classList.remove('btn-success');
            button.classList.add('btn-primary');
        });
    } else {
        // Si no, restaura solo el botón del producto eliminado
        const button = document.querySelector(`button[data-title="${title}"]`);
        if (button && !cartItems.some(item => item.title === title)) {
            button.textContent = 'Agregar al Carrito';
            button.classList.remove('btn-success');
            button.classList.add('btn-primary');
        }
    }
}

// Función que actualiza la vista del carrito en el modal
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';  // Limpia el contenido actual del carrito
    let total = 0;  // Variable para calcular el total
    
    // Recorre cada producto en el carrito
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;  // Calcula el subtotal del producto
        total += itemTotal;  // Suma al total general
        
        // Crea un elemento div para mostrar el producto
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        
        // Agrega el HTML para mostrar la información del producto
        cartItemElement.innerHTML = `
            <p>${item.title} --> $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}</p>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decrementQuantity('${item.title}')">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="incrementQuantity('${item.title}')">+</button>
                <button class="remove" onclick="removeFromCart('${item.title}')">Eliminar</button>
            </div>
        `;
        // Agrega el elemento creado al contenedor del carrito
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Actualiza el total mostrado en el carrito
    const cartTotalElement = document.getElementById('cartTotal');
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Función para aumentar la cantidad de un producto
function incrementQuantity(title) {
    const item = cartItems.find(item => item.title === title);
    if (item) {
        item.quantity++;  // Aumenta la cantidad en 1
        updateCartDisplay();
        updateCartCount();
    }
}

// Función para disminuir la cantidad de un producto
function decrementQuantity(title) {
    const item = cartItems.find(item => item.title === title);
    if (item && item.quantity > 1) {  // Solo disminuye si la cantidad es mayor a 1
        item.quantity--;  // Reduce la cantidad en 1
        updateCartDisplay();
        updateCartCount();
    }
}