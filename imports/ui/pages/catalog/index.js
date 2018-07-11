import React from 'react';
import Index from '/imports/ui/containers/catalog';

export const Catalog = ({ params, location, children }) => {
  document.title = "Каталог";
  return <div>
    <Index />
    { children || null }
  </div>
}
