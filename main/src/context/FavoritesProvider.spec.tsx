import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { FavoritesContext } from "./FavoritesContext";
import { FavoritesProvider } from "./FavoritesProvider";
import { Dog } from "../types";
import "@testing-library/jest-dom/vitest";

vi.stubGlobal("localStorage", {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
});

const TestComponent = () => {
  const { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites } =
    useContext(FavoritesContext);

  return (
    <div>
      <div data-testid="favorites-count">{favorites.length}</div>
      <ul data-testid="favorites-list">
        {favorites.map((dog) => (
          <li key={dog.id} data-testid={`favorite-${dog.id}`}>
            {dog.name}
            <button onClick={() => removeFavorite(dog.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button
        data-testid="add-button"
        onClick={() =>
          addFavorite({
            id: "dog1",
            name: "Rex",
            breed: "German Shepherd",
            age: 3,
            img: "dog1.jpg",
            zip_code: "12345",
          })
        }
      >
        Add Dog
      </button>
      <button
        data-testid="add-different-button"
        onClick={() =>
          addFavorite({
            id: "dog2",
            name: "Buddy",
            breed: "Golden Retriever",
            age: 2,
            img: "dog2.jpg",
            zip_code: "67890",
          })
        }
      >
        Add Different Dog
      </button>
      <div data-testid="is-favorite">
        {isFavorite("dog1") ? "Is Favorite" : "Not Favorite"}
      </div>
      <button data-testid="clear-button" onClick={clearFavorites}>
        Clear Favorites
      </button>
    </div>
  );
};

describe("FavoritesProvider", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize with empty favorites by default", () => {
    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(null);

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>,
    );

    expect(screen.getByTestId("favorites-count").textContent).toBe("0");
    expect(localStorage.getItem).toHaveBeenCalledWith("favorites");
  });

  it("should initialize with favorites from localStorage if present", () => {
    const storedFavorites: Dog[] = [
      {
        id: "dog1",
        name: "Rex",
        breed: "German Shepherd",
        age: 3,
        img: "dog1.jpg",
        zip_code: "12345",
      },
    ];

    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(
      JSON.stringify(storedFavorites),
    );

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>,
    );

    expect(screen.getByTestId("favorites-count").textContent).toBe("1");
    expect(screen.queryByTestId("favorite-dog1")).toBeTruthy();
  });

  it("should add a dog to favorites", async () => {
    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(null);
    const user = userEvent.setup();

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>,
    );

    expect(screen.getByTestId("favorites-count").textContent).toBe("0");

    await user.click(screen.getByTestId("add-button"));

    expect(screen.getByTestId("favorites-count").textContent).toBe("1");
    expect(screen.queryByTestId("favorite-dog1")).toBeTruthy();
    expect(screen.getByTestId("is-favorite").textContent).toBe("Is Favorite");
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it("should not add the same dog twice", async () => {
    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(null);
    const user = userEvent.setup();

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>,
    );

    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("favorites-count").textContent).toBe("1");

    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("favorites-count").textContent).toBe("1");
  });

  it("should add different dogs", async () => {
    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(null);
    const user = userEvent.setup();

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>,
    );

    await user.click(screen.getByTestId("add-button"));
    await user.click(screen.getByTestId("add-different-button"));

    expect(screen.getByTestId("favorites-count").textContent).toBe("2");
    expect(screen.queryByTestId("favorite-dog1")).toBeTruthy();
    expect(screen.queryByTestId("favorite-dog2")).toBeTruthy();
  });

  it("should remove a dog from favorites", async () => {
    const storedFavorites: Dog[] = [
      {
        id: "dog1",
        name: "Rex",
        breed: "German Shepherd",
        age: 3,
        img: "dog1.jpg",
        zip_code: "12345",
      },
    ];

    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(
      JSON.stringify(storedFavorites),
    );
    const user = userEvent.setup();

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>,
    );

    expect(screen.getByTestId("favorites-count").textContent).toBe("1");

    await user.click(screen.getByText("Remove"));

    expect(screen.getByTestId("favorites-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite").textContent).toBe("Not Favorite");
    expect(localStorage.setItem).toHaveBeenCalledWith("favorites", "[]");
  });

  it("should clear all favorites", async () => {
    const storedFavorites: Dog[] = [
      {
        id: "dog1",
        name: "Rex",
        breed: "German Shepherd",
        age: 3,
        img: "dog1.jpg",
        zip_code: "12345",
      },
      {
        id: "dog2",
        name: "Buddy",
        breed: "Golden Retriever",
        age: 2,
        img: "dog2.jpg",
        zip_code: "67890",
      },
    ];

    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(
      JSON.stringify(storedFavorites),
    );
    const user = userEvent.setup();

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>,
    );

    expect(screen.getByTestId("favorites-count").textContent).toBe("2");

    await user.click(screen.getByTestId("clear-button"));

    expect(screen.getByTestId("favorites-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite").textContent).toBe("Not Favorite");
    expect(localStorage.setItem).toHaveBeenCalledWith("favorites", "[]");
  });
});
