import React, { useState } from 'react';

function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    
      <input
        type="text"
        placeholder="Search links or tags"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      Search
    
  );
}

export default Search;