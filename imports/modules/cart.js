import { Products } from '/imports/api/products';
import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import { browserHistory } from 'react-router'


const getQuantity = (quantity) => {
  const result = parseInt(quantity) || 1;
  return result;
}

export const resetCart = () => {
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  Session.set('cart', cart);
}

export const addToCart = (productId, quantity) => {
  const cart = getCart();

  if (productId) {
    const subscriptions = {};
    subscriptions.Product = Meteor.subscribe('product', productId, { onReady() {
      const product = Products.findOne({_id: productId});
      if (product && product.stock) {
        const productIndex = _.findIndex(cart, ['productId', productId]);
        if (productIndex === -1) {
          cart.push({productId, quantity});
        } else {
          cart[productIndex] = {productId, quantity};
        }
        // cart[productId] = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        Session.set('cart', cart);
        Materialize.toast('Товар добавлен в корзину!', 4000);
        // browserHistory.goBack();
      } else {
        Materialize.toast('Извините, такого товара нет на складе!', 4000);
      }
    } });
  } else {
    Materialize.toast('Товар не выбран!', 4000);
  }
}

export const getCart = () => {
  let cart;
  try {
    cart = JSON.parse(localStorage.getItem('cart'));
  } catch (e) {

  }
  if (! cart) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  cart.forEach(item => { item.quantity = getQuantity(item.quantity) });
  Session.set('cart', cart);
  return Session.get('cart');
}

export const removeFromCart = (productId) => {
  const cart = getCart();
  if (productId) {
    const productIndex = _.findIndex(cart, ['productId', productId]);
    // delete cart[productIndex];
    cart.splice(productIndex, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  Session.set('cart', cart);
  Materialize.toast('Товар удалён из корзины!', 4000);
}
