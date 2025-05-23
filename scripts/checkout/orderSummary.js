import {
  carts,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  carts.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliverOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliverOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
    <div class="cart-item-container 
      js-cart-item-container
      js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">Delivery date: ${dateString}</div>

      <div class="cart-item-details-grid">
        <img
          class="product-image"
          src="${matchingProduct.image}"
        />

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
          ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity
            js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${
                matchingProduct.id
              }">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link"
            data-product-id = ${matchingProduct.id}>
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-link"
            data-product-id = ${matchingProduct.id}>
              Save
            </span>
            <span class="delete-quantity-link 
              link-primary 
              js-delete-link 
              js-delete-link-${matchingProduct.id}" 
              data-product-id = ${
              matchingProduct.id
              }>
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
          Choose a delivery option:
          </div>
          ${deliveryOptionHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
  });

  function deliveryOptionHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryoption) => {
      
      const dateString = calculateDeliveryDate(deliveryoption);

      const priceString = deliveryoption.priceCents === 0
        ? 'FREE Shipping'
        : `$${formatCurrency(deliveryoption.priceCents)} - Shipping`;

      const isChecked = deliveryoption.id === cartItem.deliveryOptionId;

      html +=`
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryoption.id}">
        <input
          type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
        />
        <div>
          <div class="delivery-option-date">
          ${dateString}
          </div>
          <div class="delivery-option-price">
          ${priceString} 
          </div>
        </div>
      </div>
      `
    })
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      container.remove();
      renderPaymentSummary();
      updateCartQuantity();
    });
  });

  function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();

    if(cartQuantity === 0) {
      document.querySelector(".js-return-to-home-link").innerHTML = 0;
    } else if (cartQuantity === 1) {
      document.querySelector(".js-return-to-home-link").innerHTML = `${1} item`;
    } else {
      document.querySelector(".js-return-to-home-link").innerHTML = `${cartQuantity} items`;
    }
  }
  updateCartQuantity();

  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;

      //get the new quantity by user input
      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(quantityInput.value);
      if (newQuantity < 0 || newQuantity >= 1000) {
        alert("Quantity must be at least 0 and less than 1000");
        return;
      }
      updateQuantity(productId, newQuantity);

      //check if the number out of range first
      //if not out of range then can successful save it
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");

      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      })
  });
}
