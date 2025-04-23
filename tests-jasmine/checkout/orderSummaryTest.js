import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import {loadFromStorage, carts} from '../../data/cart.js';

describe("test suite: renderOrderSummary", () => {
    const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
    const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

    beforeEach(() => {
        spyOn(localStorage, 'setItem');

        document.querySelector('.js-test-container').innerHTML = `
            <div class="js-order-summary"></div>
            <span class="js-return-to-home-link"></span>
            <div class="js-payment-summary"></div>
        `;

        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([
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
            ]);
        });
        
        loadFromStorage();
        renderOrderSummary();
    });

    afterEach(() => {
        document.querySelector('.js-test-container').innerHTML = ``;
    });

    it('displays the cart', () => {
        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(2);
        expect(
            document.querySelector(`.js-product-quantity-${productId1}`).innerText
        ).toContain('Quantity: 2');
        expect(
            document.querySelector(`.js-product-quantity-${productId2}`).innerText
        ).toContain('Quantity: 1');
    });

    it('remove a product', () => {
        document.querySelector(`.js-delete-link-${productId1}`).click();
        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(1);
        expect(
            document.querySelector(`.js-cart-item-container-${productId1}`)
        ).toEqual(null);
        expect(
            document.querySelector(`.js-cart-item-container-${productId2}`)
        ).not.toEqual(null);

        expect(carts.length).toEqual(1);
        expect(carts[0].productId).toEqual(productId2);
    });
});