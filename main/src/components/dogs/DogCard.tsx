import { SyntheticEvent } from "react";
import { Dog } from "../../types";
import FavoriteBtn from "./FavoriteBtn";

interface DogCardProps {
  dog: Dog;
}

const DogCard = ({ dog }: DogCardProps) => {
  return (
    <div className="bg-white rounded-lg border-black border overflow-hidden transition-shadow">
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
        <FavoriteBtn dog={dog} />
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
