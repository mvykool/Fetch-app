import React from "react";
import { Dog } from "../../types";
import DogCard from "./DogCard";

interface DogGridProps {
  dogs: Dog[];
  loading: boolean;
}

const DogGrid: React.FC<DogGridProps> = ({ dogs, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Loading skeleton placeholders */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
              <div className="grid grid-cols-2 gap-1">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (dogs.length === 0) {
    return (
      <div className="text-center py-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No dogs found
        </h3>
        <p className="mt-1 text-gray-500">
          Try adjusting your search filters to find more dogs.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {dogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} />
      ))}
    </div>
  );
};

export default DogGrid;
