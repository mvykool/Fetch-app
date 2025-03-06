import { useState, useEffect } from "react";
import { SortField, SortOrder } from "../../types";
import BreedDropdown from "../ui/BreedDropdown";
import AgeRangeFilter from "../ui/AgeRangeFilter";
import SortOptions from "../ui/SortOptions";
import SelectedBreedTags from "../ui/SelectedBreedTag";
import MobileFilterButtons from "../ui/MobileFilterBtns";

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
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

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

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

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
        <BreedDropdown
          breeds={breeds}
          selectedBreeds={selectedBreeds}
          onBreedToggle={handleBreedToggle}
          onClearBreeds={handleClearBreeds}
          loading={loading}
        />

        {/* Age Range Filters */}
        <AgeRangeFilter
          ageMin={ageMin}
          ageMax={ageMax}
          onAgeMinChange={setAgeMin}
          onAgeMaxChange={setAgeMax}
          loading={loading}
        />

        {/* Sort Options */}
        <SortOptions
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          loading={loading}
        />

        {/* Selected Breed Tags */}
        <SelectedBreedTags
          selectedBreeds={selectedBreeds}
          onBreedToggle={handleBreedToggle}
        />

        {/* Filter buttons for mobile */}
        <MobileFilterButtons
          onClearBreeds={handleClearBreeds}
          onClose={() => setIsFilterExpanded(false)}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
