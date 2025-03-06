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

    const appendArrayParams = (paramName: string, values?: string[]) => {
      if (values && values.length > 0) {
        values.forEach((value: string) => queryParams.append(paramName, value));
      }
    };

    appendArrayParams("breeds", params.breeds);
    appendArrayParams("zipCodes", params.zipCodes);

    const appendIfDefined = (paramName: string, value?: string | number) => {
      if (value !== undefined) {
        queryParams.append(paramName, value.toString());
      }
    };

    appendIfDefined("ageMin", params.ageMin);
    appendIfDefined("ageMax", params.ageMax);
    appendIfDefined("size", params.size);
    appendIfDefined("from", params.from);
    appendIfDefined("sort", params.sort);

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
