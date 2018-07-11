import React from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';

import { Product } from './product';

export class Latest extends React.Component {
  componentDidUpdate() {
    const {  onSort } = this.props;
    $('select').material_select('destroy');
    $('select').material_select();
    $(findDOMNode(this.refs.sortSelect)).off('change');
    $(findDOMNode(this.refs.sortSelect)).on('change', onSort);
  }
  componentDidMount () {
    const {  onSort } = this.props;
    $('select').material_select();
    $(findDOMNode(this.refs.sortSelect)).on('change', onSort);
  }
  componentWillUnmount () {
    $('select').material_select('destroy');
    $(findDOMNode(this.refs.sortSelect)).off('change');
  }
  render () {
     const { products, addToCart, isCatalog, sorting, sortIndex } = this.props;

    return <div className={ Math.round(Math.random()) ? 'boys' : 'girls' }>
      <div className="row">
        <div className="col s12">
          <div className="row valign-wrapper">
            <div className="col s3 hearts">
              <img src="/images/heart.png" className="heart" />
              <img src="/images/heart.png" className="heart" />
              <img src="/images/heart.png" className="heart" />
            </div>
            <div className="col s6">
              <h4>
                Новинки
              </h4>
            </div>
            <div className="col s3 hearts">
              <img src="/images/heart.png" className="heart" />
              <img src="/images/heart.png" className="heart" />
              <img src="/images/heart.png" className="heart" />
            </div>
          </div>
        </div>
      </div>
      {/* { sorting && products && products.length
        ? <div className="row valign-wrapper">
            <div className="col s5 m8 l9 right-align">
              Сортировать
            </div>
            <div className="col s7 m4 l3">
              <div className="input-field">
                <select selected={ sortIndex } id="sort" ref="sortSelect">
                  {sorting.map((sort, index) => (<option value={ index } key={ index }>{ sort.label }</option>))}
                </select>
              </div>
            </div>
          </div>
        : null
      } */}
      <div className="row">
        { products ? products.map(product => {
          return <Product
            product={ product }
            key={ product._id }
            addToCart={ addToCart }
            path='latest'
          />
        }) : null }
      </div>
    </div>;
  }
}
