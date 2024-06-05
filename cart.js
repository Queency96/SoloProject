let basket = JSON.parse(localStorage.getItem('data')) || [];
let label = document.getElementById('label');
let finalCart = document.getElementById('final-cart');

function itemCalculate() {
  let cartItem = document.getElementById('cartItems');
  let count = 0;
  basket.forEach((item) => (count += item.quantity));
  cartItem.textContent = count;
}

itemCalculate();

let generateCart = () => {
  if (basket.length !== 0) {
    return (finalCart.innerHTML = basket
      .map((x) => {
        let { id, quantity } = x;
        let search = data.find((x) => x.id === id) || [];
        let { img, price, name } = search;
        return `
          <div class="cart-item m-2">
            <img width="120" src=${img} alt="" />
            <div class="details">
            
              <div class="title-price-x">
                <h4 class="title-price">
                  <p>${name}</p>
                  <p class="cart-item-price">₦${price}</p>
                </h4> 
              </div>
              <div class="cart-buttons">
                <div class="buttons">
                  <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                  <div id=${id} class="quantity">${quantity}</div>
                  <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center me-2">
                <h3>₦${quantity * price}</h3>
                <i onclick="removeItem(${id})" class="bi bi-trash2-fill" style="color: red"></i>
              </div>
            </div>
          </div>
          `;
      })
      .join(''));
  } else {
    finalCart.innerHTML = '';
    label.innerHTML = `
        <h2>Your cart is empty!</h2>
        <a href="index.html">
            <button class="home-btn">Back to Home</button>
        </a>
        `;
  }
};

// responsible for decreasing the data when user hits the + and - buttons
let decrement = (id) => {
  let selectedItem = id;
  let searchItem = basket.find((x) => x.id === selectedItem);

  // if there is no item in the cart or the value of the item is 0.
  if (searchItem === undefined || searchItem.quantity === 0) return;
  searchItem.quantity -= 1;

  // Update the text content of the DOM element
  document.getElementById(id).textContent = searchItem.quantity;
  // this removes all the items from the cart whose quantity is 0. this happens when we remove all the picks of the chosen item.
  basket = basket.filter((x) => x.quantity !== 0);
  // if in the cart section the user remove all the quantity of the selected item, then it is responsible for removing the element from the cart section.
  generateCart();
  localStorage.setItem('data', JSON.stringify(basket));
  itemCalculate();
  generateTotalBill();
};

// responsible for increasing the data when user hits the + and - buttons
let increment = (id) => {
  let selectedItem = id;
  let searchItem = basket.find((x) => x.id === selectedItem);

  if (searchItem === undefined) {
    basket.push({
      id: selectedItem,
      quantity: 1,
    });
    // we have to update it here. since for the very first addition of an item in the cart the searchItem is going to be undefined and the very last line of the fxn is going to throw an error for the very first click on each item cuz we trying to access .quantity of undefined object. But it works fine if we click the button twice.
    searchItem = basket[basket.length - 1]; // Update searchItem to the newly pushed item
  } else {
    searchItem.quantity += 1;
  }
  // this is to update the value of the item in the card every time the user hits the + button.
  generateCart();
  // Update the text content of the DOM element
  document.getElementById(id).textContent = searchItem.quantity;
  localStorage.setItem('data', JSON.stringify(basket));
  itemCalculate();
  generateTotalBill();
};

let removeItem = (id) => {
  let selected = id;
  basket = basket.filter((x) => x.id !== selected);
  // resetting the local storage with the removed item from the basket.
  localStorage.setItem('data', JSON.stringify(basket));
  // re-rendering the cart.
  generateCart();
  generateTotalBill();
  itemCalculate();
};

let generateTotalBill = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { id, quantity } = x;
        let itemCart = data.find((x) => x.id === id) || [];
        return quantity * itemCart.price;
      })
      .reduce((x, y) => x + y, 0);
    label.innerHTML = `
        <h2 class="mt-3">Total Bill: ₦${amount}</h2>
        <button onclick="checkOut()" class="check-out">CheckOut</button>
        <button onclick="clearCart()" class="clear-cart">Clear Cart</button>
      `;
  } else {
    return;
  }
};

let clearCart = () => {
  basket = [];
  localStorage.setItem('data', JSON.stringify(basket));
  generateCart();
  // set the cart logo no to 0
  itemCalculate();
};

let checkOut = () => {
  alert('checked out!');
  clearCart();
};

generateCart();
generateTotalBill();
