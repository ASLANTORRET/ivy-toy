import React from 'react';
import DiscountProducts from '/imports/ui/containers/catalog/discount.js';

export const Discount = ({ params, location, children }) => {
  document.title = "Акции";

  return <div>
    <DiscountProducts />

    { children || null }
  </div>
}
