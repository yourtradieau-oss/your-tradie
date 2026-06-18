import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://sbidwhsnwdsvkbdwzphb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiaWR3aHNud2RzdmtiZHd6cGhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzcyOTcsImV4cCI6MjA5NzIxMzI5N30.eCkIM3gKZCi7hY-ef9JQjRHHBZ-97VSVC2npQH6M26g"
);

const DEV_PATH = "/dev";

const TRADES = [
  "Electrician", "Plumber", "Builder", "Carpenter", "Painter",
  "Tiler", "Landscaper", "Roofer", "Plasterer", "Concreter",
  "Air Conditioning", "Locksmith", "Glazier", "Pest Control",
  "Handyman", "Other"
];

const AREAS = [
  "Brisbane North", "Brisbane South", "Brisbane East", "Brisbane West",
  "Moreton Bay", "Caboolture", "Bribie Island", "Redcliffe",
  "Sunshine Coast", "Gold Coast", "Ipswich", "Logan", "Other"
];

export default function App() {
  const isDevMode = window.location.pathname === DEV_PATH;
  const [view, setView] = useState(isDevMode ? "landing" : "waitlist");

  // Waitlist form state
  const [waitlistData, setWaitlistData] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Tradie onboarding state
  const [step, setStep] = useState(1);
  const [tradieData, setTradieData] = useState({
    fullName: "",
    businessName: "",
    primaryTrade: "",
    specialties: [],
    primaryArea: "",
    secondaryAreas: [],
    licenceNumber: "",
    abn: "",
    photo: null
  });
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const handleWaitlistSubmit = async () => {
    if (!waitlistData.name || !waitlistData.email) {
      setErrorMsg("Please enter your name and email.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase
        .from("Waitlist")
        .insert([{
          name: waitlistData.name,
          email: waitlistData.email,
          phone: waitlistData.phone,
          type: "waitlist"
        }]);
      if (error) { setErrorMsg("Error: " + error.message); setLoading(false); }
      else { setSubmitted(true); setLoading(false); }
    } catch (err) {
      setErrorMsg("Error: " + err.message); setLoading(false);
    }
  };

  const addSpecialty = () => {
    if (specialtyInput.trim() && tradieData.specialties.length < 3) {
      setTradieData({ ...tradieData, specialties: [...tradieData.specialties, specialtyInput.trim()] });
      setSpecialtyInput("");
    }
  };

  const removeSpecialty = (i) => {
    setTradieData({ ...tradieData, specialties: tradieData.specialties.filter((_, idx) => idx !== i) });
  };

  const toggleSecondaryArea = (area) => {
    const areas = tradieData.secondaryAreas;
    if (areas.includes(area)) {
      setTradieData({ ...tradieData, secondaryAreas: areas.filter(a => a !== area) });
    } else {
      setTradieData({ ...tradieData, secondaryAreas: [...areas, area] });
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
      minHeight: "100vh", background: "#0D1B2A", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", fontFamily: "sans-serif"
    }}>
      {children}
      <div style={{ marginTop: 48, fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
        © 2025 Your Tradie · Australia
      </div>
    </div>
  );

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
    padding: "13px 16px", fontSize: 15, color: "#fff",
    marginBottom: 12, outline: "none", boxSizing: "border-box"
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 420
  };

  const ProgressBar = ({ current, total }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Step {current} of {total}</span>
        <span style={{ fontSize: 13, color: "#F4822A" }}>{Math.round((current / total) * 100)}%</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 6 }}>
        <div style={{ background: "#F4822A", borderRadius: 4, height: 6, width: `${(current / total) * 100}%`, transition: "width 0.3s" }} />
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
          <div style={cardStyle}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF", marginBottom: 6, textAlign: "center" }}>Join the Community</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Be first when we launch in your area</div>
            {[
              { key: "name", placeholder: "Full name", type: "text" },
              { key: "email", placeholder: "Email address", type: "email" },
              { key: "phone", placeholder: "Phone number (optional)", type: "tel" }
            ].map(field => (
              <input key={field.key} type={field.type} placeholder={field.placeholder}
                value={waitlistData[field.key]}
                onChange={e => setWaitlistData({ ...waitlistData, [field.key]: e.target.value })}
                style={inputStyle} />
            ))}
            {errorMsg && <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 10, textAlign: "center", padding: "8px", background: "rgba(255,107,107,0.1)", borderRadius: 8 }}>{errorMsg}</div>}
            <button onClick={handleWaitlistSubmit} disabled={loading}
              style={{ width: "100%", background: loading ? "rgba(244,130,42,0.5)" : "#F4822A", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 800, color: "#fff", cursor: loading ? "default" : "pointer", marginTop: 4 }}>
              {loading ? "Joining..." : "Join the Waitlist →"}
            </button>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 14 }}>No spam. No lead fees. Ever.</div>
          </div>
        ) : (
          <div style={{ ...cardStyle, border: "1px solid rgba(44,214,83,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>You're on the list!</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>We'll be in touch the moment Your Tradie launches.</div>
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
        {isDevMode && <div style={{ fontSize: 11, color: "#F4822A", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24, marginTop: 4 }}>Dev Mode</div>}
        <div style={{ textAlign: "center", marginBottom: 40, maxWidth: 480 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.3, marginBottom: 10 }}>Get found. Get hired. Get rewarded.</div>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Connecting you with tradies.</div>
        </div>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <button onClick={() => { setStep(1); setView("tradie-onboarding"); }}
            style={{ width: "100%", background: "#F4822A", border: "none", borderRadius: 12, padding: "20px", fontSize: 18, fontWeight: 800, color: "#fff", cursor: "pointer", marginBottom: 16 }}>
            I'm a Tradie 🔨
          </button>
          <button onClick={() => setView("find-tradie")}
            style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "20px", fontSize: 18, fontWeight: 800, color: "#fff", cursor: "pointer" }}>
            Find a Tradie 🏠
          </button>
        </div>
      </Wrapper>
    );
  }

  // ---- DEV: TRADIE ONBOARDING ----
  if (view === "tradie-onboarding") {
    if (onboardingComplete) {
      return (
        <Wrapper>
          <Logo />
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Profile Launched!</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 24 }}>
              Welcome to Your Tradie, {tradieData.fullName.split(" ")[0]}!
            </div>
            <button onClick={() => { setView("landing"); setOnboardingComplete(false); setStep(1); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer" }}>
              ← Back to home
            </button>
          </div>
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <Logo />
        <div style={cardStyle}>
          <ProgressBar current={step} total={5} />

          {/* STEP 1 — Name */}
          {step === 1 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>About You</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Let's start with the basics</div>
              <input style={inputStyle} placeholder="Full name" value={tradieData.fullName}
                onChange={e => setTradieData({ ...tradieData, fullName: e.target.value })} />
              <input style={inputStyle} placeholder="Business name (optional)" value={tradieData.businessName}
                onChange={e => setTradieData({ ...tradieData, businessName: e.target.value })} />
              <button onClick={() => { if (tradieData.fullName) setStep(2); }}
                style={{ width: "100%", background: tradieData.fullName ? "#F4822A" : "rgba(244,130,42,0.3)", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 800, color: "#fff", cursor: tradieData.fullName ? "pointer" : "default", marginTop: 4 }}>
                Next →
              </button>
            </>
          )}

          {/* STEP 2 — Trade + Specialties */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>Your Trade</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>What do you do?</div>
              <select value={tradieData.primaryTrade}
                onChange={e => setTradieData({ ...tradieData, primaryTrade: e.target.value })}
                style={{ ...inputStyle, marginBottom: 16 }}>
                <option value="">Select your primary trade</option>
                {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                Specialties (up to 3) — e.g. Solar, Renovations, EV Charging
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Add a specialty"
                  value={specialtyInput} onChange={e => setSpecialtyInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSpecialty()} />
                <button onClick={addSpecialty}
                  style={{ background: "#F4822A", border: "none", borderRadius: 10, padding: "0 16px", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 18 }}>+</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {tradieData.specialties.map((s, i) => (
                  <div key={i} style={{ background: "rgba(244,130,42,0.2)", border: "1px solid rgba(244,130,42,0.4)", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#F4822A", display: "flex", alignItems: "center", gap: 6 }}>
                    {s}
                    <span onClick={() => removeSpecialty(i)} style={{ cursor: "pointer", opacity: 0.6 }}>×</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer" }}>
                  ← Back
                </button>
                <button onClick={() => { if (tradieData.primaryTrade) setStep(3); }}
                  style={{ flex: 2, background: tradieData.primaryTrade ? "#F4822A" : "rgba(244,130,42,0.3)", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 800, color: "#fff", cursor: tradieData.primaryTrade ? "pointer" : "default" }}>
                  Next →
                </button>
              </div>
            </>
          )}

          {/* STEP 3 — Service Areas */}
          {step === 3 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>Service Areas</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Where do you work?</div>
              <select value={tradieData.primaryArea}
                onChange={e => setTradieData({ ...tradieData, primaryArea: e.target.value })}
                style={{ ...inputStyle, marginBottom: 16 }}>
                <option value="">Select your primary area</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>

              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Also service (select all that apply)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {AREAS.filter(a => a !== tradieData.primaryArea).map(area => (
                  <div key={area} onClick={() => toggleSecondaryArea(area)}
                    style={{
                      background: tradieData.secondaryAreas.includes(area) ? "rgba(244,130,42,0.2)" : "rgba(255,255,255,0.05)",
                      border: tradieData.secondaryAreas.includes(area) ? "1px solid rgba(244,130,42,0.4)" : "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 20, padding: "6px 14px", fontSize: 13,
                      color: tradieData.secondaryAreas.includes(area) ? "#F4822A" : "rgba(255,255,255,0.5)",
                      cursor: "pointer"
                    }}>
                    {area}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(2)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer" }}>
                  ← Back
                </button>
                <button onClick={() => { if (tradieData.primaryArea) setStep(4); }}
                  style={{ flex: 2, background: tradieData.primaryArea ? "#F4822A" : "rgba(244,130,42,0.3)", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 800, color: "#fff", cursor: tradieData.primaryArea ? "pointer" : "default" }}>
                  Next →
                </button>
              </div>
            </>
          )}

          {/* STEP 4 — Licence + ABN */}
          {step === 4 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>Credentials</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Licence number and/or ABN</div>
              <input style={inputStyle} placeholder="Licence number (if applicable)"
                value={tradieData.licenceNumber}
                onChange={e => setTradieData({ ...tradieData, licenceNumber: e.target.value })} />
              <input style={inputStyle} placeholder="ABN"
                value={tradieData.abn}
                onChange={e => setTradieData({ ...tradieData, abn: e.target.value })} />
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 16, textAlign: "center" }}>
                At least one is required to go live
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(3)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer" }}>
                  ← Back
                </button>
                <button onClick={() => { if (tradieData.licenceNumber || tradieData.abn) setStep(5); }}
                  style={{ flex: 2, background: (tradieData.licenceNumber || tradieData.abn) ? "#F4822A" : "rgba(244,130,42,0.3)", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 800, color: "#fff", cursor: (tradieData.licenceNumber || tradieData.abn) ? "pointer" : "default" }}>
                  Next →
                </button>
              </div>
            </>
          )}

          {/* STEP 5 — Photo */}
          {step === 5 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>Profile Photo</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Add a photo or logo</div>

              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.07)",
                  border: "2px dashed rgba(255,255,255,0.2)", margin: "0 auto 16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36, cursor: "pointer"
                }}
                  onClick={() => document.getElementById("photo-upload").click()}>
                  {tradieData.photo ? "📷" : "👤"}
                </div>
                <input id="photo-upload" type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => setTradieData({ ...tradieData, photo: e.target.files[0] })} />
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                  {tradieData.photo ? tradieData.photo.name : "Tap to upload"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(4)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer" }}>
                  ← Back
                </button>
                <button onClick={() => setOnboardingComplete(true)}
                  style={{ flex: 2, background: "#F4822A", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 800, color: "#fff", cursor: "pointer" }}>
                  Launch My Profile 🚀
                </button>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 12 }}>
                You can add a photo later
              </div>
            </>
          )}
        </div>
        <button onClick={() => setView("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 12, cursor: "pointer", marginTop: 16 }}>
          ← Back to home
        </button>
      </Wrapper>
    );
  }

  // ---- DEV: FIND A TRADIE ----
  if (view === "find-tradie") {
    return (
      <Wrapper>
        <Logo />
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Find a Tradie</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Search and browse coming next session.</div>
          <button onClick={() => setView("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer" }}>← Back</button>
        </div>
      </Wrapper>
    );
  }
}