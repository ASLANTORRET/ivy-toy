import { compose } from 'react-komposer';
import getTrackerLoader from '/imports/modules/getTrackerLoader';
import { Loading } from '/imports/ui/components/loading';
import { Edit } from '/imports/ui/components/profile/edit';

const reactiveMapper = (props, onData) => {

  onData(null, { });
}

export default compose(getTrackerLoader(reactiveMapper)) (Edit);
