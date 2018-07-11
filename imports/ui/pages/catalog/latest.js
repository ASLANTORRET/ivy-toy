import React from 'react';
import LatestProducts from '/imports/ui/containers/catalog/latest';

export const Latest = ({ params, location, children }) => {
  document.title = "Новинки";
  return <div>
    <LatestProducts />

    { children || null }
  </div>
}
