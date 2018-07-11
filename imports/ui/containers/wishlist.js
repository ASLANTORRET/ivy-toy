import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading.js';
import { Products } from '/imports/api/products';
import { addToCart } from '/imports/modules/cart';
import { Files } from '/imports/api/files';
import { Wishlist } from '/imports/api/wishlist';
import { WishlistIndex } from '/imports/ui/components/wishlist';

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  const wishlist = Wishlist.find().fetch()
  const wishlistIds = wishlist.map(obj => obj._id);
  const products = [];
  if (wishlist.length) {
    subscriptions.Products = Meteor.subscribe('products', wishlistIds);
    if (subscriptions.Products.ready()) {

      const products = Products.find({ _id: { $in: wishlistIds } }).fetch();
      const fileIds = [];
      products.forEach(product => {
        if (product.fileIds && product.fileIds.length) {
          fileIds.push(product.fileIds[0]);
        }
      });
      if (fileIds.length) {
        subscriptions.Files = Meteor.subscribe('file', fileIds)
        if (subscriptions.Files.ready()) {
          wishlist.forEach(obj => {
            const product = Products.findOne({_id: obj._id});
            if (product) {
              if (product.fileIds && product.fileIds.length) {
                const fileCursor = Files.findOne({_id: product.fileIds[0]});
                if ( fileCursor && fileCursor.fetch()[0] ){
                  const file = fileCursor.fetch()[0];
                  file.link = Files.link(file);
                  product.file = file;
                }
              }
              obj.product = product;
            }
          });
          onData(null, { wishlist });
        }
      }
    }
  } else {
    onData(null, { wishlist });
  }
}

export default compose(getTrackerLoader(reactiveMapper))(WishlistIndex);
