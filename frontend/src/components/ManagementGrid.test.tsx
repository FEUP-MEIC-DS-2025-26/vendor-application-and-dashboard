import { render, screen, fireEvent } from "@testing-library/react";
import ManagementGrid from "./ManagementGrid";
import { DashboardStats } from "../types/dashboard";
import { describe, test, expect, vi, beforeEach } from "vitest";

const mockStats: DashboardStats = {
  orders: {
    new_orders: 5,
    total_orders: 20,
    monthly_revenue: 1500,
    currency: "$",
  },
  products: {
    total_products: 50,
    active_products: 40,
    low_stock_alerts: 2,
  },
};

describe("ManagementGrid", () => {
  // silence console.log output during tests
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  test("renders the section title", () => {
    render(<ManagementGrid stats={mockStats} />);
    expect(screen.getByText("Manage Your Shop")).toBeInTheDocument();
  });

  test("renders all management cards", () => {
    render(<ManagementGrid stats={mockStats} />);

    expect(screen.getByText("Product Catalog")).toBeInTheDocument();
    expect(screen.getByText("Order Management")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Shop Settings")).toBeInTheDocument();
  });

  test("displays active product count", () => {
    render(<ManagementGrid stats={mockStats} />);
    expect(
      screen.getByText(/40 active/i)
    ).toBeInTheDocument();
  });

  test("clicking Product Catalog triggers console.log", () => {
    render(<ManagementGrid stats={mockStats} />);

    fireEvent.click(screen.getByText("Product Catalog"));

    expect(console.log).toHaveBeenCalledWith("Products");
  });

  test("clicking Order Management triggers console.log", () => {
    render(<ManagementGrid stats={mockStats} />);

    fireEvent.click(screen.getByText("Order Management"));

    expect(console.log).toHaveBeenCalledWith("Orders");
  });

  test("clicking Analytics triggers console.log", () => {
    render(<ManagementGrid stats={mockStats} />);

    fireEvent.click(screen.getByText("Analytics"));

    expect(console.log).toHaveBeenCalledWith("Analytics");
  });

  test("clicking Shop Settings triggers console.log", () => {
    render(<ManagementGrid stats={mockStats} />);

    fireEvent.click(screen.getByText("Shop Settings"));

    expect(console.log).toHaveBeenCalledWith("Settings");
  });
});
