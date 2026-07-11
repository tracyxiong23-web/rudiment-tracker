import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Rudiment tracker crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
            padding: 24,
            textAlign: "center",
            background: "#F1EAD9",
            color: "#2B2620",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
          }}
        >
          <div style={{ fontSize: 40 }}>🥁</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Something went wrong</div>
          <div style={{ fontSize: 14, color: "#6B6252", maxWidth: 280, lineHeight: 1.5 }}>
            Your practice data is safe — it's saved on your device. Reloading usually fixes this.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              background: "#3A5A6B",
              color: "#F1EAD9",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
