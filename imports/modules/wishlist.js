import { Wishlist } from '/imports/api/wishlist';

// import { ValidatedMethod } from 'meteor/mdg:validated-method';
// import _ from 'lodash';

export const wish = (_id) => {
  Wishlist.insert({_id});
}

export const unwish = (_id) => {
  Wishlist.remove({_id});
}

export const inWishlist = (_id) => {
  return Wishlist.findOne({_id});
}
