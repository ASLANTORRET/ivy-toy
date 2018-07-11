import React from 'react';
import { ReactiveVar } from 'meteor/reactive-var'
import $ from 'jquery';
import { HTTP } from 'meteor/http'

class Exline extends React.Component {
  constructor (props) {
    super(props);
    this.state = {region: props.region, showResults: false, address: props.address};
    this.regionHandler = this.regionHandler.bind(this);
    this.serviceHandler = this.serviceHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  regionHandler (region) {
    this.setState({showResults: false, region, service: null});
    console.log(this.state);
    // this.refs.region.value = `${ region.title } (${ region.cached_path })`;
    HTTP.get('http://api.exline.systems/public/v1/calculate', {params: {origin_id: 4, destination_id: region.id, weight:1}}, (error, response) => {
      // console.log(response.data);
      const { calculations } = response.data;
      this.setState({calculations});
    })
  }
  serviceHandler (e) {

    const service = e.target.value;
    const calculations = this.state.calculations[service];
    calculations.name = service;
    this.setState({service:calculations});
    
    const exline = {
      service: calculations,
      region:this.state.region,
      address:this.state.address
    }
    this.props.setExline(exline);
    // this.onSubmit();
  }
  onSubmit() {
    // console.log(this.state);
    if (this.state.calculations && this.state.address && this.state.region) {
      const exline = {
        service:this.state.service,
        region:this.state.region,
        address:this.state.address
      }
      this.props.setExline(exline);
    } else {
      Materialize.toast('Выберите регион доставки и введите адрес', 4000);
    }
  }
  componentDidMount() {
    this.regionHandler(this.props.region);
  }
  render() {
    const { noCalculations } = this.props;
    return <div className='row'>
      {/* <div className='col s12 input-field'>
        <input ref='city'/>
      </div> */}
      { this.state.region && this.state.calculations
        ? <div className="col s12">
            <div className="row margin-bottom-20">
              { Object.keys(this.state.calculations).map(service => {
                const calculation = this.state.calculations[service]
                if ( calculation ) {
                  return (
                    <div className="input-field col s6" key={ service }>
                      <input type="radio" name="service" id={ service } className="with-gap" required
                        // onChange={ () => { this.serviceHandler(service) } }
                        onChange={ this.serviceHandler }
                        checked={ JSON.stringify(this.state.service) === JSON.stringify(calculation) }
                        value={ service }
                      />
                      <label htmlFor={ service }>{ service }<br />
                        {/* примерный сроки доставки { calculation.human_range }<br /> */}
                        примерная стоимость { calculation.price + calculation.fuel_surplus } KZT
                      </label>
                    </div>
                  )
                } else {
                  return null;
                }
              }) }
            </div>
          </div>
        : null
      }
      {/* <button type="button" className="btn waves-effect waves-light btn-order" onClick={this.onSubmit}>Далее</button> */}

    </div>
  }
}

export default Exline;
