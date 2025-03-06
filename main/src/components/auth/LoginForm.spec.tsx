import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";
import "@testing-library/jest-dom/vitest";

describe("LoginForm", () => {
  it("renders the form correctly", () => {
    const mockOnSubmit = vi.fn();

    render(<LoginForm onSubmit={mockOnSubmit} error={null} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("displays the error when provided", () => {
    const mockOnSubmit = vi.fn();
    const errorMessage = "Test error message";

    render(<LoginForm onSubmit={mockOnSubmit} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("submits the form with entered values", async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} error={null} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.type(nameInput, "Test User");
    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith("Test User", "test@example.com");
  });

  it("validates required fields", async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} error={null} />);

    const submitButton = screen.getByRole("button", { name: /login/i });

    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
