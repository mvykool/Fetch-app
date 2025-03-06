import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import SearchView from "./SearchView";

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

vi.mock("../hooks/useDogs", () => ({
  useDogs: () => ({
    loading: false,
    error: null,
    breeds: ["Labrador", "Poodle", "Beagle"],
    dogs: [
      {
        id: "1",
        name: "Buddy",
        breed: "Poodle",
        zip_code: 123,
        age: 2,
        img: "image2.jpg",
      },
      {
        id: "2",
        name: "Jerry",
        breed: "Pitbull",
        zip_code: 123,
        age: 2,
        img: "image2.jpg",
      },
    ],
    searchResults: {
      total: 50,
      next: "?from=24",
      prev: undefined,
    },
    searchDogs: vi.fn().mockResolvedValue({}),
    generateMatch: vi.fn().mockResolvedValue({
      id: "3",
      name: "Charlie",
      breed: "Beagle",
      zip_code: 123,
      age: 4,
      img: "image3.jpg",
    }),
  }),
}));

vi.mock("../hooks/useFavorites", () => ({
  useFavorites: () => ({
    favorites: [
      { id: "1", name: "Rex", breed: "Labrador", age: 3, img: "image1.jpg" },
    ],
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    isFavorite: vi.fn((id) => id === "1"),
    clearFavorites: vi.fn(),
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const scrollToMock = vi.fn();
window.scrollTo = scrollToMock;

describe("SearchView Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the search title correctly", () => {
    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>,
    );

    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  it("displays the dog grid with dogs", () => {
    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Buddy/i)).toBeInTheDocument();
    expect(screen.getByText(/Jerry/i)).toBeInTheDocument();
  });

  it("shows pagination when there are more results than can fit on one page", () => {
    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("displays search filters", () => {
    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Min age/i)).toBeInTheDocument();
    expect(screen.getByText(/Select breeds/i)).toBeInTheDocument();
    expect(screen.getByText(/Max age/i)).toBeInTheDocument();
    expect(screen.getByText(/sort By/i)).toBeInTheDocument();
  });

  it("generates a match when the button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>,
    );

    const generateButton = screen.getByRole("button", {
      name: /find my match/i,
    });
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });
  });

  it("resets match when reset button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>,
    );

    const generateButton = screen.getByRole("button", {
      name: /find my match/i,
    });
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByText("Found match")).not.toBeInTheDocument();
    });
  });

  it("changes page when pagination is clicked", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <SearchView />
      </BrowserRouter>,
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
