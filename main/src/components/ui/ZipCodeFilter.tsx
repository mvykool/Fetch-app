import { ChangeEvent } from "react";
import { strings } from "../../constants/strings";

interface ZipCodeFilterProps {
  zipCodes: string[];
  onZipCodeChange: (zipCode: string) => void;
  onRemoveZipCode: (zipCode: string) => void;
  loading: boolean;
}

const ZipCodeFilter = ({
  zipCodes,
  onZipCodeChange,
  onRemoveZipCode,
  loading,
}: ZipCodeFilterProps) => {
  const handleZipCodeSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const zipCode = e.target.zipCode.value.trim();
    if (zipCode && /^\d{5}$/.test(zipCode)) {
      onZipCodeChange(zipCode);
      e.target.zipCode.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {strings.search.zipcode}
      </label>
      <form onSubmit={handleZipCodeSubmit} className="flex gap-2">
        <input
          type="text"
          name="zipCode"
          placeholder="Enter ZIP code"
          pattern="\d{5}"
          title="Please enter a valid 5-digit ZIP code"
          className="flex-1 px-3 py-1 text-sm border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-secondary"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 cursor-pointer text-sm text-white bg-primary border border-black rounded-md hover:bg-primaryHover disabled:bg-gray-300"
        >
          {strings.search.filter}
        </button>
      </form>

      {zipCodes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {zipCodes.map((zipCode: string) => (
            <span
              key={zipCode}
              className="bg-light border border-black text-Coltext text-xs rounded-full px-3 py-1 flex items-center"
            >
              {zipCode}
              <button
                onClick={() => onRemoveZipCode(zipCode)}
                className="ml-1 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                <i className="bx bx-x text-lg"></i>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZipCodeFilter;
