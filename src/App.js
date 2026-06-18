import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://sbidwhsnwdsvkbdwzphb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiaWR3aHNud2RzdmtiZHd6cGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzcyOTcsImV4cCI6MjA5NzIxMzI5N30.eCkIM3gKZCi7hY-ef9JQjRHHBZ-97VSVC2npQH6M26g"
);

const DEV_PATH = "/dev";

export default function App() {
  const isDevMode = window.location.pathname === DEV_PATH;
  const [view, setView] = useState(isDevMode ? "landing" : "waitlist");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (type) => {
    if (!formData.name || !formData.email) {
      setErrorMsg("Please enter your name and email.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase
        .from("Waitlist")
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          type: type
        }]);
      if (error) {
        setErrorMsg("Error: " + error.message);
        setLoading(false);
      } else {
        setSubmitted(true);
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg("Error: " + err.message);
      setLoading(false);
    }
  };

  const Logo = () => (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: "#FFFFFF", letterSpacing: -2, lineHeight: 1 }}>
        Your <span style={{ color: "#F4822A" }}>Tradie</span>
      </div>
      <div style={{ height: 4, background: "#F4822A", borderRadius: 2, margin: "10px auto 0", width: 200 }} />
      <div style={{ fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,0.35)", marginTop: 10, textTransform: "uppercase" }}>
        Australia's Tradie Network
      </div>
    </div>
  );

  const Wrapper = ({ children }) => (
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
      {children}
      <div style={{ marginTop: 48, fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
        © 2025 Your Tradie · Australia
      </div>
    </div>
  );

  // ---- PUBLIC WAITLIST ----
  if (view === "waitlist") {
    return (
      <Wrapper>
        <Logo />
        <div style={{ textAlign: "center", marginBottom: 48, maxWidth: 480 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.3, marginBottom: 10 }}>
            Get found. Get hired. Get rewarded.
          </div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            Connecting you with tradies.
          </div>
        </div>

        {!submitted ? (
          <div style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 420
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF", marginBottom: 6, textAlign: "center" }}>
              Join the Community
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>
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
                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
                  padding: "13px 16px", fontSize: 15, color: "#fff",
                  marginBottom: 12, outline: "none", boxSizing: "border-box"
                }}
              />
            ))}
            {errorMsg && (
              <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 10, textAlign: "center", padding: "8px", background: "rgba(255,107,107,0.1)", borderRadius: 8 }}>
                {errorMsg}
              </div>
            )}
            <button
              onClick={() => handleSubmit("waitlist")}
              disabled={loading}
              style={{
                width: "100%", background: loading ? "rgba(244,130,42,0.5)" : "#F4822A",
                border: "none", borderRadius: 10, padding: "14px", fontSize: 16,
                fontWeight: 800, color: "#fff", cursor: loading ? "default" : "pointer", marginTop: 4
              }}
            >
              {loading ? "Joining..." : "Join the Waitlist →"}
            </button>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 14 }}>
              No spam. No lead fees. Ever.
            </div>
          </div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(44,214,83,0.3)",
            borderRadius: 16, padding: "40px 28px", width: "100%", maxWidth: 420, textAlign: "center"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>You're on the list!</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              We'll be in touch the moment Your Tradie launches.
            </div>
          </div>
        )}
      </Wrapper>
    );
  }

  // ---- DEV: LANDING PAGE ----
  if (view === "landing") {
    return (
      <Wrapper>
        <Logo />
        {isDevMode && (
          <div style={{ fontSize: 11, color: "#F4822A", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24, marginTop: 4 }}>
            Dev Mode
          </div>
        )}
        <div style={{ textAlign: "center", marginBottom: 40, maxWidth: 480 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.3, marginBottom: 10 }}>
            Get found. Get hired. Get rewarded.
          </div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            Connecting you with tradies.
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: 420 }}>
          <button
            onClick={() => setView("tradie-onboarding")}
            style={{
              width: "100%", background: "#F4822A", border: "none",
              borderRadius: 12, padding: "20px", fontSize: 18,
              fontWeight: 800, color: "#fff", cursor: "pointer", marginBottom: 16
            }}
          >
            I'm a Tradie 🔨
          </button>
          <button
            onClick={() => setView("find-tradie")}
            style={{
              width: "100%", background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
              padding: "20px", fontSize: 18, fontWeight: 800,
              color: "#fff", cursor: "pointer"
            }}
          >
            Find a Tradie 🏠
          </button>
        </div>
      </Wrapper>
    );
  }

  // ---- DEV: TRADIE ONBOARDING (placeholder) ----
  if (view === "tradie-onboarding") {
    return (
      <Wrapper>
        <Logo />
        <div style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 420, textAlign: "center"
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Tradie Onboarding</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
            Step-by-step signup coming next session.
          </div>
          <button onClick={() => setView("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer" }}>
            ← Back
          </button>
        </div>
      </Wrapper>
    );
  }

  // ---- DEV: FIND A TRADIE (placeholder) ----
  if (view === "find-tradie") {
    return (
      <Wrapper>
        <Logo />
        <div style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 420, textAlign: "center"
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Find a Tradie</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
            Search and browse coming next session.
          </div>
          <button onClick={() => setView("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer" }}>
            ← Back
          </button>
        </div>
      </Wrapper>
    );
  }
}