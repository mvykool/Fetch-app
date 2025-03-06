// src/components/match/MatchResult.tsx

import React from "react";
import { Dog } from "../../types";

interface MatchResultProps {
  matchedDog: Dog | null;
  onReset: () => void;
}

const MatchResult: React.FC<MatchResultProps> = ({ matchedDog, onReset }) => {
  if (!matchedDog) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="relative pt-6 px-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Your Perfect Match!
          </h2>
          <button
            onClick={onReset}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="pt-4 pb-8 px-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="h-48 w-48 rounded-full overflow-hidden border-4 border-blue-500">
                <img
                  src={matchedDog.img}
                  alt={matchedDog.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://place-puppy.com/300x300";
                  }}
                />
              </div>
              <div className="absolute -right-2 -bottom-2 bg-red-500 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {matchedDog.name}
            </h3>
            <p className="text-lg text-gray-600 mb-4">{matchedDog.breed}</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-center mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-500">Age</div>
                <div className="font-bold text-lg">
                  {matchedDog.age} {matchedDog.age === 1 ? "year" : "years"}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-bold text-lg">{matchedDog.zip_code}</div>
              </div>
            </div>

            <p className="text-center text-gray-600 mb-6">
              Congratulations! You've been matched with {matchedDog.name}. This
              adorable
              {matchedDog.age === 1
                ? " 1-year-old "
                : ` ${matchedDog.age}-year-old `}
              {matchedDog.breed} would make a perfect addition to your family!
            </p>

            <div className="flex gap-3">
              <button
                onClick={onReset}
                className="py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Continue Browsing
              </button>
              <button className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Request Adoption
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResult;
