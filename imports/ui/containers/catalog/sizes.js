import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading';
import { Sizes } from '/imports/ui/components/catalog/sizes';
import { Products } from '/imports/api/products';
import { addToCart } from '/imports/modules/cart';
import { browserHistory } from 'react-router';

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  const { slug } = props;
  subscriptions.Product = Meteor.subscribe('product', slug);
  if (subscriptions.Product.ready()) {
    const product = Products.findOne({slug});
    if (product) {
      subscriptions.Children = Meteor.subscribe('productChildren', product._id);

      if (subscriptions.Children.ready()) {
        const children = Products.find({ parentId: product._id }, { sort: { position: 1 } }).fetch();
        onData(null, { product, addToCart, children });
      }
    } else {
      browserHistory.goBack();
    }
  }
}

export default compose(getTrackerLoader(reactiveMapper))(Sizes);
