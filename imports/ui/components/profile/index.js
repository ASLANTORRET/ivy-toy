import React from 'react';
import { Link } from 'react-router';

export const Index = () => {
  return <div>
    <ul className="collection">
      {/* <li className="collection-item"><Link to="/profile/edit">Редактировать профайл</Link></li> */}
      <li className="collection-item"><Link to="/profile/addresses">Мои адреса</Link></li>
      <li className="collection-item"><Link to="/profile/orders">Мои заказы</Link></li>
    </ul>
  </div>;
}
