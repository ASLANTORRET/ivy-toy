import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading';
import { OrderNew } from '/imports/ui/components/orders/new';
import { Settings } from '/imports/api/settings';

import { browserHistory } from 'react-router';

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  subscriptions.Settings = Meteor.subscribe('setting', 'allowOrder' );
  if (subscriptions.Settings.ready()) {
    let allowOrder = Settings.findOne({_id: 'allowOrder'});
    allowOrder = allowOrder && allowOrder.value;
    const userId = Meteor.userId();

    onData(null, { allowOrder, userId });
  }
}

export default compose(getTrackerLoader(reactiveMapper))(OrderNew);
