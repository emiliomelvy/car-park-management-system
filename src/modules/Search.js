import React, { useState } from "react";

const SearchComponent = ({ parkingSpots, onSearchResults }) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const handleSearch = () => {
    if (!query.trim()) {
      onSearchResults(parkingSpots);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filteredSpots = parkingSpots.filter((spot) => {
      const { reservation, id } = spot;

      switch (searchType) {
        case "spot":
          return id.toString().includes(lowerQuery);
        case "name":
          return (
            reservation && reservation.name.toLowerCase().includes(lowerQuery)
          );
        case "vehicle":
          return (
            reservation &&
            reservation.vehicleNumber.toLowerCase().includes(lowerQuery)
          );
        case "all":
        default:
          return (
            id.toString().includes(lowerQuery) ||
            (reservation &&
              reservation.name.toLowerCase().includes(lowerQuery)) ||
            (reservation &&
              reservation.vehicleNumber.toLowerCase().includes(lowerQuery))
          );
      }
    });

    onSearchResults(filteredSpots);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-container p-4 bg-white shadow-md rounded-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter search term..."
          className="flex-1 p-2 border rounded-md"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">All</option>
          <option value="spot">Spot Number</option>
          <option value="name">Reserver Name</option>
          <option value="vehicle">Vehicle Number</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchComponent;
