import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginView from "../views/LoginView";
import { strings } from "../constants/strings";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("LoginView", () => {
  it("renders the login page correctly", () => {
    render(
      <BrowserRouter>
        <LoginView />
      </BrowserRouter>,
    );

    expect(screen.getByText(strings.header.logo)).toBeInTheDocument();
    expect(screen.getByText(strings.login.subtitle)).toBeInTheDocument();
    expect(screen.getByText(strings.login.text)).toBeInTheDocument();
  });
});
