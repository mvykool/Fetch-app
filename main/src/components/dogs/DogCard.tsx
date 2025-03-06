import React from "react";
import { Dog } from "../../types";
import { useFavorites } from "../../hooks/useFavorites";

interface DogCardProps {
  dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(dog.id);

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <img
          src={dog.img}
          alt={`${dog.name} - ${dog.breed}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if the provided image fails to load
            e.currentTarget.src = "https://place-puppy.com/300x300";
          }}
        />
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {favorite ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{dog.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{dog.breed}</p>

        <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
          <div>
            <span className="font-medium">Age:</span> {dog.age}{" "}
            {dog.age === 1 ? "year" : "years"}
          </div>
          <div>
            <span className="font-medium">Zip Code:</span> {dog.zip_code}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogCard;
