import { ChangeEvent } from "react";
import { SortField, SortOrder } from "../../types";
import { strings } from "../../constants/strings";

interface SortOptionsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  loading: boolean;
}

const SortOptions = ({
  sortField,
  sortOrder,
  onSortChange,
  loading,
}: SortOptionsProps) => {
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split(":") as [SortField, SortOrder];
    onSortChange(field, order);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {strings.search.sort}
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
  );
};

export default SortOptions;
