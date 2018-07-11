import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Footer } from '/imports/ui/components/footer';

const reactiveMapper = (props, onData) => {
  onData(null, { hasUser: Meteor.user() });
};

export default compose(getTrackerLoader(reactiveMapper))(Footer);
