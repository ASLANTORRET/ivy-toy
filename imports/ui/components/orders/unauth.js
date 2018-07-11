import React from 'react';
import $ from 'jquery';
import 'jquery.inputmask';
import { Link } from 'react-router';
import Exline from '/imports/modules/exline';
import Yandex from '/imports/modules/yandex';

export class OrderUnauth extends React.Component {
  constructor(props) {
    super(props)
    this.state = {step: 0};
    this.setExline = this.setExline.bind(this);
    this.setYandex = this.setYandex.bind(this);
    this.setContact = this.setContact.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  setContact() {
    this.setState({showContact: false});
    const phone = this.refs.phone.value
    this.setState({ phone });
    if (this.state.name
      && (this.state.phone || phone)
      && this.state.email
    ) {
      ! this.state.step ? this.setState({step:1}) : null;
    } else {
      Materialize.toast('Заполните все поля', 4000);
    }
  }
  setExline (exline) {
    const { subTotal } = this.props;
    this.setState({exline, yandex: null});
    // console.log(exline);
    this.setState({address: `${exline.region.title} (${exline.region.cached_path}), ${exline.address}`});
    this.setState({step:2});
    this.setState({showDelivery: false});
    if (subTotal >= 20000
      && exline.service.name && exline.service.name === 'standard'
      && (exline.service.price + exline.service.fuel_surplus) <= 5000
    ) {
      this.setState({shipping: 0});
    } else {
      this.setState({shipping: exline.service.price + exline.service.fuel_surplus});
    }
  }
  setYandex (yandex) {
    // console.log(yandex);
    const { subTotal } = this.props;
    this.setState({yandex, exline: null});
    this.setState({address: `${yandex.geocoder}, ${yandex.address}`});
    this.setState({step:2});
    this.setState({showDelivery: false});
    if (subTotal >= 15000 && yandex.zone.shipping <= 500) {
      this.setState({shipping: 0});
    } else {
      this.setState({shipping: yandex.zone.shipping});
    }
  }
  // componentWillUpdate(nextProps, nextState) {
  //   console.log(nextProps);
  // }
  componentDidUpdate() {
    $(".phone").inputmask();
  }
  componentDidMount() {
    $(".phone").inputmask();
  }
  onSubmit(e) {
    $(this.refs.orderButton).hide();
    const order = {};
    order.email = this.state.email;
    order.phone = this.state.phone;
    order.name = this.state.name;
    order.address = this.state.address;
    order.delivery = this.state.delivery;
    order.yandex = this.state.yandex;
    order.exline = this.state.exline;
    // console.log(order);
    //
    // delete order.map;
    // if (order.zone) {
    //   delete order.zone.polygon
    // }
    // if (order.coords) {
    //   order.coords = order.coords.toString();
    // }
    //
    this.props.onSubmit(order);
  }
  render () {
    const { onSubmit, zones, cart, subTotal, packaging } = this.props;
    return <div className="row">
      {/* <h5>Заказать без регистрации</h5> */}
        { this.state.step === 2 && ! this.state.showContact && ! this.state.showDelivery
          ? <h5>Проверьте данные вашего заказа</h5>
          : <h5>Заказать</h5>
        }
      {/* <Link to="/login" className="waves-effect waves-light btn left">Войти</Link> */}
      {/* <Link to="/signup" className="waves-effect waves-light btn right">Создать аккаунт</Link> */}
      <div className="col s12">
      { this.state.step === 0 || this.state.showContact
        ? <div>
            <div className="row">
              <div className="input-field col s6">
                <input id="name" type="text" className="validate" required
                  onChange={(e) => { this.setState({ name: e.target.value })}}
                  defaultValue={this.state.name}
                />
                <label htmlFor="name">Имя</label>
              </div>
              <div className="input-field col s6">
                <input id="phone" ref="phone" type="text" className="validate phone" required
                  data-inputmask="'mask': '+7(999)999-99-99'"
                  onChange={(e) => { this.setState({ phone: e.target.value })}}
                  defaultValue={this.state.phone}
                />
                <label htmlFor="phone">Телефон</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input id="email" type="email" className="validate" required
                  onChange={(e) => { this.setState({ email: e.target.value })}}
                  defaultValue={this.state.email}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <button type="button" className="btn waves-effect waves-light btn-order" onClick={ (e) => { this.setContact() } }>Далее</button>
          </div>
        : <div>
            <div className="row">
              <div className="input-field col s6">
                <input type="text" readOnly defaultValue={this.state.name} />
                {/* <label >Имя</label> */}
              </div>
              <div className="input-field col s6">
                <input type="text" readOnly defaultValue={this.state.phone} />
                {/* <label >Телефон</label> */}
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input type="email" readOnly defaultValue={this.state.email}/>
                {/* <label >Email</label> */}
              </div>
            </div>
            <button type="button" className="btn waves-effect waves-light blue lighten-5" onClick={ () => { this.setState({ showContact: true }) } }>Изменить контактные данные</button>
          </div>
      }
      { this.state.step === 1 || this.state.showDelivery
        ? <div>
            <div className="row margin-bottom-20">
              <div className="input-field col s6">
                <input name="city" type="radio" id="almaty" className="with-gap"
                  onChange={(e) => { this.setState({ city: 'almaty', address:'', exline: null, yandex: null })}} required defaultChecked={this.state.city==='almaty'} />
                <label htmlFor="almaty">Алматы</label>
              </div>
              <div className="input-field col s6">
                <input name="city" type="radio" id="other" className="with-gap"
                  onChange={(e) => { this.setState({ city: 'other', address:'', exline: null, yandex: null })}} required defaultChecked={this.state.city==='other'}/>
                <label htmlFor="other">Другой</label>
              </div>
            </div>
            { this.state.city === 'almaty'
              ? <Yandex zones={ zones } setYandex={ this.setYandex } />
              : null
            }
            { this.state.city === 'other'
              ? <Exline setExline={ this.setExline } />
              : null
            }
          </div>
        : null
      }
      { this.state.step > 1 && ! this.state.showDelivery
        ? <div>
            <div className="input-field">
              <input type="text" readOnly defaultValue={this.state.address}/>
              {/* <label >Адрес</label> */}
            </div>
            <button type="button" className="btn waves-effect waves-light blue lighten-5"
              onClick={ ()=>{ this.setState({ showDelivery: true, delivery: null }) } }>
              Изменить доставку
            </button>
          </div>
        : null
      }

      { this.state.step === 2 && ! this.state.showContact && ! this.state.showDelivery
        ? <div>
            <div className="col s12">
              <table className="cart">
                <thead>
                  <tr>
                      <th data-field="id">№</th>
                      <th data-field="name">Наименование</th>
                      <th></th>
                      <th data-field="price">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  { cart.map((item, index, array) => {
                    return <tr key={ item.product._id }>
                        <td>{ index + 1}</td>
                        <td>{ item.product.name }</td>
                        <td>{ item.quantity } x { item.product.price }</td>
                        <td>
                          { item.quantity * item.product.price }
                        </td>
                      </tr>
                  }) }
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={ 3 }>Сумма</th>
                    <th>{ subTotal }</th>
                  </tr>
                  { packaging && packaging.enabled
                      ? <tr>
                          <th colSpan={ 2 }>
                            Подарочная упаковка
                          </th>
                          <th>{ packaging.quantity }</th>
                          <th>{ packaging.price }</th>
                        </tr>
                      : null
                  }
                  { this.state.shipping || this.state.shipping === 0
                    ? <tr>
                        <th colSpan={ 3 }>
                          Доставка {
                            this.state.delivery ? `(${this.state.delivery})`: null
                          }
                        </th>
                        <th>{ this.state.shipping }</th>
                      </tr>
                    : <tr>
                        <th colSpan={ 3 }>
                          Доставка (индивидуальный расчёт)
                        </th>
                        <th>по километражу</th>
                      </tr>
                  }
                  <tr>
                    <th colSpan={ 3 }>Итого</th>
                    <th>{ subTotal + (this.state.shipping || 0) + (packaging.price || 0) }</th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button className="btn waves-effect waves-light btn-order" ref="orderButton" onClick={this.onSubmit}>Отправить заказ</button>
          </div>
        : null
      }


        {/* <button type="submit" className="btn waves-effect waves-light btn-order">Order</button> */}
      {/* </form> */}
      </div>
    </div>
  }
}
