export let carts;

loadFromStorage(); 

export function loadFromStorage() {
  carts = JSON.parse(localStorage.getItem("cart"));

  if (!carts) {
    carts = [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1',
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2',
      },
    ];
  }
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  carts.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(carts));
}

export function addToCart(productId) {
  let matchingItem;
  carts.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );
  const quantity = Number(quantitySelector.value);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    carts.push({
      productId,
      quantity,
      deliveryOptionId: '1',
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];
  carts.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  carts = newCart;

  saveToStorage();
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  carts.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = newQuantity;
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  carts.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
