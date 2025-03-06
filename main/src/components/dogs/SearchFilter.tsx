import React, { useState, useEffect } from "react";
import { SortField, SortOrder } from "../../types";

interface SearchFiltersProps {
  breeds: string[];
  onFilterChange: (filters: {
    selectedBreeds: string[];
    ageMin?: number;
    ageMax?: number;
    sortField: SortField;
    sortOrder: SortOrder;
  }) => void;
  loading: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  breeds,
  onFilterChange,
  loading,
}) => {
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<string>("");
  const [ageMax, setAgeMax] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("breed");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isBreedDropdownOpen, setIsBreedDropdownOpen] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Apply filters whenever they change
  useEffect(() => {
    onFilterChange({
      selectedBreeds,
      ageMin: ageMin ? parseInt(ageMin) : undefined,
      ageMax: ageMax ? parseInt(ageMax) : undefined,
      sortField,
      sortOrder,
    });
  }, [selectedBreeds, ageMin, ageMax, sortField, sortOrder, onFilterChange]);

  // Handle breed selection/deselection
  const handleBreedToggle = (breed: string) => {
    setSelectedBreeds((prev) =>
      prev.includes(breed) ? prev.filter((b) => b !== breed) : [...prev, breed],
    );
  };

  // Clear all selected breeds
  const handleClearBreeds = () => {
    setSelectedBreeds([]);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split(":") as [SortField, SortOrder];
    setSortField(field);
    setSortOrder(order);
  };

  // Filter breeds based on search term
  const filteredBreeds = searchTerm
    ? breeds.filter((breed) =>
        breed.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : breeds;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".breed-dropdown") && isBreedDropdownOpen) {
        setIsBreedDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBreedDropdownOpen]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Search Filters</h2>
        <button
          type="button"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="text-blue-600 hover:text-blue-800 md:hidden"
        >
          {isFilterExpanded ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div
        className={`${isFilterExpanded ? "block" : "hidden"} md:block space-y-4`}
      >
        {/* Breed Filter */}
        <div className="relative breed-dropdown">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Breed
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBreedDropdownOpen(!isBreedDropdownOpen)}
              className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <span className="truncate">
                {selectedBreeds.length
                  ? `${selectedBreeds.length} breed${
                      selectedBreeds.length > 1 ? "s" : ""
                    } selected`
                  : "Select breeds"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform ${
                  isBreedDropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isBreedDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                <div className="p-2 border-b sticky top-0 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedBreeds.length} selected
                    </span>
                    <button
                      onClick={handleClearBreeds}
                      className="text-sm text-blue-600 hover:text-blue-800"
                      type="button"
                    >
                      Clear all
                    </button>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search breeds..."
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="p-2">
                  {filteredBreeds.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2 text-center">
                      {searchTerm
                        ? "No matching breeds"
                        : "No breeds available"}
                    </div>
                  ) : (
                    filteredBreeds.map((breed) => (
                      <div key={breed} className="py-1">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBreeds.includes(breed)}
                            onChange={() => handleBreedToggle(breed)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 truncate">
                            {breed}
                          </span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Age Range Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Age (years)
            </label>
            <input
              type="number"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              min="0"
              max="20"
              placeholder="Min age"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Age (years)
            </label>
            <input
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              min="0"
              max="20"
              placeholder="Max age"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={`${sortField}:${sortOrder}`}
            onChange={handleSortChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="breed:asc">Breed (A-Z)</option>
            <option value="breed:desc">Breed (Z-A)</option>
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="age:asc">Age (Youngest First)</option>
            <option value="age:desc">Age (Oldest First)</option>
          </select>
        </div>

        {/* Selected Breed Tags */}
        {selectedBreeds.length > 0 && (
          <div className="mt-3">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Selected Breeds:
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedBreeds.map((breed) => (
                <div
                  key={breed}
                  className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 flex items-center"
                >
                  <span className="truncate max-w-[150px]">{breed}</span>
                  <button
                    onClick={() => handleBreedToggle(breed)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    aria-label={`Remove ${breed}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter buttons for mobile */}
        <div className="flex justify-end mt-4 md:hidden">
          <button
            onClick={handleClearBreeds}
            className="px-4 py-1 text-gray-700 bg-gray-100 rounded-md mr-2 hover:bg-gray-200"
            type="button"
          >
            Reset
          </button>
          <button
            onClick={() => setIsFilterExpanded(false)}
            className="px-4 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            type="button"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
