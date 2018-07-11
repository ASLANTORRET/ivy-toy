import React from 'react';
import { Link } from 'react-router';

export const To = ({ cart }) => (
  // <div className="to-cart">
    <Link to="/cart" id="to-cart">
      {/* { cart.length || <i className="material-icons left">shopping_cart</i>} */}
      {/* <i className="material-icons">shopping_cart</i> */}
      <img src="/images/basket.png" className="icon"/>
      {cart.length
        ? <span className="cart-count">{ cart.length }</span>
        : null
      }
    </Link>
  // </div>
)
