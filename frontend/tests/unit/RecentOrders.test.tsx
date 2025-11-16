import { render, screen } from "@testing-library/react";
import RecentOrders from "../../src/components/RecentOrders";
import { RecentOrder } from "../../src/types/dashboard";
import { describe, test, expect } from "vitest";

const mockOrders: RecentOrder[] = [
  {
    id: 101,
    customer: "Alice Johnson",
    items_count: 3,
    total: 45.5,
    status: "completed",
    date: "2025-02-10",
  },
  {
    id: 102,
    customer: "Bob Smith",
    items_count: 1,
    total: 15.0,
    status: "pending",
    date: "2025-02-11",
  },
];

describe("RecentOrders", () => {
  test("renders section title", () => {
    render(<RecentOrders orders={mockOrders} currency="$" />);
    expect(screen.getByText("Recent Orders")).toBeInTheDocument();
  });

  test("renders all orders", () => {
    render(<RecentOrders orders={mockOrders} currency="$" />);

    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.getByText("#102")).toBeInTheDocument();

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
  });

  test("displays correct item counts", () => {
    render(<RecentOrders orders={mockOrders} currency="$" />);

    expect(screen.getByText("3 items")).toBeInTheDocument();
    expect(screen.getByText("1 items")).toBeInTheDocument();
  });

  test("displays correct totals with currency", () => {
    render(<RecentOrders orders={mockOrders} currency="$" />);

    expect(screen.getByText("$45.5")).toBeInTheDocument();
    expect(screen.getByText("$15")).toBeInTheDocument();
  });

  test("applies correct status CSS class", () => {
    render(<RecentOrders orders={mockOrders} currency="$" />);

    const completed = screen.getByText("completed");
    const pending = screen.getByText("pending");

    expect(completed).toHaveClass("status", "completed");
    expect(pending).toHaveClass("status", "pending");
  });

  test("renders empty list gracefully", () => {
    render(<RecentOrders orders={[]} currency="$" />);
    expect(screen.getByText("Recent Orders")).toBeInTheDocument();
    expect(screen.queryByText(/#\d+/)).toBeNull();
  });
});
