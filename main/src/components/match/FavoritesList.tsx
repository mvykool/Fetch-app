// src/components/match/FavoritesList.tsx

import React from "react";
import { useFavorites } from "../../hooks/useFavorites";

interface FavoritesListProps {
  onGenerateMatch: () => void;
  loading: boolean;
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  onGenerateMatch,
  loading,
}) => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();

  const handleRemove = (dogId: string) => {
    removeFavorite(dogId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          My Favorites ({favorites.length})
        </h2>
        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto mb-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p>Add some dogs to your favorites!</p>
        </div>
      ) : (
        <>
          <div className="max-h-60 overflow-y-auto mb-4">
            {favorites.map((dog) => (
              <div
                key={dog.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center">
                  <img
                    src={dog.img}
                    alt={dog.name}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                    onError={(e) => {
                      e.currentTarget.src = "https://place-puppy.com/100x100";
                    }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{dog.name}</h3>
                    <p className="text-sm text-gray-500">{dog.breed}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(dog.id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label={`Remove ${dog.name} from favorites`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
            ))}
          </div>

          <button
            onClick={onGenerateMatch}
            disabled={favorites.length === 0 || loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {loading
              ? "Finding your match..."
              : `Find My Match (${favorites.length} dog${
                  favorites.length !== 1 ? "s" : ""
                })`}
          </button>
        </>
      )}
    </div>
  );
};

export default FavoritesList;
