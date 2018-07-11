import React from 'react';
import { HtmlContent } from '/imports/modules/html-content';
import KkbEpay from './_kkbepay'

export const OrderView = ({ order, deliveryDate, exlinetext, kkb, appendix }) => {
  return(
    <div className="order">
      <h5>Заказ {order.id }</h5>
      <div className="flow-text">{ order.exline && exlinetext
        ? <HtmlContent html = {exlinetext.body}/>
        : <p>
            Мы очень рады что вы выбрали нас🌞<br />
            Спасибо большое за заказ 💐. <br />
            { deliveryDate ? `Ваша доставочка будет произведена в ${ deliveryDate } г. в течение дня. Ожидайте 😊. ` : null}<br/>
            Курьер обязательно свяжется 📲с вами перед приездом. <br />
            Для консультации и в случае возникших вопросов❓❓❓, вы можете обратиться к нам по номеру what's app 📱8-707-788-00-45
          </p>
      }</div>

      <KkbEpay kkb={kkb} appendix={appendix} order={order} />

      <table className="order-info">
        <tbody>
          <tr>
            <th>Номер заказа</th>
            <td>{ order.id }</td>
          </tr>
          <tr>
            <th>Дата</th>
            <td>{ moment(order.createdAt).format('YYYY-MM-DD') }</td>
          </tr>
          <tr>
            <th>Имя</th>
            <td>{order.name}</td>
          </tr>
          <tr>
            <th>Телефон</th>
            <td>{order.phone}</td>
          </tr>
          <tr>
            <th>E-mail</th>
            <td>{order.email}</td>
          </tr>
          <tr>
            <th>Доставка</th>
            <td>{
              order.delivery === 'pickup' ? 'Самовывоз' : 'По адресу'
            }</td>
          </tr>
          { order.address
            ? <tr>
                <th>Адрес</th>
                <td>{order.address}</td>
              </tr>
            : null
          }
        </tbody>
      </table>
      <table className="order-products">
        <thead>
          <tr>
              <th data-field="id">#</th>
              <th data-field="name">Наименование</th>
              <th>Количество</th>
              <th data-field="price">Стоимость</th>
          </tr>
        </thead>
        <tbody>
          { order.products.map((product, index, array) => (
            <tr key={ product._id }>
              <td>{ index + 1}</td>
              <td>{ product.name }</td>
              <td>{ product.quantity } x { product.price }</td>
              <td>{ product.quantity * product.price }</td>
            </tr>
          )) }
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={ 3 }>Сумма</th>
            <th>{ order.subTotal }</th>
          </tr>
          { order.packaging && order.packaging.enabled
            ? <tr>
                <th colSpan={ 2 }>
                  Подарочная упаковка
                </th>
                <th>{ order.packaging.quantity }</th>
                <th>{ order.packaging.price }</th>
              </tr>
            : null
          }
          { order.shipping || order.shipping === 0
            ? <tr>
                <th colSpan={ 3 }>
                  Доставка {
                    order.zone ? `(${order.zone.name})`: null
                  }
                </th>
                <th>{ order.shipping }</th>
              </tr>
            : null
          }
          { !order.shipping && order.address && order.shipping !== 0
            ? <tr>
                <th colSpan={ 3 }>
                  Доставка (индивидуальный расчёт)
                </th>
                <th>по километражу</th>
              </tr>
            : null
          }
          <tr>
            <th colSpan={ 3 }>Итого</th>
            <th>{ order.total }</th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
