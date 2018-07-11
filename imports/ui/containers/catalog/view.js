import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading';
import { View } from '/imports/ui/components/catalog/view';
import { Products } from '/imports/api/products';
import { Files } from '/imports/api/files';
import { addToCart } from '/imports/modules/cart';

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  const { slug } = props;
  subscriptions.Product = Meteor.subscribe('product', slug);
  if (subscriptions.Product.ready()) {
    const product = Products.findOne({slug});
    document.title = product.name;
    subscriptions.Children = Meteor.subscribe('productChildren', product._id);
    let files = [];
    if (product.fileIds && product.fileIds.length) {
      subscriptions.Files = Meteor.subscribe('file', product.fileIds)
      if (subscriptions.Files.ready()
        && subscriptions.Children.ready()
      ) {
        product.fileIds.forEach((fileId) => {
          const fileCursor = Files.findOne({_id: fileId});
          if ( fileCursor && fileCursor.fetch()[0] ){
            files.push(fileCursor.link('slide'));
          }
        });
        const children = Products.find({ parentId: product._id }, { sort: { position: 1 } }).fetch();

        onData(null, { product, files, addToCart, children });
      }
    }
    // if (subscriptions.Children.ready()) {
    //   const children = Products.find({ parentId: product._id }, { sort: { position: 1 } }).fetch();
    //
    //   onData(null, { product, files, addToCart, children });
    // }
  }
}

export default compose(getTrackerLoader(reactiveMapper))(View);
