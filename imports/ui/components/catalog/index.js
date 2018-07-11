import React from 'react';
// import { Link } from 'react-router';

import { Category } from './category';
// import _ from 'lodash';
export const Index = ({ categories, addToCart }) => {
  return <div>
    { categories.map(category =>
      <Category category={ category }
        products={ category.products }
        addToCart={ addToCart }
        key={ category._id }
        link={ `/${ category.slug }` }
        isCatalog={ true }
        path='catalog'
      /> )
    }
  </div>
}
