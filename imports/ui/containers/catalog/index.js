import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading.js';
import { Index } from '/imports/ui/components/catalog/';
import { Categories } from '/imports/api/categories';
import { Products } from '/imports/api/products';
import { addToCart } from '/imports/modules/cart';
import { Files } from '/imports/api/files';
import { browserHistory } from 'react-router';

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  const { slug } = props;
  subscriptions.Categories = Meteor.subscribe('categories');
  if (subscriptions.Categories.ready()) {
    const categories = Categories.find({parentId: {$exists: false}}, {sort: {position: 1} }).fetch();
    const productIds = [];
    categories.forEach(category => {
      if (category.productIds) {
        productIds.push(...category.productIds);
      }
    });
    if (productIds.length) {
      subscriptions.Products = Meteor.subscribe('products', productIds);
      if (subscriptions.Products.ready()) {
        const products = Products.find({ _id: { $in: productIds } }).fetch();

        categories.forEach(category => {
          if (category.productIds) {
            // const products = Products.find({ _id: { $in: category.productIds } }, { $sort: { name: 1 }, fields:{name:1, price:1, fileIds: 1, slug:1 } } ).fetch();
            const products = Products.find({ _id: { $in: category.productIds } }, { $sort: { name: 1 } } ).fetch();

            category.products = products;
          }
        });
      }
    }

    onData(null, { categories, addToCart });

  }
}

export default compose(getTrackerLoader(reactiveMapper))(Index);
