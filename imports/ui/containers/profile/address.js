import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Loading } from '/imports/ui/components/loading';
import { Address } from '/imports/ui/components/profile/address';
import { UserAddresses } from '/imports/api/useraddresses';
import { insertUserAddress } from '/imports/api/useraddresses/methods';
import { Zones } from '/imports/api/zones';

import { browserHistory } from 'react-router';

const onSubmit = (address) => {
  address.userId = Meteor.userId();
  console.log(address);
  insertUserAddress.call(address, (error, result) => {
    if (error) {
      console.log(error);
      Materialize.toast(error.reason, 4000);
    } else {
      const afterAddress = Session.get('afterAddress');
      if (afterAddress) {
        Session.set('afterAddress', false);
        browserHistory.push(afterAddress);
      } else {
        browserHistory.push('/profile/addresses');
      }
    }
  });
}

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  subscriptions.Zones = Meteor.subscribe('zones');
  if(subscriptions.Zones.ready()) {
    const zones = Zones.find({}, {$sort: {name: 1}}).fetch();
    zones.forEach(zone => {
      zone.coords = JSON.parse(zone.coordinates).map(coords => {
        return coords.map(coord => coord.reverse());
      });
    });
    onData(null, { onSubmit, zones });
  }
}

export default compose(getTrackerLoader(reactiveMapper)) (Address);
