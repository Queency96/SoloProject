let shop = document.getElementById('shop');
// if there is data in localStorage take it else start with an empty array.
let basket = JSON.parse(localStorage.getItem('data')) || [];

// checking it here since we can have data stored in the local storage
itemCalculate();

let generateData = () => {
  return (shop.innerHTML = data
    .map((item) => {
      // if in local storage there is an element with same id then fetch the quantity of the item else initialize with an empty array.
      let searchLocalStorage = basket.find((elem) => elem.id === item.id) || [];
      return `
        <div class="item" id=product-id-${item.id} >
            <img width="212" src=${item.img} alt=${item.name} class="w-100" style="height: 200px">
            <div class="details">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="price-quantity">
                    <h3>₦${item.price}</h3>
                    <div class="buttons">
                        <!--using bootstrap icons for the + and - signs.-->
                        <i onclick="increment(${
                          item.id
                        })" class="bi bi-plus-lg"></i>
                        <div id=${item.id} class="quantity">
                            ${
                              searchLocalStorage.quantity === undefined
                                ? 0
                                : searchLocalStorage.quantity
                            }
                        </div>
                        <i onclick="decrement(${
                          item.id
                        })" class="bi bi-dash-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    })
    .join(''));
};

generateData();

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

  // Update the text content of the DOM element
  document.getElementById(id).textContent = searchItem.quantity;
  localStorage.setItem('data', JSON.stringify(basket));
  itemCalculate(true);
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
  localStorage.setItem('data', JSON.stringify(basket));
  itemCalculate();
};

// not making this an arrow fxn since we are using it in top before the fxn initializations.
// can move this fxn up but to make more clear code leaving it here.
function itemCalculate() {
  let cartItem = document.getElementById('cartItems');
  let count = 0;
  basket.forEach((item) => (count += item.quantity));
  cartItem.textContent = count;
}
