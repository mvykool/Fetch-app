import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchParams, LocationSearchParams } from "../types";
import api from "./fetchApi";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("API", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("auth", () => {
    it("should call login with correct parameters", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      const name = "Test User";
      const email = "test@example.com";
      await api.auth.login(name, email);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ name, email }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
    });

    it("should call logout correctly", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await api.auth.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
    });
  });

  describe("dogs", () => {
    it("should fetch breeds correctly", async () => {
      const mockBreeds = ["Labrador", "Poodle", "Beagle"];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockBreeds),
      });

      const result = await api.dogs.getBreeds();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }),
      );

      expect(result).toEqual(mockBreeds);
    });

    it("should search dogs with the correct query parameters", async () => {
      const mockResults = {
        resultIds: ["dog1", "dog2"],
        total: 2,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResults),
      });

      const searchParams: SearchParams = {
        breeds: ["Labrador"],
        ageMin: 1,
        ageMax: 5,
        size: 10,
      };

      const result = await api.dogs.search(searchParams);

      // Checking that URl contains expected parmeters
      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain("/dogs/search?");
      expect(url).toContain("breeds=Labrador");
      expect(url).toContain("ageMin=1");
      expect(url).toContain("ageMax=5");
      expect(url).toContain("size=10");

      expect(result).toEqual(mockResults);
    });

    it("should get dogs by IDs", async () => {
      const mockDogs = [
        {
          id: "dog1",
          name: "Rex",
          breed: "Labrador",
          age: 3,
          zip_code: "12345",
          img: "img1.jpg",
        },
        {
          id: "dog2",
          name: "Max",
          breed: "Poodle",
          age: 2,
          zip_code: "67890",
          img: "img2.jpg",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockDogs),
      });

      const dogIds = ["dog1", "dog2"];
      const result = await api.dogs.getDogs(dogIds);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://frontend-take-home-service.fetch.com/dogs",
        {
          method: "POST",
          body: JSON.stringify(dogIds),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      expect(result).toEqual(mockDogs);
    });

    it("should match dogs correctly", async () => {
      const mockMatch = { match: "dog1" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockMatch),
      });

      const dogIds = ["dog1", "dog2"];
      const result = await api.dogs.match(dogIds);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(dogIds),
        }),
      );

      expect(result).toEqual(mockMatch);
    });
  });

  describe("locations", () => {
    it("should search locations with correct parameters", async () => {
      const mockResults = {
        results: [
          {
            zip_code: "12345",
            latitude: 40.7,
            longitude: -74.0,
            city: "New York",
            state: "NY",
            county: "New York",
          },
        ],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResults),
      });

      const searchParams: LocationSearchParams = {
        city: "New York",
        states: ["NY"],
        size: 10,
      };

      const result = await api.locations.search(searchParams);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://frontend-take-home-service.fetch.com/locations/search",
        {
          method: "POST",
          body: JSON.stringify(searchParams),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      expect(result).toEqual(mockResults);
    });
  });

  describe("error handling", () => {
    it("should throw an error for failed requests", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve("Unauthorized"),
      });

      await expect(api.dogs.getBreeds()).rejects.toThrow(
        "Request failed with status 401: Unauthorized",
      );
    });
  });
});
