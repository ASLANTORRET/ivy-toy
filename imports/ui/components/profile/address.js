import React from 'react';
import { Link } from 'react-router';

import Exline from '/imports/modules/exline';
import Yandex from '/imports/modules/yandex';

export class Address extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
    this.setExline = this.setExline.bind(this);
    this.setYandex = this.setYandex.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
  }

  setExline (exline) {
    // const { subTotal } = this.props;
    // this.setState({exline: exline});
    // // console.log(exline);
    // this.setState({address: `${exline.region.title} (${exline.region.cached_path}), ${exline.address}`});
    // console.log(exline);
    // console.log(this.state);
    exline.address = `${exline.region.title} (${exline.region.cached_path}), ${exline.address}`;
    exline.type = 'exline';
    delete exline.service;
    delete exline.calculations;
    delete exline.showResults;
    delete exline.regions;
    this.props.onSubmit(exline);
  }
  setYandex (yandex) {
    // console.log(yandex);
    // const { subTotal } = this.props;
    // this.setState({yandex: yandex});
    // this.setState({address: `${yandex.geocoder}, ${yandex.address}`});
    // console.log(yandex);
    // console.log(this.state);
    yandex.address = `${yandex.geocoder}, ${yandex.address}`;
    yandex.type = 'yandex';
    this.props.onSubmit(yandex);
  }
  // onSubmit(e) {
  //   const address = {};
  //   address.address = this.state.address;
  //   address.delivery = this.state.delivery;
  //   address.yandex = this.state.yandex;
  //   address.exline = this.state.exline;
  //   this.props.onSubmit(address);
  // }
  render() {
    const { zones } = this.props;
    return (
      <div>
        <h5>Добавление адреса</h5>
        <div className="row margin-bottom-20">
          <div className="input-field col s6">
            <input name="city" type="radio" id="almaty" className="with-gap"
              onChange={(e) => { this.setState({ city: 'almaty', address:'', exline: null, yandex: null })}} required defaultChecked={this.state.city==='almaty'} />
            <label htmlFor="almaty">Алматы</label>
          </div>
          <div className="input-field col s6">
            <input name="city" type="radio" id="other" className="with-gap"
              onChange={(e) => { this.setState({ city: 'other', address:'', exline: null, yandex: null })}} required defaultChecked={this.state.city==='other'} />
            <label htmlFor="other">Другой</label>
          </div>
        </div>
        { this.state.city === 'almaty'
          ? <Yandex zones={ zones } setYandex={ this.setYandex } />
          : null
        }
        { this.state.city === 'other'
          ? <Exline setExline={ this.setExline } noCalculations={ true }/>
          : null
        }
      </div>
    );
  }
};
