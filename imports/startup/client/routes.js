import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/layouts/app';
import { Index } from '/imports/ui/pages/index';
import { NotFound } from '/imports/ui/pages/not-found';
import About from '/imports/ui/pages/about';

import { Login } from '/imports/ui/pages/login';
import { RecoverPassword } from '/imports/ui/pages/recover-password';
import { ResetPassword } from '/imports/ui/pages/reset-password';
import { Signup } from '/imports/ui/pages/signup';

import { Catalog } from '/imports/ui/pages/catalog';
import { SearchResult } from '/imports/ui/pages/catalog/search';
import { Latest } from '/imports/ui/pages/catalog/latest';
import { Discount } from '/imports/ui/pages/catalog/discount.js';
import { Category } from '/imports/ui/pages/catalog/category';
import { Product } from '/imports/ui/pages/catalog/product';
import { Sizes } from '/imports/ui/pages/catalog/sizes';
import { Cart } from '/imports/ui/pages/cart';
import { OrderNew } from '/imports/ui/pages/orders/new';
import { OrderView } from '/imports/ui/pages/orders/view';

import { Wishlist } from '/imports/ui/pages/wishlist';
import { Profile } from '/imports/ui/pages/profile';
import { ProfileEdit } from '/imports/ui/pages/profile/edit';
import { UserAddresses } from '/imports/ui/pages/profile/useraddresses';
import { UserAddress } from '/imports/ui/pages/profile/useraddress';
import { UserOrders } from '/imports/ui/pages/profile/orders';
// import { UserAddressEdit } from '/imports/ui/pages/profile/useraddressedit';

// const allowedOrder = ({ nextState, replace, next }) => {
//   Tracker.autorun(() => {
//     if (Meteor.subscribe('setting','allowOrder').ready()) {
//       store.dispatch(fetchPosts('success', Posts.find().fetch()));
//     }
//   });
//   next();
// };

const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

const requireAuthOnChange = ( prevState, nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

const checkLogin = (nextState, replace) => {
  if (Meteor.loggingIn() && Meteor.userId()) {
    replace({
      pathname: '/',
    });
  }
};

const verifyEmail = ( props ) => {
  Accounts.verifyEmail( props.params.token, ( error, result ) =>{
    if ( error ) {
      Materialize.toast( error.reason, 4000 );
    } else {
      Materialize.toast( 'Email verified! Thanks!', 4000 );
    }
    browserHistory.push( '/' );
  });
}

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index } />

        <Route path="/login" component={ Login } onEnter={ checkLogin }/>
        <Route path="/recover-password" component={ RecoverPassword } onEnter={ checkLogin } />
        <Route path="/reset-password/:token" component={ ResetPassword } onEnter={ checkLogin } />
        <Route path="/signup" component={ Signup } onEnter={ checkLogin } />
        <Route path="/verify-email/:token" component={ Index } onEnter={ verifyEmail } />

        <Route path="/profile" component={ Profile } onEnter={ requireAuth } onChange={ requireAuthOnChange } >
          <Route path="/profile/edit" component={ ProfileEdit }/>
          <Route path="/profile/addresses" component={ UserAddresses }>
            <Route path="/profile/address" component={ UserAddress }/>
          </Route>
          <Route path="/profile/orders" component={ UserOrders }/>
        </Route>

        <Route path="/about" component={ About } />
        <Route path="/cart" component={ Cart } />
        <Route path="/order" component={ OrderNew }
          // onEnter={ (nextState, replace, next) => { allowedOrder({nextState, replace}) } }
          // onChange={ (prevState, nextState, replace, next) =>{ allowedOrder({nextState, replace}) } }
        />
        <Route path="/order/:_id" component={ OrderView } />
        <Route path="/wishlist" component={ Wishlist } />
        <Route path="/search/:search" component={ SearchResult }>
          <Route path="/search/:search/:productSlug" component={ Product } modal={true}/>
          <Route path="/search/:search/:productSlug/sizes" component={ Sizes } />
        </Route>
        <Route path="/product/:productSlug" component={ Product } />
        <Route path="/catalog" component={ Catalog } >
          <Route path="/catalog/:productSlug" component={ Product } />
          <Route path="/catalog/:productSlug/sizes" component={ Sizes } />
        </Route>
        <Route path="/latest" component={ Latest } >
          <Route path="/latest/:productSlug" component={ Product } modal={true}/>
          <Route path="/latest/:productSlug/sizes" component={ Sizes } />
        </Route>
        <Route path="/discount" component={ Discount } >
          <Route path="/discount/:productSlug" component={ Product } modal={true}/>
          <Route path="/discount/:productSlug/sizes" component={ Sizes } />
        </Route>
        <Route path="/404" component={ NotFound } />
        <Route path="/:categorySlug" component={ Category }>
          <Route path="/:categorySlug/:productSlug" component={ Product } />
          <Route path="/:categorySlug/:productSlug/sizes" component={ Sizes } />
        </Route>
        <Route path="*" component={ NotFound } />
      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});
