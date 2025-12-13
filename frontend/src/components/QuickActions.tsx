import { QuickAction } from "../types/dashboard";
import { ADD_PRODUCT_PATH, ANALYTICS_PATH } from "../config";

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
            if (onAction) {
              return (
                <button
                  key={action.id}
                  className="action-card"
                  onClick={() => onAction(action.id)}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-content">
                    <h3>
                      Suggest a product {showHotkeys && hotkeys[action.id] && <small className="hotkey">({hotkeys[action.id].toUpperCase()})</small>}
                    </h3>
                    <p>{action.description}</p>
                  </div>
                </button>
              );
            }

            // fallback: preserve original external link behaviour when no handler
            return (
              <a
                key={action.id}
                className="action-card no-underline"
                href={ADD_PRODUCT_PATH}
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div className="action-icon" aria-hidden="true">
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3>
                    Suggest a product {showHotkeys && hotkeys[action.id] && <small className="hotkey">({hotkeys[action.id].toUpperCase()})</small>}
                  </h3>
                  <p>{action.description}</p>
                </div>
              </a>
            );
          }

          if ((action.id === "view_analytics") || action.action === "view_analytics" || action.action === "analytics") {
            if (onAction) {
              return (
                <button
                  key={action.id}
                  className="action-card"
                  onClick={() => onAction(action.id)}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-content">
                    <h3>
                      Sales Analytics {showHotkeys && hotkeys[action.id] && <small className="hotkey">({hotkeys[action.id].toUpperCase()})</small>}
                    </h3>
                    <p>{action.description}</p>
                  </div>
                </button>
              );
            }

            // fallback: preserve original external link behaviour when no handler
            return (
              <a
                key={action.id}
                className="action-card no-underline"
                href={ANALYTICS_PATH}
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3>
                    Sales Analytics {showHotkeys && hotkeys[action.id] && <small className="hotkey">({hotkeys[action.id].toUpperCase()})</small>}
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
              <div className="action-icon" aria-hidden="true">
                {action.icon}
              </div>
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
