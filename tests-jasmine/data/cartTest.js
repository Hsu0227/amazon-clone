import {addToCart, carts, loadFromStorage} from '../../data/cart.js';

describe('test suite: addToCart', () => {
    it('adds an existing item to the cart', () => {
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                quantity: 2,
                deliveryOptionId: '1',
            }]);
        });
        loadFromStorage();

        const fakeSelect = document.createElement('select');
        fakeSelect.className = `js-quantity-selector-e43638ce-6aa0-4b85-b27f-e1d07eb678c6`;
        fakeSelect.innerHTML = `<option value="1" selected>1</option>`;
        document.body.appendChild(fakeSelect);

        addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(carts.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(carts[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(carts[0].quantity).toEqual(3);
    });
    
    it('adds a new item to the cart', () => {
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });
        loadFromStorage();
        
        const fakeSelect = document.createElement('select');
        fakeSelect.className = `js-quantity-selector-e43638ce-6aa0-4b85-b27f-e1d07eb678c6`;
        fakeSelect.innerHTML = `<option value="1" selected>1</option>`;
        document.body.appendChild(fakeSelect);

        addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(carts.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(carts[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(carts[0].quantity).toEqual(1);
    });
});