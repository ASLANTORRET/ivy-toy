import React from 'react';
import $ from 'jquery';
import { HTTP } from 'meteor/http'

class Yandex extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      map: null,
    };
    this.initMap = this.initMap.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  initMap() {
    const initCoords = [43.238286,76.945456]
    const map = new ymaps.Map('map', {
      center: initCoords,
      zoom: 10,
    }, {
      restrictMapArea: true
    });
    let placemark;
    const { zones } = this.props;

    // handleCoordinates(initCoords);

    const searchControl = map.controls.get('searchControl');
    searchControl.options.set('strictBounds', true);
    searchControl.options.set('boundedBy', map.getBounds());
    searchControl.events.add('resultshow',(e) => {
      const coords = e.originalEvent.target.getResultsArray()[0].geometry.getCoordinates();
      handleCoordinates(coords);
    });


    zones.reverse().forEach(zone => {
      zone.polygon = new ymaps.Polygon(
        zone.coords, {
          hintContent: `${zone.name} (${zone.shipping})`
        },{
          fillColor: '#6699ff',
          interactivityModel: 'default#transparent',
          strokeWidth: 1,
          opacity: 0.2
        }
      );
      map.geoObjects.add(zone.polygon);
    });

    map.events.add('click', (e) => {
      const coords = e.get('coords')
      map.panTo(coords)
      // this.handleCoordinates(coords);
      handleCoordinates(coords);
    });
    this.setState({ map });

    const handleCoordinates = (coords) => {
      // const { zones } = this.props;
      this.setState({coords});
      if ( ! placemark) {
        initPlacemark(coords);
      }

      if (placemark) {
        placemark.geometry.setCoordinates(coords);
        const geocoder = ymaps.geocode(coords, {strictBounds: true, boundedBy: map.getBounds()});
        geocoder.then(
          (res) => {
            // this.refs.address.value = res.geoObjects.get(0).getAddressLine();
            this.setState({geocoder: res.geoObjects.get(0).getAddressLine()})
          },
          (err) => {
            console.log(err);
          }
        );
        const zone = zones.some(zone => {
          if (zone.polygon && zone.polygon.geometry.contains(coords)) {
            this.setState({zone});
            return zone;
          }
        });
        if(!zone) {
          this.setState({zone: false});
        }
      }
    }
    const initPlacemark = () => {
      placemark = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: initCoords
        },
        properties: {
          iconContent: 'Доставить сюда',
          // hintContent: 'Ну давай уже тащи'
        }
      }, {
          // preset: 'islands#redIcon',
          preset: 'islands#blackStretchyIcon',
          draggable: true,
      });
      placemark.events.add('dragend', (e) =>{
        const coords = e.originalEvent.target.geometry.getCoordinates();
        handleCoordinates(coords);
        // this.handleCoordinates(coords);
      })
      map.geoObjects.add(placemark);
    }
  }
  onSubmit(e) {
    const { geocoder, address, zone, coords } = this.state;
    if (! this.state.coords || ! this.state.geocoder) {
      Materialize.toast('Укажите адрес на карте ', 4000);
    } else if (!address) {
      Materialize.toast('Уточните подъезд и квартиру', 4000);
    } else {
      _zone = Object.assign({}, zone);
      delete _zone.polygon;
      delete _zone.coords;
      delete _zone.coordinates;
      const yandex = {
        coords,
        zone: _zone,
        address,
        geocoder
      }
      this.props.setYandex(yandex);
    }
  }
  componentDidMount() {
    $(this.refs.map).height(Math.min($(this.refs.map).width(), 400));
    ymaps.ready(this.initMap);
  }
  render () {
    return (
      <div className="row">
        <div className="input-field col s12">
          <input type="text" readOnly
            value={
              ( this.state.geocoder
                ? `${ this.state.geocoder }, `
                : ''
              ) + ( this.state.zone
                ? `${this.state.zone.name} (${this.state.zone.shipping}) `
                : '( Расчёт по километражу ) '
              )
            }
          />
        </div>
        <div className="col s12">
          <div id="map" ref="map"></div>
        </div>
        <div className="input-field col s12">
          <textarea id="address" ref="address" className="materialize-textarea validate" required placeholder="Подъезд, квартира" onChange={(e) => { this.setState({ address: e.target.value })}} value={this.state.address || ''} />
        </div>
        <button type="button" className="btn waves-effect waves-light btn-order" onClick={this.onSubmit}>Далее</button>
      </div>
    );
  }
}

export default Yandex;
