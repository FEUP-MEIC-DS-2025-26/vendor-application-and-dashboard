import React from "react";
import { QuickAction } from "../types/dashboard";

interface QuickActionsProps {
  actions: QuickAction[];
}

function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="dashboard-section">
      <h2 className="section-title">Quick Actions</h2>
      <div className="action-grid">
        {actions.map((action) => (
          <button 
            key={action.id} 
            className="action-card" 
            onClick={() => console.log(`Action: ${action.action}`)}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;