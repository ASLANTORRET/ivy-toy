import React from 'react';
import Navigation from '/imports/ui/containers/navigation';
import Footer from '/imports/ui/containers/footer';
import UpButton from '/imports/modules/up-button';
import '/imports/ui/layouts/fonts.css';
import 'materialize-css/dist/js/materialize';

import 'materialize-css/dist/css/materialize.css';

import '/imports/ui/layouts/style.less';
export class App extends React.Component {
  // propTypes: {
  //   children: React.PropTypes.element.isRequired,
  // }
  componentDidUpdate() {
    $('#nav-mobile').sideNav('hide')
  }
  render() {
    return <div>
      <Navigation />
      <div className="container">{ this.props.children }</div>
      <Footer />
      <UpButton />
    </div>
  }
}
