import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Dog, SearchParams, SortField, SortOrder } from "../types";
import { useDogs } from "../hooks/useDogs";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";

import SearchFilters from "../components/dogs/SearchFilter";
import DogGrid from "../components/dogs/DogGrid";
import Pagination from "../components/ui/Pagination";
import FavoritesList from "../components/match/FavoritesList";
import MatchResult from "../components/match/MatchResult";

const DOGS_PER_PAGE = 24;

const SearchPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    loading,
    error,
    breeds,
    dogs,
    searchResults,
    searchDogs,
    generateMatch,
  } = useDogs();
  const { favorites } = useFavorites();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState<number | undefined>(undefined);
  const [ageMax, setAgeMax] = useState<number | undefined>(undefined);
  const [sortField, setSortField] = useState<SortField>("breed");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Search for dogs with current filters
  const fetchDogs = useCallback(
    async (page: number) => {
      const params: SearchParams = {
        breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
        ageMin,
        ageMax,
        size: DOGS_PER_PAGE,
        sort: `${sortField}:${sortOrder}`,
      };

      // If we're paginating, add the from parameter
      if (page > 1) {
        params.from = (page - 1) * DOGS_PER_PAGE;
      }

      await searchDogs(params);
    },
    [searchDogs, selectedBreeds, ageMin, ageMax, sortField, sortOrder],
  );

  // Initial fetch and when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchDogs(1);
  }, [selectedBreeds, ageMin, ageMax, sortField, sortOrder, fetchDogs]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filters: {
      selectedBreeds: string[];
      ageMin?: number;
      ageMax?: number;
      sortField: SortField;
      sortOrder: SortOrder;
    }) => {
      setSelectedBreeds(filters.selectedBreeds);
      setAgeMin(filters.ageMin);
      setAgeMax(filters.ageMax);
      setSortField(filters.sortField);
      setSortOrder(filters.sortOrder);
    },
    [],
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchDogs(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchDogs],
  );

  // Generate a match from favorites
  const handleGenerateMatch = useCallback(async () => {
    if (favorites.length === 0) return;

    setIsGeneratingMatch(true);
    try {
      const dogIds = favorites.map((dog) => dog.id);
      const match = await generateMatch(dogIds);
      setMatchedDog(match);
    } catch (error) {
      console.error("Failed to generate match:", error);
    } finally {
      setIsGeneratingMatch(false);
    }
  }, [favorites, generateMatch]);

  // Reset match
  const handleResetMatch = () => {
    setMatchedDog(null);
  };

  // Calculate total pages
  const totalPages = searchResults?.total
    ? Math.ceil(searchResults.total / DOGS_PER_PAGE)
    : 1;

  // Check if there are next and previous pages
  const hasNextPage = searchResults?.next !== undefined;
  const hasPrevPage = searchResults?.prev !== undefined;

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="space-y-6">
      {/* Search title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Find Your Perfect Dog
        </h1>
        <p className="text-gray-600">
          {searchResults?.total
            ? `Found ${searchResults.total} ${
                searchResults.total === 1 ? "dog" : "dogs"
              }`
            : "Loading dogs..."}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => fetchDogs(currentPage)}
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar for filters and favorites */}
        <div className="lg:col-span-1 space-y-6">
          <SearchFilters
            breeds={breeds}
            onFilterChange={handleFilterChange}
            loading={loading}
          />
          <FavoritesList
            onGenerateMatch={handleGenerateMatch}
            loading={isGeneratingMatch}
          />
        </div>

        {/* Main content area - dog grid */}
        <div className="lg:col-span-2">
          <DogGrid dogs={dogs} loading={loading} />

          {/* Pagination */}
          {searchResults && searchResults.total > DOGS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Match result modal */}
      {matchedDog && (
        <MatchResult matchedDog={matchedDog} onReset={handleResetMatch} />
      )}
    </div>
  );
};

export default SearchPage;
