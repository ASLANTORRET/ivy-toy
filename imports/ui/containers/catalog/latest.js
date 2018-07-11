import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading.js';
import { Latest } from '/imports/ui/components/catalog/latest';
import { Categories } from '/imports/api/categories';
import { Products } from '/imports/api/products';
import { addToCart } from '/imports/modules/cart';
import { Files } from '/imports/api/files';
import { browserHistory } from 'react-router';

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
  Session.set('sortIndex', event.target.value) ;
}

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  const sortIndex = Session.get('sortIndex');
  const { sort } = sorting[sortIndex];
  subscriptions.Products = Meteor.subscribe('latestProducts');

  if (subscriptions.Products.ready()) {
    let weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    // const products = Products.find({ parentId: {$exists: false} }, { sort, fields:{name:1, price:1, fileIds: 1, slug:1 } }).fetch();
    const products = Products.find({ createdAt: {$gt: weekAgo}, parentId: {$exists: false} }, { sort: { createdAt: -1 } }).fetch();
    const isCatalog = true;
    onData(null, { products, addToCart, sorting, sortIndex, onSort, isCatalog });
  }
}

export default compose(getTrackerLoader(reactiveMapper))(Latest);
