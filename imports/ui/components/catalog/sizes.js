import React from 'react';
import { wish, unwish, inWishlist } from '/imports/modules/wishlist';
import flyToElement from '/imports/modules/fly';
import { browserHistory } from 'react-router';

export class Sizes extends React.Component{
  constructor(props) {
    super(props);
    this.state = { productId: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { addToCart } = this.props;
    if (this.state.productId) {
      addToCart(this.state.productId,1);
      browserHistory.goBack();
    } else {
      Materialize.toast('Выберите размер!', 4000);
    }
  }

  handleChange(event) {
    this.setState({productId: event.target.value});
  }

  render () {
    const { product, children, addToCart } = this.props;
    return (
      <div>
        { product
          ? <div>
            { product.oldPrice && product.price < product.oldPrice
              ? <div className="ribbon-wrapper">
      						<div className="ribbon">
      							Скидка
      						</div>
      					</div>
              : null
            }
              <h5 className='product-price'>
                { inWishlist(product._id)
                  // ? <button className="btn unwish" onClick={(e) => { e.preventDefault(); unwish(product._id) }}><img src="/images/heart.png" className="heart"/></button>
                  ? <a href="#" className="unwish" onClick={ (e) => {
                      e.preventDefault();
                      unwish(product._id)
                    } }><img src="/images/heart.png" className="heart"/>
                      { product.name }
                      { product.color ? ` (${ product.color })` : null }
                    </a>
                  // : <button className="btn wish" role="button" onClick={ (e) => {
                  : <a href="#" className="wish" role="button" onClick={ (e) => {
                      e.preventDefault();
                      wish(product._id);
                      const flyer = $('.flyer');
                      flyToElement(flyer, $('#to-wishlist').find('img'))
                    } }><img src="/images/heart.png" className="heart"/>{ product.name }
                      { product.color ? ` (${ product.color })` : null }
                    </a>
                }

              </h5>
              <h5 className='product-name'>
                { product.oldPrice && product.price < product.oldPrice ? <span><del>{product.oldPrice}</del>&nbsp;</span> : null}
                {product.price} ₸
              </h5>
            </div>
          : null
        }
        {/* <h3>{ product.name }</h3> */}
        <form onSubmit={ this.handleSubmit }>
          <ul className='collection'>
            { children.map((child, index, array) => {
              return (
                <li className='collection-item' key={child._id}>
                  <input className="with-gap"
                    // name="productId"
                    type="radio"
                    id={child._id}
                    value={child._id}
                    disabled = { !child.stock }
                    checked = { this.state.productId === child._id }
                    onChange = { this.handleChange }
                  />
                  <label htmlFor={child._id}>{child.size}</label>
                </li>
              )
            }) }
          </ul>
          <div className="center-align">
            <button type="submit" className='btn center'>
              {/* <i className="material-icons">shopping_basket</i> */}
              Добавить в корзинку
            </button>
          </div>
        </form>
      </div>
    );
  }
}
