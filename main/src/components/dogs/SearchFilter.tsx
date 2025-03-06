import { useState, useEffect, ChangeEvent } from "react";
import { SortField, SortOrder } from "../../types";
import { strings } from "../../constants/strings";

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

const SearchFilters = ({
  breeds,
  onFilterChange,
  loading,
}: SearchFiltersProps) => {
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

  const handleBreedToggle = (breed: string) => {
    setSelectedBreeds((prev) =>
      prev.includes(breed) ? prev.filter((b) => b !== breed) : [...prev, breed],
    );
  };

  const handleClearBreeds = () => {
    setSelectedBreeds([]);
  };

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
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isBreedDropdownOpen]);

  return (
    <div className="bg-white rounded-lg border-black border shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Search Filters</h2>
        <button
          type="button"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="text-Coltext hover:text-black md:hidden"
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
              className="w-full flex justify-between items-center px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              disabled={loading}
            >
              <span className="truncate">
                {selectedBreeds.length
                  ? `${selectedBreeds.length} breed${
                      selectedBreeds.length > 1 ? "s" : ""
                    } selected`
                  : "Select breeds"}
              </span>
              <i className="bx bx-chevron-down text-2xl"></i>
            </button>

            {isBreedDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-sm rounded-md border border-black max-h-60 overflow-y-auto">
                <div className="p-2 border-b sticky top-0 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedBreeds.length} selected
                    </span>
                    <button
                      onClick={handleClearBreeds}
                      className="text-sm text-primaryHover hover:text-Coltext cursor-pointer"
                      type="button"
                    >
                      Clear all
                    </button>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search breeds..."
                    className="w-full px-3 py-1 text-sm border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
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
                    filteredBreeds.map((breed: string) => (
                      <div key={breed} className="py-1">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBreeds.includes(breed)}
                            onChange={() => handleBreedToggle(breed)}
                            className="rounded text-primaryHover focus:ring-Coltext"
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
              {strings.search.minAge}
            </label>
            <input
              type="number"
              value={ageMin}
              onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                setAgeMin(e.target.value)
              }
              min="0"
              max="20"
              placeholder="Min age"
              className="w-full px-3  placeholder-gray-500 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.search.maxAge}
            </label>
            <input
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              min="0"
              max="20"
              placeholder="Max age"
              className="w-full px-3 placeholder-gray-500 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
            className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                  className="bg-light border border-black text-Coltext text-xs rounded-full px-3 py-1 flex items-center"
                >
                  <span className="truncate max-w-[150px]">{breed}</span>
                  <button
                    onClick={() => handleBreedToggle(breed)}
                    className="ml-1 text-Coltext flex items-center"
                    aria-label={`Remove ${breed}`}
                  >
                    <i className="bx bx-x text-lg"></i>
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
            className="px-4 py-1 text-gray-700 bg-gray-100 rounded-md border border-black mr-2 hover:bg-gray-200"
            type="button"
          >
            {strings.search.reset}
          </button>
          <button
            onClick={() => setIsFilterExpanded(false)}
            className="px-4 py-1 text-white bg-primary border-black border rounded-md"
            type="button"
          >
            {strings.search.apply}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
