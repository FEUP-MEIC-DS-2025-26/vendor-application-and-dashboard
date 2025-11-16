import { render, screen, fireEvent } from "@testing-library/react";
import ErrorScreen from "../../src/components/ErrorScreen";
import { describe, test, expect, vi } from "vitest";

describe("ErrorScreen Component", () => {
  test("renders default error message when error prop is null", () => {
    render(<ErrorScreen error={null} onRetry={() => {}} />);

    expect(
      screen.getByText("Unable to connect to the backend server")
    ).toBeInTheDocument();
  });

  test("renders a custom error message", () => {
    render(<ErrorScreen error="Custom backend error" onRetry={() => {}} />);

    expect(screen.getByText("Custom backend error")).toBeInTheDocument();
  });

  test("renders troubleshooting steps", () => {
    render(<ErrorScreen error={null} onRetry={() => {}} />);

    expect(screen.getByText("💡 To fix this:")).toBeInTheDocument();
    expect(screen.getByText(/uvicorn app.main:app --reload/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Uvicorn running on http:\/\/127.0.0.1:8000/i)
    ).toBeInTheDocument();
  });

  test("renders emoji and title", () => {
    render(<ErrorScreen error={null} onRetry={() => {}} />);

    expect(screen.getByText("🔌")).toBeInTheDocument();
    expect(screen.getByText("Backend Connection Issue")).toBeInTheDocument();
  });

  test("calls onRetry when 'Try Again' button is clicked", () => {
    const mockRetry = vi.fn();

    render(<ErrorScreen error={null} onRetry={mockRetry} />);

    fireEvent.click(screen.getByText("Try Again"));

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
