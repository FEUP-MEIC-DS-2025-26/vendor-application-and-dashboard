import React from "react";

interface ErrorScreenProps {
  error: string | null;
  onRetry: () => void;
}

function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="container">
      <div className="error-container">
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔌</div>
        <h2>Backend Connection Issue</h2>
        <p>{error || "Unable to connect to the backend server"}</p>
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.3)', 
          borderRadius: '12px', 
          padding: '16px', 
          marginBottom: '24px',
          textAlign: 'left',
          fontSize: '0.9rem'
        }}>
          <strong>💡 To fix this:</strong>
          <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Open a terminal in the <code>backend</code> folder</li>
            <li>Run: <code>uvicorn app.main:app --reload</code></li>
            <li>Wait for &#34;Uvicorn running on http://127.0.0.1:8000&#34;</li>
            <li>Click &#34;Try Again&#34; below</li>
          </ol>
        </div>
        <button onClick={onRetry} className="retry-btn">Try Again</button>
      </div>
    </div>
  );
}

export default ErrorScreen;