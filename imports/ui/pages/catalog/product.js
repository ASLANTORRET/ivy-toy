import React from 'react';
import View from '/imports/ui/containers/catalog/view';
import { ToCart } from '/imports/ui/containers/cart';
import { browserHistory } from 'react-router';

export class Product extends React.Component {
  componentDidMount() {
    $('#product-modal').modal({
      dismissible: false
      // complete: function() {
        // browserHistory.goBack()
      // }
    });
    $('#product-modal').modal('open');
    $('.modal-overlay').on('click',(e) => {
      browserHistory.goBack();
    })
  }
  componentWillUnmount() {
    $('#product-modal').modal('close');
    $('.modal-overlay').off('click')
    // $('.modal-overlay').remove();
    // $('body').css({
    //   overflow: '',
    //   width: ''
    // });
  }
  render() {
    const { params, location } = this.props;
    return <div>
      <div id="product-modal" className="modal modal-fullscreen">
        <div className="modal-content">
          <View slug={ params.productSlug } />
        </div>
      </div>
    </div>
  }
}
