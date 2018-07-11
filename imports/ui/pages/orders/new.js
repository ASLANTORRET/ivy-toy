import React from 'react';
import New from '/imports/ui/containers/orders/new';
import { getCart } from '/imports/modules/cart';
import { browserHistory } from 'react-router'

export class OrderNew extends React.Component {
  componentDidMount() {
    document.title = "Заказать";
    const cart = getCart();
    if (!cart.length){
      browserHistory.push('/cart');
    }
  }
  render () {
    // const { params, location } = this.props;
    return <New />
  }
}
