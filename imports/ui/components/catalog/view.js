import React from 'react';
import $ from 'jquery';
import { HtmlContent } from '/imports/modules/html-content';
import { Sizes } from './sizes';
import { wish, unwish, inWishlist } from '/imports/modules/wishlist';
import flyToElement from '/imports/modules/fly';

import { browserHistory } from 'react-router';
export class View extends React.Component {
  componentDidMount() {
    const {product} = this.props;
    const id = `#product${product._id}`;
    // $(document).ready(() => {
    //   $('select').material_select('destroy');
    //   $('select').material_select();
    // });
    $(id+' .js-carousel').carousel({
      fullWidth: true,
      indicators: true
    });
    // $(id+' .carousel-item').each(function() {
    //   $(this).height(Math.ceil($(this).width()*0.75));
    // });
    $(id+' a.left').click(event => {
      event.preventDefault();
      $('.js-carousel').carousel('prev');

    });
    $(id + ' a.right').click(event => {
      event.preventDefault();
      $('.js-carousel').carousel('next');
    });
  }
  componentWillUnmount() {
    const {product} = this.props;
    const id = `#product${product._id}`;
    $(id + ' a.left').off('click');
    $(id + ' a.right').click('click');
  }
  render() {
    const { files, product, addToCart, children } = this.props;
    return <div className="row" id={`product${product._id}`}>
      { product.oldPrice && product.price < product.oldPrice
        ? <div className="ribbon-wrapper">
            <div className="ribbon">
              Скидка
            </div>
          </div>
        : null
      }
      <div className="col s12 m6 flyer">
        { product.fileIds && product.fileIds.length
          ? <div className="carousel-wrap">
              <div className="carousel carousel-slider js-carousel">
                { files.map(file => (
                  // <a className="carousel-item" href="#" key={ file }>
                  //   <img src={ file }/>
                  // </a>
                  <div className="carousel-item" key={ file }>
                    <img src={ file }/>
                  </div>
                ))}
                {/* { product.fileIds.map(fileId => (
                  <a className="carousel-item" href="#" key={ fileId }>
                    <img src={`/cdn/storage/files/${fileId}/original/${fileId}.jpg`}/>
                  </a>
                ))} */}
              </div>
              {/* <div className="arrows"> */}
              { product.fileIds.length > 1
                ? <a href="#" className="left">
                    <i className='material-icons'>keyboard_arrow_left</i>
                  </a>
                : null
              }
              { product.fileIds.length > 1
                ? <a href="#" className="right">
                    <i className='material-icons'>keyboard_arrow_right</i>
                  </a>
                : null
              }
              {/* </div> */}
            </div>
          : <img className="responsive-img" src="http://placehold.it/400x300"/>
        }
        {/* { files.length
          ? <div className="carousel carousel-slider js-carousel">
              { files.map(file => (
                <a className="carousel-item" href="#" key={ file._id }>
                  <img src={file.link} key={file.link}/>
                </a>
              ))}
            </div>
          : <img className="responsive-img" src="http://placehold.it/400x300"/>
        } */}
      </div>
      <div className='col s12 m6'>
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
            } }><img src="/images/heart.png" className="heart"/>{ product.name }</a>
          }

        </h5>
          <h5 className='product-name'>
            { product.oldPrice && product.price < product.oldPrice ? <span><del>{product.oldPrice}</del>&nbsp;</span> : null}
            {product.price} ₸
          </h5>
        { children.length
          ? <Sizes children={ children } addToCart={ addToCart }/>
          : <div className="center-align">
              <button onClick={() => { addToCart(product._id,1)
                browserHistory.goBack();
              } } className='btn'>
                {/* <i className="material-icons">shopping_basket</i> */}
                Добавить в корзинку
              </button>
            </div>
        }
      </div>
      <div className='col s12'>
        <HtmlContent html={product.description}/>
      </div>
    </div>;
  }
}
