import React from 'react';

function SearchBar({ city, setCity, onSearch }) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        spellCheck="false"
      />
      <button onClick={onSearch}>
        <img src="images/search.png" alt="Search" />
      </button>
    </div>
  );
}

export default SearchBar;
