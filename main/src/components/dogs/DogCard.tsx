import { SyntheticEvent } from "react";
import { Dog } from "../../types";
import { useFavorites } from "../../hooks/useFavorites";

interface DogCardProps {
  dog: Dog;
}

const DogCard = ({ dog }: DogCardProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(dog.id);

  const handleFavoriteToggle = (): void => {
    if (favorite) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  return (
    <div className="bg-white rounded-lg  border-black border overflow-hidden transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <img
          src={dog.img}
          alt={`${dog.name} - ${dog.breed}`}
          className="w-full h-full object-cover"
          onError={(e: SyntheticEvent<HTMLImageElement>) => {
            // Fallback image if the provided image fails to load
            e.currentTarget.src = "https://place-puppy.com/300x300";
          }}
        />
        <button
          onClick={handleFavoriteToggle}
          className="absolute cursor-pointer top-2 right-2 bg-white p-1.5 flex justify-center items-center rounded-full border-black border hover:bg-gray-100"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {favorite ? (
            <i className="bx bxs-heart text-red-400 text-2xl"></i>
          ) : (
            <i className="bx bx-heart text-gray-400 text-2xl"></i>
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{dog.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{dog.breed}</p>

        <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Age:</span> {dog.age}{" "}
            {dog.age === 1 ? "year" : "years"}
          </div>
          <div>
            <span className="font-semibold">Zip Code:</span> {dog.zip_code}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogCard;
