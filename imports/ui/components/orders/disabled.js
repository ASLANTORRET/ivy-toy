import React from 'react';
import { Link } from 'react-router';

export const OrderDisabled = () => {
  return <div className="row">
    <h5>Заказ невозможен</h5>
    <div className="col s12">
      <p>Извините, в данный момент происходит обновление каталога, и оформление заказа временно отключено.</p>
      <p>Вы сможете оформить заказ немного позже.</p>
      <p>Спасибо за понимание.</p>
      <p>Ваши Мимимишки.</p>
    </div>
  </div>
}
