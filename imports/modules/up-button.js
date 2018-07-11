import React from 'react';
import $ from 'jquery';

export default class UpButton extends React.Component {
  checkUp () {
    // console.log(window.pageYOffset);
    const $wrap = $('.js-up-button');
    if(window.pageYOffset > screen.height/4){
      $wrap.show();
    } else {
      $wrap.hide();
    }
    // console.log($wrap);
  }
  componentDidMount(){
    this.checkUp();
    $( window ).on('scroll', () => {
      // console.log('scroll');
  		this.checkUp();
  	});
  }
  // if ( ($(window).height() + 100) < $(document).height() ) {
	//     $('.js-up-button').removeClass('hidden').affix({
	//         // how far to scroll down before link "slides" into view
	//         offset: {top:100}
	//     });
	// }
  render() {
    return (
      <div className="fixed-action-btn js-up-button">
        <a className="btn-floating blue lighten-4" onClick={(e) => { e.preventDefault(); $('html,body').animate({scrollTop:0},'slow'); }}>
          <i className="large material-icons">arrow_upward</i>
        </a>
      </div>
    )
  }
}
