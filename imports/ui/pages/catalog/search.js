import React from 'react';
import Search from '/imports/ui/containers/catalog/search';

export const SearchResult = ({ params, location, children }) => {
  document.title = "Поиск";
  return <div>
    <Search search={ params.search } />
    { children || null }
  </div>
}
