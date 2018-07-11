import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading';
import { OrderView } from '/imports/ui/components/orders/view';
import { Products } from '/imports/api/products';
import { Texts } from '/imports/api/texts';
import { Orders } from '/imports/api/orders';
import moment from 'moment';
import 'moment/locale/ru';
const kkb = new ReactiveVar()

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  const { _id } = props;
  subscriptions.Order = Meteor.subscribe('order', _id);
  subscriptions.Text = Meteor.subscribe('text', 'region');
  if (subscriptions.Order.ready()
    && subscriptions.Text.ready()
  ) {
    const order = Orders.findOne(_id);
    const exlinetext = Texts.findOne({slug: 'region'});
    if (order) {
      Meteor.call('order.kkb', order._id, (err, res)=> {
        kkb.set(res)
      })
      let deliveryDate;
      const plus6Hours = moment(order.createdAt).add(6, 'hours')
      switch(plus6Hours.day()) {
        case 5:
          deliveryDate = plus6Hours.add(3, 'days');
          break;
        default:
          deliveryDate = plus6Hours.add(2, 'days');
          break;
      }
      let appendix = '<document>'
      order.products.forEach((product, index) => {
        appendix += `<item number="${index+1}" name="${encodeURI(product.name)}" quantity="${product.quantity}" amount="${product.sum}"/>`
      })
      appendix += '</document>'

      deliveryDate = deliveryDate.locale('ru').format('dddd, Do MMMM YYYY') || null;
      const k = kkb.get()
      onData(null, { order, deliveryDate, exlinetext, kkb: k, appendix });
    }
  }
}

export default compose(getTrackerLoader(reactiveMapper))(OrderView);
