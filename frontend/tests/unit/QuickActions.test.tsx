import { render, screen, fireEvent } from "@testing-library/react";
import QuickActions from "../../src/components/QuickActions";
import { QuickAction } from "../../src/types/dashboard";
import { ADD_PRODUCT_PAGE_URL } from "../../src/config";
import { describe, test, expect, vi, beforeEach } from "vitest";

const mockActions: QuickAction[] = [
  {
    id: "add_product",
    title: "Add Product",
    description: "Add a new product to your catalog",
    icon: "➕",
    action: "add", 
  },
  {
    id: "view_orders",
    title: "View Orders",
    description: "Check your customer orders",
    icon: "📦",
    action: "orders",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "See shop insights",
    icon: "📊",
    action: "stats",
  },
];

describe("QuickActions", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  test("renders section title", () => {
    render(<QuickActions actions={mockActions} />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
  });

  test("renders all actions", () => {
    render(<QuickActions actions={mockActions} />);

    expect(screen.getByText("Suggest a product")).toBeInTheDocument(); // special case
    expect(screen.getByText("View Orders")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  test("renders add_product action as a link", () => {
    render(<QuickActions actions={mockActions} />);

    const link = screen.getByText("Suggest a product").closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", ADD_PRODUCT_PAGE_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });

  test("renders non-add_product actions as buttons", () => {
    render(<QuickActions actions={mockActions} />);

    // "View Orders" should be inside a <button>
    const ordersButton = screen.getByText("View Orders").closest("button");
    expect(ordersButton).toBeInTheDocument();
  });

  test("clicking button actions triggers console.log", () => {
    render(<QuickActions actions={mockActions} />);

    fireEvent.click(screen.getByText("View Orders"));

    expect(console.log).toHaveBeenCalledWith("Action: orders");
  });

  test("does NOT call console.log when clicking the link action", () => {
    render(<QuickActions actions={mockActions} />);

    const link = screen.getByText("Suggest a product").closest("a");
    fireEvent.click(link!);

    // Should not log anything for the link version
    expect(console.log).not.toHaveBeenCalledWith("Action: add");
  });
});
