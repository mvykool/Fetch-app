import {
  Dog,
  Location,
  Match,
  SearchParams,
  SearchResults,
  LocationSearchParams,
  LocationSearchResults,
} from "../types";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Request failed with status ${response.status}: ${errorText}`,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch (error) {
    return { error } as T;
  }
}

export const auth = {
  login: async (name: string, email: string): Promise<void> => {
    await fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ name, email }),
    });
  },

  logout: async (): Promise<void> => {
    await fetchWithAuth("/auth/logout", {
      method: "POST",
    });
  },
};

export const dogs = {
  getBreeds: async (): Promise<string[]> => {
    return fetchWithAuth<string[]>("/dogs/breeds");
  },

  search: async (params: SearchParams): Promise<SearchResults> => {
    const queryParams = new URLSearchParams();

    if (params.breeds && params.breeds.length > 0) {
      params.breeds.forEach((breed) => {
        queryParams.append("breeds", breed);
      });
    }

    if (params.zipCodes && params.zipCodes.length > 0) {
      params.zipCodes.forEach((zipCode) => {
        queryParams.append("zipCodes", zipCode);
      });
    }

    if (params.ageMin !== undefined) {
      queryParams.append("ageMin", params.ageMin.toString());
    }

    if (params.ageMax !== undefined) {
      queryParams.append("ageMax", params.ageMax.toString());
    }

    if (params.size !== undefined) {
      queryParams.append("size", params.size.toString());
    }

    if (params.from !== undefined) {
      queryParams.append("from", params.from.toString());
    }

    if (params.sort !== undefined) {
      queryParams.append("sort", params.sort);
    }

    return fetchWithAuth<SearchResults>(
      `/dogs/search?${queryParams.toString()}`,
    );
  },

  getDogs: async (dogIds: string[]): Promise<Dog[]> => {
    return fetchWithAuth<Dog[]>("/dogs", {
      method: "POST",
      body: JSON.stringify(dogIds),
    });
  },

  match: async (dogIds: string[]): Promise<Match> => {
    return fetchWithAuth<Match>("/dogs/match", {
      method: "POST",
      body: JSON.stringify(dogIds),
    });
  },
};

export const locations = {
  getLocations: async (zipCodes: string[]): Promise<Location[]> => {
    return fetchWithAuth<Location[]>("/locations", {
      method: "POST",
      body: JSON.stringify(zipCodes),
    });
  },

  search: async (
    params: LocationSearchParams,
  ): Promise<LocationSearchResults> => {
    return fetchWithAuth<LocationSearchResults>("/locations/search", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },
};

const api = {
  auth,
  dogs,
  locations,
};

export default api;
