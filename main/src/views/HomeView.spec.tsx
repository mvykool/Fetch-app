import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { strings } from "../constants/strings";
import HomeView from "./HomeView";
import "@testing-library/jest-dom/vitest";

const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("HomeView", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("renders the home page correctly", () => {
    render(
      <BrowserRouter>
        <HomeView />
      </BrowserRouter>,
    );

    expect(screen.getByText(strings.home.heading)).toBeInTheDocument();
    expect(screen.getByText(strings.home.paragraph)).toBeInTheDocument();
    expect(screen.getByText(strings.home.searchBtn)).toBeInTheDocument();

    const heroImage = screen.getByAltText("hero-image");
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src", "/hero.png");
  });

  it("navigates to search page when button is clicked", async () => {
    render(
      <BrowserRouter>
        <HomeView />
      </BrowserRouter>,
    );

    const user = userEvent.setup();
    const searchButton = screen.getByText(strings.home.searchBtn);

    await user.click(searchButton);

    expect(mockNavigate).toHaveBeenCalledWith("/search");
  });
});
