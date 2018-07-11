import React from 'react';
import { Link } from 'react-router';
export const Cart = ({ cart, addToCart, removeFromCart, subTotal, setPackage, packaging}) => (
  <div className="row">
    { cart && cart.length
      ? <div className="col s12">
          <table className="cart">
            <thead>
              <tr>
                  <th data-field="id">№</th>
                  <th data-field="name">Наименование</th>
                  <th></th>
                  <th data-field="price">Цена</th>
                  <th></th>
              </tr>
            </thead>
            <tbody>
              { cart.map((item, index, array) => (
                <tr key={ item.product._id }>
                  <td>{ index + 1}</td>
                  <td>
                    { item.product.name }<br />
                    {/* Осталось: {item.product.stock} шт. */}
                  </td>
                  <td>
                    <input type="number" className="quantity center-align"
                      onChange={(event) => { addToCart(item.product._id, Math.min(event.target.value, item.product.stock)) }}
                      defaultValue={item.quantity} min={1} max={item.product.stock}/>
                  </td>
                  <td>{ item.product.price }</td>
                  <td>
                    <button className="btn-floating waves-effect waves-light red" onClick={() => {removeFromCart(item.product._id)}}>
                      <i className="material-icons">delete</i>
                    </button>
                  </td>
                </tr>
              )) }
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}>
                  <p>❤ весь товар упаковываются в нашу фирменную бумагу и пакеты бесплатно</p>
                  <p>❤ в случае если вам нужно преподнести подарок, укажите кол-во коробок</p>
                  <p>❤ упаковка товара в коробочку стоит 300 тенге</p>
                </td>
              </tr>
              <tr>
                <th colSpan={ 2 } className='right-align'>
                  <p>
                    <input type="checkbox" onChange={(e) => {
                      setPackage(e.target.checked, packaging.quantity)
                    }}
                    checked={ packaging.enabled }
                    id="packaging"
                  />
                    <label htmlFor="packaging">Подарочная упаковка</label>
                  </p>
                </th>
                <th>
                  <input type="number" className="quantity center-align"
                    onChange={(e) => {
                      setPackage(packaging.enabled, e.target.value)
                    }}
                    disabled={ ! packaging.enabled }
                    value={ packaging.quantity }
                    min={ 1 }
                  />
                </th>
                <th>{ packaging.price || null }</th>
                <th></th>
              </tr>
              <tr>
                <th colSpan={ 3 } className='right-align'>Сумма</th>
                <th colSpan={ 2 } className='left-align'>
                  { subTotal + packaging.price }
                </th>
              </tr>
            </tfoot>
          </table>
          <Link to="/order" className="btn waves-effect waves-light btn-order">Заказать <i className="material-icons right">send</i></Link>
        </div>
      : <div className="col s12"><h5>Корзина пуста</h5></div>
    }
  </div>
)
