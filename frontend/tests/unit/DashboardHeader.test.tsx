import { render, screen, fireEvent } from "@testing-library/react";
import DashboardHeader from "../../src/components/DashboardHeader";
import { DashboardStats } from "../../src/types/dashboard";
import { vi } from "vitest";

const mockStats: DashboardStats = {
  orders: {
    new_orders: 5,
    total_orders: 20,
    monthly_revenue: 1234.56,
    currency: "$",
  },
  products: {
    total_products: 42,
    active_products: 40,
    low_stock_alerts: 3,
  },
};

describe("DashboardHeader", () => {
  test("renders store name correctly", () => {
    render(
      <DashboardHeader
        storeInfo={{ name: "Nesma Store", currency: "$" }}
        stats={mockStats}
      />
    );

    expect(screen.getByText("Welcome back, Nesma Store!")).toBeInTheDocument();
  });

  test("falls back to 'Artisan' when store name is missing", () => {
    render(
      <DashboardHeader
        storeInfo={{ name: "", currency: "$" }}
        stats={mockStats}
      />
    );

    expect(screen.getByText("Welcome back, Artisan!")).toBeInTheDocument();
  });

  test("renders the correct stats", () => {
    render(
      <DashboardHeader
        storeInfo={{ name: "Shop", currency: "$" }}
        stats={mockStats}
      />
    );

    expect(screen.getByText("5")).toBeInTheDocument(); // new orders
    expect(screen.getByText("$1235")).toBeInTheDocument(); // monthly revenue rounded
    expect(screen.getByText("42")).toBeInTheDocument(); // total products
  });

  test("shows low stock alert when value > 0", () => {
    render(
      <DashboardHeader
        storeInfo={{ name: "Shop", currency: "$" }}
        stats={mockStats}
      />
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Low Stock")).toBeInTheDocument();
  });

  test("does NOT render low stock alert when value = 0", () => {
    const statsNoLowStock: DashboardStats = {
      ...mockStats,
      products: { total_products: 42, active_products: 40, low_stock_alerts: 0 },
    };

    render(
      <DashboardHeader
        storeInfo={{ name: "Shop", currency: "$" }}
        stats={statsNoLowStock}
      />
    );

    const lowStockLabel = screen.queryByText("Low Stock");
    expect(lowStockLabel).toBeNull();
  });

  test("renders the register button only when onRegister is provided", () => {
    const mockFn = vi.fn();

    render(
      <DashboardHeader
        storeInfo={{ name: "Shop", currency: "$" }}
        stats={mockStats}
        onRegister={mockFn}
      />
    );

    // Use a function matcher to allow for split emoji/text
    expect(
      screen.getByText((content, element) =>
        content.includes("Register New Vendor")
      )
    ).toBeInTheDocument();
  });

  test("calls onRegister when register button is clicked", () => {
    const mockFn = vi.fn();

    render(
      <DashboardHeader
        storeInfo={{ name: "Shop", currency: "$" }}
        stats={mockStats}
        onRegister={mockFn}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
