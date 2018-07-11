import React from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { Product } from './product';

export class Category extends React.Component {
  onScroll () {
    const { loadMore } = this.props;
    if ( $('#js-load-more').length && loadMore ){
      const userTop = $(window).scrollTop() + $(window).height();
      const loadMoreTop = $('#js-load-more').position().top + $('#js-load-more').height();
      if (userTop > loadMoreTop) {
        loadMore();
      }
    }
  }
  componentDidUpdate() {
    const { onLoaded, onSort } = this.props;
    onLoaded ? onLoaded() : null;
    $('select').material_select('destroy');
    $('select').material_select();
    $(findDOMNode(this.refs.sortSelect)).off('change');
    $(findDOMNode(this.refs.sortSelect)).on('change', onSort);
  }
  componentDidMount () {
    // Session.set('limit', 12);
    const { onLoaded, onSort } = this.props;
    onLoaded ? onLoaded() : null;
    window.addEventListener('scroll', this.onScroll.bind(this));
    $('select').material_select();
    $(findDOMNode(this.refs.sortSelect)).on('change', onSort);
  }
  componentWillUnmount () {
    $('select').material_select('destroy');
    Session.set('limit', 12);
    $(findDOMNode(this.refs.sortSelect)).off('change');
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }
  render () {
    const { products,
      category,
      loadMore,
      addToCart,
      showLoading,
      link,
      isCatalog,
      sorting,
      sortIndex,
      children,
      showChildren,
      toggleChildren,
      isChild
    } = this.props;
    let { path } = this.props;
    path = path || (isCatalog ? 'catalog' : category.slug)
    if (children && children.length && category.hasChildren && showChildren) {
      return <div>
        <div className="row">
          <div className="col s12">
            <div className="row valign-wrapper">
              {/* <div className="col s3 hearts">
                <img src="/images/heart.png" className="heart" />
                <img src="/images/heart.png" className="heart" />
                <img src="/images/heart.png" className="heart" />
              </div> */}
              <div className="col s9">
                <h3>
                  { category.name }
                </h3>
              </div>
              <div className="col s3">
                <p><a className="regular" onClick={() => { toggleChildren(false) }}>
                  Все товары
                </a></p>
                <p>
                  Категории
                </p>
              </div>
              {/* <div className="col s3 hearts">
                <img src="/images/heart.png" className="heart" />
                <img src="/images/heart.png" className="heart" />
                <img src="/images/heart.png" className="heart" />
              </div> */}
            </div>
          </div>
        </div>
        <div>
          { children.map(child =>
            <Category category={ child }
              products={ child.products }
              addToCart={ addToCart }
              key={ child._id }
              link={ `/${ child.slug }` }
              path={category.slug}
              isChild={true}
            /> )
          }
        </div>
      </div>
    } else {
      return <div className={category.colorStyle || (Math.round(Math.random()) ? 'boys' : 'girls')}>
        <div className="row">
          <div className="col s12">
            { (children && children.length && category.hasChildren)
              ? <div className="row valign-wrapper">
                  <div className="col s3 hearts">
                    <img src="/images/heart.png" className="heart" />
                    <img src="/images/heart.png" className="heart" />
                    <img src="/images/heart.png" className="heart" />
                  </div>
                  <div className="col s6">
                    <h4>
                      { link ? <Link to={ link }>{ category.name }</Link>  : category.name }
                    </h4>
                  </div>
                  <div className="col s3">
                    <p>
                      Все товары
                    </p>
                    <p>
                      <a className="regular" onClick={() => { toggleChildren(true) }}>Категории</a>
                    </p>
                  </div>
                </div>
              : <div className="row valign-wrapper">
                  <div className="col s3 hearts">
                    <img src="/images/heart.png" className="heart" />
                    <img src="/images/heart.png" className="heart" />
                    <img src="/images/heart.png" className="heart" />
                  </div>
                  <div className="col s6">
                    <h4>
                      { link ? <Link to={ link }>{ category.name }</Link>  : category.name }
                    </h4>
                  </div>
                  <div className="col s3 hearts">
                    <img src="/images/heart.png" className="heart" />
                    <img src="/images/heart.png" className="heart" />
                    <img src="/images/heart.png" className="heart" />
                  </div>
                </div>
            }
          </div>
        </div>
        { sorting && products && products.length
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
        }
        <div className="row">
          { products ? products.map(product => {
            return <Product
              product={ product }
              category={ category }
              key={ category._id + product._id }
              addToCart={ addToCart }
              path={path}
            />
          }) : null }
          { link && isChild
            ? <div className="col s12"><Link className="right btn" to={ link }>Смотреть ещё</Link></div>
            : null}
          { showLoading && loadMore ? <div className="col s12" id="js-load-more">Загрузить ещё!</div> : null }
        </div>
      </div>;
    }
  }
}
