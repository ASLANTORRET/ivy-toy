import React from 'react';
import CategoryProducts from '/imports/ui/containers/catalog/category';

export const Category = ({ params, location, children }) => {
  return <div>
    { children || null }
    <CategoryProducts slug={ params.categorySlug } />

  </div>
}
