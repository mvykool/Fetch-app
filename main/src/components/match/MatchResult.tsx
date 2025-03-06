import { SyntheticEvent } from "react";
import { strings } from "../../constants/strings";
import { Dog } from "../../types";

interface MatchResultProps {
  matchedDog: Dog | null;
  onReset: () => void;
}

const MatchResult = ({ matchedDog, onReset }: MatchResultProps) => {
  if (!matchedDog) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="relative pt-6 px-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {strings.match.foundMatch}
          </h2>
          <button
            onClick={onReset}
            className="text-gray-400 cursor-pointer hover:text-gray-500"
            aria-label="Close"
          >
            <i className="bx bx-x-circle text-3xl"></i>
          </button>
        </div>

        <div className="pt-4 pb-8 px-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="h-48 w-48 rounded-full overflow-hidden border-4 border-highlight">
                <img
                  src={matchedDog.img}
                  alt={matchedDog.name}
                  className="h-full w-full object-cover"
                  onError={(e: SyntheticEvent<HTMLImageElement>): void => {
                    e.currentTarget.src = "https://place-puppy.com/300x300";
                  }}
                />
              </div>
              <div className="absolute -right-2 -bottom-2 bg-red-500 flex justify-center items-center rounded-full p-3">
                <i className="bx bxs-heart text-white text-2xl"></i>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {matchedDog.name}
            </h3>
            <p className="text-lg text-gray-600 mb-4">{matchedDog.breed}</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-center mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-500">{strings.match.age}</div>
                <div className="font-bold text-lg">
                  {matchedDog.age} {matchedDog.age === 1 ? "year" : "years"}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-500">
                  {strings.match.location}
                </div>
                <div className="font-bold text-lg">{matchedDog.zip_code}</div>
              </div>
            </div>

            <p className="text-center text-gray-600 mb-6">
              {strings.match.congratulations}
              {matchedDog.name}.{" "}
              {matchedDog.age === 1
                ? " 1-year-old "
                : ` ${matchedDog.age}-year-old, `}
              {matchedDog.breed}
            </p>

            <div className="flex gap-3">
              <button
                onClick={onReset}
                className="py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primaryHover focus:ring-offset-2 transition-colors"
              >
                {strings.match.continueBrowsing}
              </button>
              <button className="py-2 px-4 bg-primary cursor-pointer text-white rounded-md hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-primaryHover focus:ring-offset-2 transition-colors">
                {strings.match.adoptPuppy}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResult;
