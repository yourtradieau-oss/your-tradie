import React, { useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D1B2A",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      fontFamily: "sans-serif"
    }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{
          fontSize: 56,
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: -2,
          lineHeight: 1
        }}>
          Your <span style={{ color: "#F4822A" }}>Tradie</span>
        </div>
        <div style={{
          height: 4,
          background: "#F4822A",
          borderRadius: 2,
          margin: "10px auto 0",
          width: 240
        }}/>
        <div style={{
          fontSize: 11,
          letterSpacing: 4,
          color: "rgba(255,255,255,0.35)",
          marginTop: 10,
          textTransform: "uppercase"
        }}>
          Australia's Tradie Network
        </div>
      </div>

      {/* Taglines */}
      <div style={{
        textAlign: "center",
        marginBottom: 48,
        maxWidth: 480
      }}>
        <div style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1.3,
          marginBottom: 10
        }}>
          Get found. Get hired. Get rewarded.
        </div>
        <div style={{
          fontSize: 16,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.6
        }}>
          Connecting you with tradies.
        </div>
      </div>

      {/* Form */}
      {!submitted ? (
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: "32px 28px",
          width: "100%",
          maxWidth: 420
        }}>
          <div style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#FFFFFF",
            marginBottom: 6,
            textAlign: "center"
          }}>
            Join the Community
          </div>
          <div style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            marginBottom: 24
          }}>
            Be first when we launch in your area
          </div>

          {[
            { key: "name", placeholder: "Full name", type: "text" },
            { key: "email", placeholder: "Email address", type: "email" },
            { key: "phone", placeholder: "Phone number (optional)", type: "tel" }
          ].map(field => (
            <input
              key={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.key]}
              onChange={e => setFormData({...formData, [field.key]: e.target.value})}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "13px 16px",
                fontSize: 15,
                color: "#fff",
                marginBottom: 12,
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          ))}

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              background: "#F4822A",
              border: "none",
              borderRadius: 10,
              padding: "14px",
              fontSize: 16,
              fontWeight: 800,
              color: "#fff",
              cursor: "pointer",
              marginTop: 4
            }}
          >
            Join the Waitlist →
          </button>

          <div style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
            textAlign: "center",
            marginTop: 14
          }}>
            No spam. No lead fees. Ever.
          </div>
        </div>
      ) : (
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(44,214,83,0.3)",
          borderRadius: 16,
          padding: "40px 28px",
          width: "100%",
          maxWidth: 420,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 8
          }}>
            You're on the list!
          </div>
          <div style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6
          }}>
            We'll be in touch when Your Tradie launches in your area.
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 48,
        fontSize: 12,
        color: "rgba(255,255,255,0.2)",
        textAlign: "center"
      }}>
        © 2025 Your Tradie · Australia
      </div>

    </div>
  );
}