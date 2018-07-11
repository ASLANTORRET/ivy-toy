import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading.js';
import { Search } from '/imports/ui/components/catalog/search';
import { Products } from '/imports/api/products';
import { addToCart } from '/imports/modules/cart';
import { Files } from '/imports/api/files';
import { browserHistory } from 'react-router';

Session.set('limit', 6);

const sorting = [
  {
    label: 'По релевантности',
    sort: { score: { $meta: "textScore" } }
  },
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
  const categoryProductsCount = Counts.get('searchProductCount');
  const limit = Session.get('limit');
  if (limit < categoryProductsCount && ! isLoading) {
    isLoading = true;
    Session.set('limit', limit + 12);
  }
}

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  const { search } = props;
  const limit = Session.get('limit');
  const sortIndex = Session.get('sortIndex');
  const { sort } = sorting[sortIndex] || sorting[0];
  subscriptions.Products = Meteor.subscribe('productsSearch', search, limit, 0, sort);

  if (subscriptions.Products.ready()) {
    // const products = Products.find({}, { limit, sort, fields:{name:1, price:1, fileIds: 1, slug:1 }}).fetch();
    const products = Products.find({score: {$exists: true}}, { limit, sort }).fetch();

    const categoryProductsCount = Counts.get('searchProductCount');
    const limit = Session.get('limit');
    const showLoading = limit < categoryProductsCount;

    onData(null, { search, products, addToCart, loadMore, showLoading, onLoaded, sorting, sortIndex, onSort  });
  }
}

export default compose(getTrackerLoader(reactiveMapper))(Search);
