import React from 'react';
import { Link } from 'react-router';

export const UserOrders = ({ orders }) => {
  return (
    <div>
      { orders.length
        ? <ul className="collection">
            { orders.map( (order) => {
              return (<li className="collection-item row" key={order._id}>
                <Link to={`/order/${order._id}`}>
                  { moment(order.createdAt).format('YYYY-MM-DD') }
                  ( { order.total } )
                </Link>
              </li>)
            }) }
          </ul>
        : <h5>У вас пока нет заказов</h5>
      }
    </div>
  );
}
