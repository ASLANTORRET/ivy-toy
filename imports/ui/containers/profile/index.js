import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Loading } from '/imports/ui/components/loading';
import { Index } from '/imports/ui/components/profile';

const reactiveMapper = (props, onData) => {

  onData(null, { });
}

export default compose(getTrackerLoader(reactiveMapper)) (Index);
