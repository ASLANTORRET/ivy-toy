import React from 'react';
import Index from '/imports/ui/containers/profile';

export const Profile = ({ params, location, children }) => {
  return children || <Index />;
}
