// Lấy dữ liệu giỏ hàng từ localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsContainer = document.querySelector('.cart-items');

// Hiển thị sản phẩm trong giỏ hàng
function displayCartItems() {
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Topping: ${item.toppings.join(', ') || 'Không'}</p>
                <p>Giá: ${item.price}</p>
                <div class="quantity-control">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
            <button onclick="removeItem('${item.name}')" class="remove-btn">×</button>
        </div>
    `).join('');

    updateTotal();
}

// Cập nhật số lượng sản phẩm
function updateQuantity(productName, change) {
    const itemIndex = cart.findIndex(item => item.name === productName);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity < 1) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(productName) {
    const itemIndex = cart.findIndex(item => item.name === productName);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}

// Tính tổng tiền
function updateTotal() {
    const total = cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/\D/g, ''));
        return sum + (price * item.quantity);
    }, 0);
    document.getElementById('total-amount').textContent = total.toLocaleString('vi-VN') + 'đ';
}

// Hiển thị giỏ hàng khi trang được tải
displayCartItems();