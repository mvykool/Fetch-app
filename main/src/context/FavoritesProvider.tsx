import React, { useState, useCallback, useEffect } from "react";
import { Dog } from "../types";
import { FavoritesContext } from "./FavoritesContext";

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Dog[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((dog: Dog) => {
    setFavorites((prevFavorites) => {
      // Don't add if already in favorites
      if (prevFavorites.some((fav) => fav.id === dog.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, dog];
    });
  }, []);

  const removeFavorite = useCallback((dogId: string) => {
    setFavorites((prevFavorites: Dog[]) =>
      prevFavorites.filter((dog: Dog) => dog.id !== dogId),
    );
  }, []);

  const isFavorite = useCallback(
    (dogId: string) => favorites.some((dog: Dog) => dog.id === dogId),
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

export default FavoritesProvider;
