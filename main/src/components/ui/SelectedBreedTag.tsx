import { strings } from "../../constants/strings";

interface SelectedBreedTagsProps {
  selectedBreeds: string[];
  onBreedToggle: (breed: string) => void;
}

const SelectedBreedTags = ({
  selectedBreeds,
  onBreedToggle,
}: SelectedBreedTagsProps) => {
  if (selectedBreeds.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <div className="text-sm font-medium text-gray-700 mb-1">
        {strings.search.selectedBreeds}
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedBreeds.map((breed) => (
          <div
            key={breed}
            className="bg-light border border-black text-Coltext text-xs rounded-full px-3 py-1 flex items-center"
          >
            <span className="truncate max-w-[150px]">{breed}</span>
            <button
              onClick={() => onBreedToggle(breed)}
              className="ml-1 text-Coltext flex items-center"
              aria-label={`Remove ${breed}`}
            >
              <i className="bx bx-x text-lg"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedBreedTags;
