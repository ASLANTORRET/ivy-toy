import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Navigation } from '/imports/ui/components/navigation';
import { Categories } from '/imports/api/categories';
import { browserHistory } from 'react-router';

const onLogout = () => {
  Meteor.logout(() => {
    browserHistory.push('/login');
  });
}
Session.set('showSearch', false);
const toggleSearch = (show) => {
  Session.set('showSearch', show);
}

const onSearch = (event) => {
  event.preventDefault();
  const q = event.target.search.value;
  browserHistory.push(`/search/${ q }`);
}

const reactiveMapper = (props, onData) => {
  const showSearch = Session.get('showSearch');
  const subscriptions = {};
  subscriptions.Categories = Meteor.subscribe('categories');
  if (subscriptions.Categories.ready()) {
    const categories = Categories.find({ parentId: { $exists : false } }, { sort: { position: 1 } }).fetch();
    onData(null, { categories, hasUser: Meteor.user(), onLogout, showSearch, toggleSearch, onSearch });
  }

};

export default compose(getTrackerLoader(reactiveMapper))(Navigation);
