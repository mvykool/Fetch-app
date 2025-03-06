import { SyntheticEvent } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import { Dog } from "../../types";
import { strings } from "../../constants/strings";

interface FavoritesListProps {
  onGenerateMatch: () => void;
  loading: boolean;
}

const FavoritesList = ({ onGenerateMatch, loading }: FavoritesListProps) => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();

  const handleRemove = (dogId: string) => {
    removeFavorite(dogId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border-black border-[1px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {" "}
          {strings.search.myFav}({favorites.length})
        </h2>
        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="text-sm cursor-pointer text-red-600 hover:text-red-800"
          >
            {strings.search.clear}
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <i className="bx bx-heart text-4xl"></i>
          <p>{strings.search.addFav}</p>
        </div>
      ) : (
        <>
          <div className="max-h-60 overflow-y-auto mb-4">
            {favorites.map((dog: Dog) => (
              <div
                key={dog.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center">
                  <img
                    src={dog.img}
                    alt={dog.name}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                    onError={(e: SyntheticEvent<HTMLImageElement>): void => {
                      e.currentTarget.src = "https://place-puppy.com/100x100";
                    }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{dog.name}</h3>
                    <p className="text-sm text-gray-500">{dog.breed}</p>
                  </div>
                </div>
                <button
                  onClick={(): void => handleRemove(dog.id)}
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                  aria-label={`Remove ${dog.name} from favorites`}
                >
                  <i className="bx bx-x-circle text-2xl"></i>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={onGenerateMatch}
            disabled={favorites.length === 0 || loading}
            className="w-full py-2 px-4 bg-secondary cursor-pointer text-white rounded-md hover:bg-Coltext focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors disabled:opacity-50"
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
