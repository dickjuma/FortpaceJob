import React from 'react';
// Using GigsByCategory component as a base for search results
import GigsByCategory from './GigsByCategory';

// We can reuse the exact same layout as GigsByCategory for the search results,
// just with different header text. To save code duplication, we wrap it.
const GigSearchResults = () => {
  return (
    <div className="gig-search-wrapper">
      <GigsByCategory />
    </div>
  );
};

export default GigSearchResults;
