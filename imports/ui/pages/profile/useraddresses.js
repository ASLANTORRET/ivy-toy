import React from 'react';
import Addresses from '/imports/ui/containers/profile/addresses';

export const UserAddresses = ({ params, location, children }) => {
  return children || <Addresses />;
}
