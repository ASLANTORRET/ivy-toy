import React from 'react';
import { Link } from 'react-router';
import { ToCart } from '/imports/ui/containers/cart';
export const Footer = () => {
  return (
    <footer className="page-footer fixed">
      <nav className="bottom">
        <div className="nav-wrapper">
          <ul id="nav-mobile" className="center">
            <li><Link to="/">
              <img src="/images/home.png" className="icon"/>
            </Link></li>
            <li><Link to="/catalog">
              <img src="/images/search.png" className="icon"/>
            </Link></li>
            <li><Link to="/wishlist" id="to-wishlist">
              <img src="/images/favorite.png" className="icon"/>
            </Link></li>
            <li><Link to="/profile">
              <img src="/images/user.png" className="icon"/>
            </Link></li>
            <li><ToCart/></li>
          </ul>
        </div>
      </nav>
      {/* <div className="row">
        <div className="col s25">
          <Link to="/">
            <i className="material-icons">home</i>
          </Link>
        </div>
        <div className="col s25">
          <Link to="/catalog">
            <i className="material-icons">home</i>
          </Link>
        </div>
        <div className="col s25">
          <Link to="/wishlist">
            <i className="material-icons">star</i>
          </Link>
        </div>
        <div className="col s25">
          <Link to="/profile">
            <i className="material-icons">account_box</i>
          </Link>
        </div>
        <div className="col s3"><ToCart/></div>
      </div> */}
    </footer>
  )
}
