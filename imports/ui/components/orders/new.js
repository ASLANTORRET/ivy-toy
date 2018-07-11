import React from 'react';
import { OrderDisabled } from './disabled';
import Auth from '/imports/ui/containers/orders/auth';
import Unauth from '/imports/ui/containers/orders/unauth';

export const OrderNew = ({userId, allowOrder}) => {
  if ( allowOrder ) {
    if (userId) {
      return <Auth />
    } else {
      Session.set('afterLogin','/order');
      return <Unauth />
    }
  } else {
    return <OrderDisabled />
  }
}
