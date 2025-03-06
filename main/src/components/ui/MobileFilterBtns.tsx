import { strings } from "../../constants/strings";

interface MobileFilterButtonsProps {
  onClearBreeds: () => void;
  onClose: () => void;
}

const MobileFilterButtons = ({
  onClearBreeds,
  onClose,
}: MobileFilterButtonsProps) => {
  return (
    <div className="flex justify-end mt-4 md:hidden">
      <button
        onClick={onClearBreeds}
        className="px-4 py-1 text-gray-700 bg-gray-100 rounded-md border border-black mr-2 hover:bg-gray-200"
        type="button"
      >
        {strings.search.reset}
      </button>
      <button
        onClick={onClose}
        className="px-4 py-1 text-white bg-primary border-black border rounded-md"
        type="button"
      >
        {strings.search.apply}
      </button>
    </div>
  );
};

export default MobileFilterButtons;
