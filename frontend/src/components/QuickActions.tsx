import React from "react";
import { QuickAction } from "../types/dashboard";
import { ADD_PRODUCT_PAGE_URL } from "../config";



interface QuickActionsProps {
  actions: QuickAction[];
  // optional mapping from action id to a single-character hotkey (e.g. { add_product: 'p' })
  hotkeys?: Record<string, string>;
  // whether to show the hotkey badges
  showHotkeys?: boolean;
  onAction?: (actionId: string) => void;
}

function QuickActions({ actions, hotkeys = {}, showHotkeys = false, onAction }: QuickActionsProps) {
  return (
    <section className="dashboard-section">
      <h2 className="section-title">Quick Actions</h2>
      <div className="action-grid">
        {actions.map((action) => {
          if (action.id === "add_product") {
            return (
              <a
                key={action.id}
                className="action-card no-underline"
                href={ADD_PRODUCT_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                    <h3>
                      Suggest a product {showHotkeys && hotkeys[action.id] && <small className="hotkey">({hotkeys[action.id].toUpperCase()})</small>}
                    </h3>
                  <p>{action.description}</p>
                </div>
              </a>
            );
          }
          return (
            <button
              key={action.id}
              className="action-card"
              onClick={() => (onAction ? onAction(action.id) : console.log(`Action: ${action.action}`))}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                  <h3>
                    {action.title} {showHotkeys && hotkeys[action.id] && <small className="hotkey">({hotkeys[action.id].toUpperCase()})</small>}
                  </h3>
                <p>{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;