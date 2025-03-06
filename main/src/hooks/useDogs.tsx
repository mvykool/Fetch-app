import { useState, useCallback, useEffect } from "react";
import api from "../services/fetchApi";
import { Dog, SearchParams, SearchResults } from "../types";

export const useDogs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null,
  );

  // Fetch all available dog breeds
  const fetchBreeds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const breedsData = await api.dogs.getBreeds();
      setBreeds(breedsData);
    } catch (err) {
      setError("Failed to fetch dog breeds");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search for dogs with filters
  const searchDogs = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      if (!params.sort) {
        params.sort = "breed:asc";
      }

      const results = await api.dogs.search(params);
      setSearchResults(results);

      const dogData = await api.dogs.getDogs(results.resultIds);
      setDogs(dogData);

      return { results, dogs: dogData };
    } catch (err) {
      setError("Failed to search for dogs");
      console.error(err);
      return { results: null, dogs: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDogs = useCallback(async (dogIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const dogData = await api.dogs.getDogs(dogIds);
      return dogData;
    } catch (err) {
      setError("Failed to fetch dog details");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const generateMatch = useCallback(async (dogIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const matchResult = await api.dogs.match(dogIds);

      if (matchResult.match) {
        const matchedDog = await api.dogs.getDogs([matchResult.match]);
        return matchedDog[0];
      }

      return null;
    } catch (err) {
      setError("Failed to generate a match");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  return {
    loading,
    error,
    breeds,
    dogs,
    searchResults,
    fetchBreeds,
    searchDogs,
    fetchDogs,
    generateMatch,
  };
};
