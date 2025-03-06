import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import api from "../services/fetchApi";
import { AuthContext } from "./AuthContext";
import { AuthProvider } from "./AuthProvider";

vi.mock("../services/fetchApi", () => ({
  default: {
    auth: {
      login: vi.fn().mockResolvedValue({}),
      logout: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.stubGlobal("localStorage", {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
});

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "Logged In" : "Logged Out"}
      </div>
      <div data-testid="user-name">{user?.name || "No User"}</div>
      <button onClick={() => login("Test User", "test@example.com")}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize with no user by default", () => {
    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status").textContent).toBe("Logged Out");
    expect(screen.getByTestId("user-name").textContent).toBe("No User");
    expect(localStorage.getItem).toHaveBeenCalledWith("user");
  });

  it("should initialize with user from localStorage if present", () => {
    const user = { name: "Stored User", email: "stored@example.com" };
    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(JSON.stringify(user));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status").textContent).toBe("Logged In");
    expect(screen.getByTestId("user-name").textContent).toBe("Stored User");
  });

  it("should handle login", async () => {
    vi.spyOn(localStorage, "getItem").mockReturnValueOnce(null);

    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(api.auth.login).toHaveBeenCalledWith(
        "Test User",
        "test@example.com",
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({ name: "Test User", email: "test@example.com" }),
      );
      expect(screen.getByTestId("auth-status").textContent).toBe("Logged In");
      expect(screen.getByTestId("user-name").textContent).toBe("Test User");
    });
  });
});
