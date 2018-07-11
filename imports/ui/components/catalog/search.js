import React from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { Product } from './product';
// import _ from 'lodash';
let _loadMore;

export class Search extends React.Component {
  // onScroll () {
  //   const { loadMore } = this.props;
  //   if ( $('#js-load-more').length && loadMore ){
  //     const userTop = $(window).scrollTop() + $(window).height();
  //     const loadMoreTop = $('#js-load-more').position().top + $('#js-load-more').height();
  //     if (userTop > loadMoreTop) {
  //       loadMore();
  //     }
  //   }
  // }
  componentDidUpdate() {
    const { onLoaded } = this.props;
    onLoaded ? onLoaded() : null;
  }
  componentDidMount () {
    // Session.set('limit', 12);
    const { onLoaded, onSort } = this.props;
    onLoaded ? onLoaded() : null;
    // window.addEventListener('scroll', this.onScroll.bind(this));
    $('select').material_select();
    $(findDOMNode(this.refs.sortSelect)).on('change', onSort);
  }
  componentWillUnmount () {
    $('select').material_select('destroy');
    Session.set('limit', 12);
    $(findDOMNode(this.refs.sortSelect)).off('change');
    // window.removeEventListener('scroll', this.onScroll.bind(this));
  }
  render () {
     const { search, products, loadMore, addToCart, showLoading, link, isCatalog, sortIndex, sorting } = this.props;

    return <div className={ Math.round(Math.random()) ? 'boys' : 'girls' }>
      <div className="row">
        <div className="col s12">
          <div className="row valign-wrapper">
            <div className="col s1 hearts">
              <img src="/images/heart.png" className="heart" />
              {/* <img src="/images/heart.png" className="heart" /> */}
              {/* <img src="/images/heart.png" className="heart" /> */}
            </div>
            <div className="col s10">
              <h4>
                Результат поиска: { search }
              </h4>
            </div>
            <div className="col s1 hearts">
              <img src="/images/heart.png" className="heart" />
              {/* <img src="/images/heart.png" className="heart" /> */}
              {/* <img src="/images/heart.png" className="heart" /> */}
            </div>
          </div>
        </div>
      </div>
      { sorting && products && products.length
        ? <div className="row valign-wrapper">
            <div className="col s6 m8 l9 right-align">
              Сортировать
            </div>
            <div className="col s6 m4 l3">
              <div className="input-field">
                <select selected={ sortIndex } ref="sortSelect" id="sort">
                  {sorting.map((sort, index) => (<option value={ index } key={ index }>{ sort.label }</option>))}
                </select>
              </div>
            </div>
          </div>
        : null
      }
      <div className="row">
        { products ? products.map(product => {
          return <Product
            product={ product }
            key={ product._id }
            addToCart={ addToCart }
            isCatalog={ isCatalog }
            path={`search/${search}`}
          />
        }) : null }

        {/* { showLoading && loadMore ? <div className="col s12" id="js-load-more">Загрузить ещё!</div> : null } */}
        {/* <button className="col" type="button" onClick={loadMore}>loadMore</button> */}
      </div>
    </div>;
  }
}
