import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import { Loading } from '/imports/ui/components/loading';
import { Texts } from '/imports/api/texts';
import { Text } from '/imports/ui/components/text';

const reactiveMapper = (props, onData) => {
  const subscriptions = {};
  const { slug } = props;
  subscriptions.Text = Meteor.subscribe('text', props.slug);
  if (subscriptions.Text.ready()) {
    const text = Texts.findOne({ slug });

    onData(null, { text });
  }
}

export default compose(getTrackerLoader(reactiveMapper))(Text);
