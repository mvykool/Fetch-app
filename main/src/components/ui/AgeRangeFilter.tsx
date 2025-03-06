import { ChangeEvent } from "react";
import { strings } from "../../constants/strings";

interface AgeRangeFilterProps {
  ageMin: string;
  ageMax: string;
  onAgeMinChange: (value: string) => void;
  onAgeMaxChange: (value: string) => void;
  loading: boolean;
}

const AgeRangeFilter = ({
  ageMin,
  ageMax,
  onAgeMinChange,
  onAgeMaxChange,
  loading,
}: AgeRangeFilterProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {strings.search.minAge}
        </label>
        <input
          type="number"
          value={ageMin}
          onChange={(e: ChangeEvent<HTMLInputElement>): void =>
            onAgeMinChange(e.target.value)
          }
          min="0"
          max="20"
          placeholder="Min age"
          className="w-full px-3 placeholder-gray-500 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
          onChange={(e) => onAgeMaxChange(e.target.value)}
          min="0"
          max="20"
          placeholder="Max age"
          className="w-full px-3 placeholder-gray-500 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default AgeRangeFilter;
