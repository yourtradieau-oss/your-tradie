import React from "react";

export default function App() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#0D1B2A",
      flexDirection: "column",
      gap: 20
    }}>
      <div style={{
        fontSize: 48,
        fontWeight: 900,
        color: "#F4822A",
        fontFamily: "sans-serif"
      }}>Your Tradie</div>
      <div style={{
        fontSize: 18,
        color: "rgba(255,255,255,0.6)",
        fontFamily: "sans-serif"
      }}>Australia's Tradie Network</div>
      <div style={{
        fontSize: 14,
        color: "#2DC653",
        fontFamily: "sans-serif",
        marginTop: 20
      }}>✓ App is running successfully</div>
    </div>
  );
}
