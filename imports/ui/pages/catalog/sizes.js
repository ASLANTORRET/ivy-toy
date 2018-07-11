import React from 'react';
import SizeList from '/imports/ui/containers/catalog/sizes';
import { browserHistory } from 'react-router';
import $ from 'jquery';

export class Sizes extends React.Component {
  componentDidMount() {
    $('#size-modal').modal({
      complete: function() {
        browserHistory.goBack()
      }
    });
    $('#size-modal').modal('open');
  }
  componentWillUnmount() {
    $('.modal-overlay').remove();
    $('body').css({
      overflow: '',
      width: ''
    });
  }
  render() {
    const { params, location } = this.props;
    const { productSlug } = params;
    return <div>
      <div id="size-modal" className="modal bottom-sheet">
        <div className="modal-content">
          <SizeList slug={ productSlug }/>
        </div>
        {/* <div className="modal-footer">
          <a href="#!" className=" modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
        </div> */}
      </div>
      {/* <div className="modal-overlay" id="materialize-modal-overlay-11"></div> */}
    </div>
  }
}
