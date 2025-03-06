import { useState, useEffect, ChangeEvent } from "react";
import { strings } from "../../constants/strings";

interface BreedDropdownProps {
  breeds: string[];
  selectedBreeds: string[];
  onBreedToggle: (breed: string) => void;
  onClearBreeds: () => void;
  loading: boolean;
}

const BreedDropdown = ({
  breeds,
  selectedBreeds,
  onBreedToggle,
  onClearBreeds,
  loading,
}: BreedDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isBreedDropdownOpen, setIsBreedDropdownOpen] = useState(false);

  const filteredBreeds = searchTerm
    ? breeds.filter((breed) =>
        breed.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : breeds;

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
    <div className="relative breed-dropdown">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {strings.search.breed}
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
                  onClick={onClearBreeds}
                  className="text-sm text-primaryHover hover:text-Coltext cursor-pointer"
                  type="button"
                >
                  {strings.search.clear}
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
                  {searchTerm ? "No matching breeds" : "No breeds available"}
                </div>
              ) : (
                filteredBreeds.map((breed: string) => (
                  <div key={breed} className="py-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBreeds.includes(breed)}
                        onChange={() => onBreedToggle(breed)}
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
  );
};

export default BreedDropdown;
