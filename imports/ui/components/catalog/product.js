import React from 'react';
import { Link, browserHistory } from 'react-router';
import { wish, unwish, inWishlist } from '/imports/modules/wishlist';
import flyToElement from '/imports/modules/fly';

export class Product extends React.Component {
  render () {
    const { product, category, addToCart, path } = this.props;

    let weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return (
      <div className="col s6 m4 l3 product">
        <div className="card">
          { product.createdAt && product.createdAt > weekAgo
            ? <div className="ribbon-wrapper" onClick={()=> {browserHistory.push(`/${ path }/${ product.slug }`)}}>
    						<div className="ribbon latest">
    							Новинка
    						</div>
    					</div>
            : null
          }
          { product.oldPrice && product.price < product.oldPrice
            ? <div className="ribbon-wrapper" onClick={()=> {browserHistory.push(`/${ path }/${ product.slug }`)}}>
    						<div className="ribbon">
    							Скидка
    						</div>
    					</div>
            : null
          }
          <div className="card-image">
            <Link to={`/${ path }/${ product.slug }`}>
              { product.fileIds && product.fileIds.length && product.fileUrl
                ? <img src={ product.fileUrl }/>
                : <img src="http://placehold.it/400x300"/>
              }
            </Link>
          </div>
          <div className="card-content">
            <div className="card-title valign-wrapper">
              <Link to={`/${ path }/${ product.slug }`}>
                { product.name }
                { product.color ? ` (${ product.color })` : '' }
              </Link>
            </div>
            <p>
              { inWishlist(product._id)
                ? <a href="#" className="unwish" role="button" onClick={(e) => { e.preventDefault(); unwish(product._id) }}><img src="/images/heart.png" className="heart"/></a>
                : <a href="#" className="wish" role="button" onClick={ (e) => {
                  e.preventDefault();
                  wish(product._id);
                  const flyer = $(e.target).closest('.product').find('.card .card-image img');
                  flyToElement(flyer ,$('#to-wishlist').find('img'));
                } }><img src="/images/heart.png" className="heart"/></a>
               }
            </p>
            <p className="price">
              { product.oldPrice && product.price < product.oldPrice ? <span><del>{product.oldPrice}</del>&nbsp;</span> : null}
              { product.price } ₸
            </p>
          </div>
          <div className="card-action">
            { product.hasSizes
              ? <Link className="btn padding1rem" to={`/${ path }/${ product.slug }/sizes`}>
                  В корзинку
                </Link>
              : <button className="btn padding1rem" onClick={(e) => {
                  addToCart(product._id,1);
                  const flyer = $(e.target).closest('.product').find('.card .card-image img');
                  flyToElement(flyer, $('#to-cart').find('img'));
                } }>
                  В корзинку
                </button>
             }
          </div>
        </div>
      </div>
    )
  }
}
