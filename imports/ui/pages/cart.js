import React from 'react';
import Index from '/imports/ui/containers/cart';

export const Cart = ({ params, location }) => {
  document.title = "Корзина";
  return <Index />;
}
