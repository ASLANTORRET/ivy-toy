import React from 'react';
import View from '/imports/ui/containers/orders/view';

export const OrderView = ({ params, location }) => {
  document.title = "Заказ";
  return <View _id={params._id}/>;
}
