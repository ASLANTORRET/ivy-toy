import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Loading } from '/imports/ui/components/loading';
import { UserOrders } from '/imports/ui/components/profile/orders';
import { Orders } from '/imports/api/orders';

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  subscriptions.Orders = Meteor.subscribe('orders');
  if (subscriptions.Orders.ready()) {
    const orders = Orders.find({}, { sort: { createdAt: -1 } }).fetch();
    onData(null, { orders });
  }
}

export default compose(getTrackerLoader(reactiveMapper)) (UserOrders);
