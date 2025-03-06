import { SyntheticEvent } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import { Dog } from "../../types";

interface FavoriteBtnProps {
  dog: Dog;
}

const FavoriteBtn = ({ dog }: FavoriteBtnProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(dog.id);

  const handleFavoriteToggle = (e: SyntheticEvent): void => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  return (
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
  );
};

export default FavoriteBtn;
