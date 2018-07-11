import React from 'react';
import { unwish } from '/imports/modules/wishlist';
import { Product } from '/imports/ui/components/catalog/product';
import { Link } from 'react-router';

export class WishlistIndex extends React.Component {
  componentDidUpdate() {
    $('.product').each(function() {
      $(this).find('.card-image').height(Math.ceil($(this).width()*0.75));
    });
  }
  componentDidMount() {
    $('.product').each(function() {
      $(this).find('.card-image').height(Math.ceil($(this).width()*0.75));
    });
  }
  render() {
    const { wishlist } = this.props;
    return (
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
                Избранное
              </h4>
            </div>
            <div className="col s3 hearts">
              <img src="/images/heart.png" className="heart" />
              <img src="/images/heart.png" className="heart" />
              <img src="/images/heart.png" className="heart" />
            </div>
          </div>
        </div>
        { wishlist && wishlist.length ? wishlist.map(obj => {
          const { product } = obj;
          return ( product
            ? <div className="col s6 m4 l3 product" key={product._id}>
                <div className="card">
                  { product.oldPrice && product.price < product.oldPrice
                    ? <div className="ribbon-wrapper" onClick={()=> {browserHistory.push(`/${ path }/${ product.slug }`)}}>
            						<div className="ribbon">
            							Скидка
            						</div>
            					</div>
                    : null
                  }
                  <div className="card-image">
                    {/* <Link to={`/${category.slug}/${product.slug}`}> */}
                    <Link to={`/product/${product.slug}`}>
                      { product.file
                        ? <img src={product.file.link}/>
                        : <img src="http://placehold.it/400x300"/>
                      }
                      {/* <span className="card-title">{ product.name }</span> */}
                    </Link>
                  </div>
                  <div className="card-content">
                    <div className="card-title valign-wrapper">
                      <Link to={ `/product/${ product.slug }` }>
                        { product.name }
                        { product.color ? ` (${ product.color })` : '' }
                      </Link>
                    </div>
                    <p>
                      <a href="#" className="unwish" role="button" onClick={(e)=> { e.preventDefault(); unwish(product._id) }}><img src="/images/heart.png" className="heart"/></a>
                    </p>
                    <p className="price">
                      { product.oldPrice && product.price < product.oldPrice ? <span><del>{product.oldPrice}</del>&nbsp;</span> : null}
                      { product.price } ₸
                    </p>
                  </div>
                  {/* <div className="card-action">
                    <Link className="btn padding1rem" to={ `/product/${ product.slug }` }>
                      Подробнее
                    </Link>
                  </div> */}
                </div>
              </div>
            : null
          )
        }) : <div className="col s12">Пусто</div> }
      </div>
    )
  }
}
