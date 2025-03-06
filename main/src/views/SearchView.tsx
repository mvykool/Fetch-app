import { useState, useEffect, useCallback } from "react";
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
import { strings } from "../constants/strings";

const DOGS_PER_PAGE = 24;

const SearchView = () => {
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
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const fetchDogs = useCallback(
    async (page: number) => {
      const params: SearchParams = {
        breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
        zipCodes: zipCodes.length > 0 ? zipCodes : undefined,
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
    [searchDogs, selectedBreeds, zipCodes, ageMin, ageMax, sortField, sortOrder],
  );

  // Initial fetch and when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchDogs(1);
  }, [selectedBreeds, zipCodes, ageMin, ageMax, sortField, sortOrder, fetchDogs]);

  const handleFilterChange = useCallback(
    (filters: {
      selectedBreeds: string[];
      ageMin?: number;
      ageMax?: number;
      sortField: SortField;
      sortOrder: SortOrder;
      zipCodes: string[];
    }) => {
      setSelectedBreeds(filters.selectedBreeds);
      setAgeMin(filters.ageMin);
      setAgeMax(filters.ageMax);
      setSortField(filters.sortField);
      setSortOrder(filters.sortOrder);
      setZipCodes(filters.zipCodes);
    },
    [],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchDogs(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchDogs],
  );

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

  const handleResetMatch = () => {
    setMatchedDog(null);
  };

  const totalPages = searchResults?.total
    ? Math.ceil(searchResults.total / DOGS_PER_PAGE)
    : 1;

  const hasNextPage = searchResults?.next !== undefined;
  const hasPrevPage = searchResults?.prev !== undefined;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Search title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {strings.search.searchTitle}
        </h2>
      </div>

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
        <div className="lg:col-span-2">
          <DogGrid dogs={dogs} loading={loading} />
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

        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6 lg:self-start">
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
      </div>
      {/* Match result modal */}
      {matchedDog && (
        <MatchResult matchedDog={matchedDog} onReset={handleResetMatch} />
      )}
    </div>
  );
};

export default SearchView;
