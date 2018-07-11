import React from 'react';
import $ from 'jquery';
import 'jquery.inputmask';
import { Link } from 'react-router';
import _ from 'lodash';
import Exline from '/imports/modules/exlineauth';
import Yandex from '/imports/modules/yandexauth';

export class OrderAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {step: 1};
    this.setExline = this.setExline.bind(this);
    this.setYandex = this.setYandex.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleSelect (e) {
    const { addresses } = this.props;
    const _id = e.target.value;
    this.setState({addressId: e.target.value})
    const address = _.find(addresses, {_id});
    this.setState({address: address});
    if (address.type === 'yandex') {

      const yandex = {
        coords: address.coords,
        zone: address.zone,
        address: address.address,
        geocoder: address.geocoder
      }
      this.setYandex(yandex);
    }
  }

  setExline (exline) {
    const { subTotal } = this.props;
    this.setState({exline, yandex: null});
    // console.log(exline);
    // this.setState({address: `${exline.region.title} (${exline.region.cached_path}), ${exline.address}`});
    this.setState({step:2});
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
    // this.setState({address: `${yandex.geocoder}, ${yandex.address}`});
    this.setState({step:2});
    if (subTotal >= 15000 && yandex.zone.shipping <= 500) {
      this.setState({shipping: 0});
    } else {
      this.setState({shipping: yandex.zone.shipping});
    }
  }

  onSubmit(e) {
    $(this.refs.orderButton).hide();
    const order = {};
    order.address = this.state.address.address;
    order.delivery = this.state.delivery;
    order.yandex = this.state.yandex;
    order.exline = this.state.exline;
    this.props.onSubmit(order);
  }
  componentDidMount() {
    // $(document).ready(() => {
      $("select").material_select();
      // $(this.refs.address).on('change', this.handleSelect);
      $("#addressId").on('change', this.handleSelect);
    // })
  }
  componentWillUpdate() {
    // $(this.refs.address).off('change');
    $("#addressId").off('change');
    $('select').material_select('destroy');
  }
  componentDidUpdate() {
    // $(document).ready(() => {
      $("select").material_select();
      // $(this.refs.address).on('change', this.handleSelect);
      $("#addressId").on('change', this.handleSelect);
    // })
  }
  componentWillUnmount () {
    // $(this.refs.address).off('change');
    $("#addressId").off('change');
    $('select').material_select('destroy');
  }
  render() {
    const { onSubmit, addresses, subTotal, cart, packaging } = this.props;
    return <div className="row">
      <h5>Заказать</h5>
      <div className="row">
        <div className="input-field col s10">
          <select id="addressId" ref="address">
            <option></option>
            { addresses.map(address => {
              return (
                <option value={address._id} key={address._id}>
                  {address.name} ({address.address})
                </option>
              )
            }) }
          </select>
          <label htmlFor="addressId">Адрес</label>
        </div>
        <div className="input-field col s2">
          <Link to='/profile/address' className="btn-floating waves-effect waves-light red right">
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>
      { this.state.address && this.state.address.type === 'exline'
        ? <Exline region={this.state.address.region} setExline={ this.setExline } address={this.state.address.address} />
        : null
      }
      { this.state.step === 2
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
                    <th>{ subTotal + (this.state.shipping || 0) }</th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button className="btn waves-effect waves-light btn-order" ref="orderButton" onClick={this.onSubmit}>Отправить заказ</button>
          </div>
        : null
      }
    </div>
  }
}
