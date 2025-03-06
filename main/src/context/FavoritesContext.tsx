import React, { createContext, useState, useCallback, useEffect } from "react";
import { Dog, FavoritesContextType } from "../types";

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  clearFavorites: () => {},
});

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Dog[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((dog: Dog) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === dog.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, dog];
    });
  }, []);

  const removeFavorite = useCallback((dogId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((dog) => dog.id !== dogId),
    );
  }, []);

  const isFavorite = useCallback(
    (dogId: string) => favorites.some((dog) => dog.id === dogId),
    [favorites],
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
