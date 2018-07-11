import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading.js';
import { Category } from '/imports/ui/components/catalog/category';
import { Categories } from '/imports/api/categories';
import { Products } from '/imports/api/products';
import { addToCart } from '/imports/modules/cart';
import { Files } from '/imports/api/files';
import { browserHistory } from 'react-router';

Session.set('showChildren', true);

const toggleChildren = (arg) => {
  Session.set('showChildren', arg);
}

Session.set('limit', 12);

const sorting = [
  {
    label: 'По названию ▼',
    sort: { name: 1 }
  },
  {
    label: 'По названию ▲',
    sort: { name: -1 }
  },
  {
    label: 'По цене ▼',
    sort: { price: 1 }
  },
  {
    label: 'По цене ▲',
    sort: { price: -1 }
  }
];
Session.set('sortIndex', 0) ;

const onSort = (event) => {
  Session.set('limit', 12);
  Session.set('sortIndex', event.target.value) ;
}

let isLoading = false;

const onLoaded = () => {
  isLoading = false;
}

const loadMore = () => {
  const categoryProductsCount = Counts.get('categoryProductsCount');
  const limit = Session.get('limit');
  if (limit < categoryProductsCount && ! isLoading) {
    isLoading = true;
    Session.set('limit', limit + 12);
  }
}

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  const { slug } = props;
  const limit = Session.get('limit');
  const sortIndex = Session.get('sortIndex');
  const { sort } = sorting[sortIndex];
  const showChildren = Session.get('showChildren');
  subscriptions.Category = Meteor.subscribe('category', slug);
  if ( subscriptions.Category.ready() ) {
    const category = Categories.findOne({slug});
    if (category) {
      document.title = category.name;

      const children = Categories.find({ parentId: category._id}).fetch();

      if (showChildren && children.length) {
        const productIds = [];
        children.forEach(category => {
          if (category.productIds) {
            productIds.push(...category.productIds);
          }
        });
        if (productIds.length) {
          subscriptions.Products = Meteor.subscribe('products', productIds);
          if (subscriptions.Products.ready()) {
            const products = Products.find({ _id: { $in: productIds } }).fetch();

            children.forEach(category => {
              if (category.productIds) {
                // const products = Products.find({ _id: { $in: category.productIds } }, { $sort: { name: 1 }, fields:{name:1, price:1, fileIds: 1, slug:1 } } ).fetch();
                const products = Products.find({ _id: { $in: category.productIds } }, { $sort: { name: 1 } } ).fetch();

                category.products = products;
              }
            });
            onData(null, { products, category, addToCart, children, showChildren, toggleChildren });
          }
        }


      } else {

        subscriptions.Products = Meteor.subscribe('categoryProducts', category._id, limit, 0, sort);

        if (subscriptions.Products.ready()) {
          const products = Products.find({categoryIds: category._id}, {limit, sort}).fetch();

          const categoryProductsCount = Counts.get('categoryProductsCount');
          const limit = Session.get('limit');
          const showLoading = limit < categoryProductsCount;
          onData(null, { products, category, addToCart, loadMore, showLoading, onLoaded, sorting, sortIndex, onSort, children, showChildren, toggleChildren });
        }
      }
    } else {
      browserHistory.push('/404');
    }
  }
}

export default compose(getTrackerLoader(reactiveMapper))(Category);
