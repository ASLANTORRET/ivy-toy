import React from 'react';
import WishlistContainer from '/imports/ui/containers/wishlist';

export const Wishlist = () => {
  document.title = "Избранное";
  return <WishlistContainer />
}
