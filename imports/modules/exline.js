import React from 'react';
import { ReactiveVar } from 'meteor/reactive-var'
import $ from 'jquery';
import { HTTP } from 'meteor/http'

class Exline extends React.Component {
  constructor (props) {
    super(props);
    this.state = {regions: [], showResults: false};
    this.regionHandler = this.regionHandler.bind(this);
    this.serviceHandler = this.serviceHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  regionHandler (region) {
    this.setState({showResults: false, region, service: null});
    console.log(this.state);
    this.refs.region.value = `${ region.title } (${ region.cached_path })`;
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
  }
  onSubmit() {
    console.log(this.state);
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
    $(this.refs.region).keyup((e) => {
      const title = e.target.value;
      HTTP.get('http://api.exline.systems/public/v1/regions/destination', {params: {title}}, (error, response) => {
        if (error) {
          console.log(error);
        } else {
          $(this.refs.result).empty();
          if(response.data.regions && response.data.regions.length) {
            this.setState({regions: response.data.regions, showResults: true});
          }
        }
      })
    });
  }
  render() {
    const { noCalculations } = this.props;
    return <div className='row'>
      {/* <div className='col s12 input-field'>
        <input ref='city'/>
      </div> */}
      <div className="col s12 input-field">
        <input ref='region' type="text" className="autocomplete" required placeholder="Поиск по регионам" autoComplete="off" />
        { this.state.showResults && this.state.regions && this.state.regions.length
          ? <ul ref="results" className="autocomplete-content dropdown-content" style={{opacity:100, display: 'block'}}>
            { this.state.regions.map(region =>
              <li className='results' key={ region.id }
                onClick={() => { this.regionHandler(region) } }
              >
                { region.title } ({ region.cached_path })
              </li>
            )}
          </ul>
          : null
        }
      </div>
      { ! noCalculations && this.state.region && this.state.calculations
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
      <div className="input-field col s12">
        <textarea className="materialize-textarea validate" name="address" required placeholder="Адрес" onChange={(e) => { this.setState({ address: e.target.value })}}/>
        {/* <label htmlFor="address">Адрес</label> */}
      </div>
      <button type="button" className="btn waves-effect waves-light btn-order" onClick={this.onSubmit}>Далее</button>

    </div>
  }
}

export default Exline;
