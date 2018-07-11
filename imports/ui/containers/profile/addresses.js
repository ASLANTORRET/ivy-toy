import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Loading } from '/imports/ui/components/loading';
import { Addresses } from '/imports/ui/components/profile/addresses';
import { UserAddresses } from '/imports/api/useraddresses';
import { removeUserAddress } from '/imports/api/useraddresses/methods';


const onRemove = (_id) => {
  removeUserAddress.call({_id}, (error, result) => {
    if (error) {
      console.log(error);
      Materialize.toast(error.reason, 4000);
    } else {
      Materialize.toast("Адрес удалён!", 4000);
    }
  });
}

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  subscriptions.Addresses = Meteor.subscribe('userAddresses');
  if (subscriptions.Addresses.ready()) {
    const addresses = UserAddresses.find({}, { sort: { name:1 } }).fetch();
    onData(null, { addresses, onRemove });
  }
}

export default compose(getTrackerLoader(reactiveMapper)) (Addresses);
