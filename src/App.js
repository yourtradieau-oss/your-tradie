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
  "Handyman", "Cabinet Maker", "Bricklayer", "Welder",
  "Solar Installer", "Flooring Specialist", "Other"
];

const SPECIALTIES = [
  "Solar Panels", "EV Charging", "Switchboards", "Renovations",
  "New Builds", "Decking", "Fencing", "Retaining Walls",
  "Bathroom Renovations", "Kitchen Renovations", "Underground", "Mosaics",
  "Roof Repairs", "Guttering", "Skylights", "Air Con Installation",
  "Air Con Servicing", "Hot Water Systems", "Gas Fitting", "Waterproofing",
  "Rendering", "Insulation", "Damp Proofing", "Asbestos Removal"
];

const AREAS = [
  "Bribie Island", "Caboolture", "Redcliffe", "Morayfield",
  "Burpengary", "Narangba", "North Lakes", "Strathpine",
  "Chermside", "Brisbane CBD", "Brisbane North", "Brisbane South",
  "Brisbane East", "Brisbane West", "Ipswich", "Logan",
  "Sunshine Coast", "Gold Coast", "Toowoomba", "Other"
];

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
  padding: "13px 16px", fontSize: 15, color: "#fff",
  marginBottom: 12, outline: "none", boxSizing: "border-box",
  fontFamily: "sans-serif"
};

const cardStyle = {
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 440
};

const btnPrimary = (disabled) => ({
  flex: 2, background: disabled ? "rgba(244,130,42,0.3)" : "#F4822A",
  border: "none", borderRadius: 10, padding: "14px", fontSize: 16,
  fontWeight: 800, color: "#fff", cursor: disabled ? "default" : "pointer"
});

const btnSecondary = {
  flex: 1, background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
  padding: "14px", fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer"
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

const Tag = ({ label, onRemove, pending }) => (
  <div style={{
    background: pending ? "rgba(255,255,255,0.05)" : "rgba(244,130,42,0.2)",
    border: pending ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(244,130,42,0.4)",
    borderRadius: 20, padding: "4px 12px", fontSize: 13,
    color: pending ? "rgba(255,255,255,0.4)" : "#F4822A",
    display: "flex", alignItems: "center", gap: 6
  }}>
    {label}{pending && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>pending</span>}
    <span onClick={onRemove} style={{ cursor: "pointer", opacity: 0.6 }}>×</span>
  </div>
);

const SearchSelect = ({ items, selected, onAdd, placeholder, max, onAddCustom }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = items.filter(i =>
    i.toLowerCase().includes(search.toLowerCase()) && !selected.includes(i)
  );

  const handleKey = (e) => {
    if (e.key === "Enter" && search.trim()) {
      if (filtered.length > 0) onAdd(filtered[0]);
      else onAddCustom(search.trim());
      setSearch("");
      setOpen(false);
    }
  };

  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <input
        style={{ ...inputStyle, marginBottom: 0 }}
        placeholder={max && selected.length >= max ? `Max ${max} selected` : placeholder}
        value={search}
        disabled={max && selected.length >= max}
        onChange={e => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKey}
      />
      {open && search.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
          background: "#1a2d42", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10, maxHeight: 200, overflowY: "auto", marginTop: 4
        }}>
          {filtered.map(item => (
            <div key={item} onMouseDown={() => { onAdd(item); setSearch(""); setOpen(false); }}
              style={{ padding: "10px 16px", fontSize: 14, color: "#fff", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              onMouseEnter={e => e.target.style.background = "rgba(244,130,42,0.1)"}
              onMouseLeave={e => e.target.style.background = "transparent"}>
              {item}
            </div>
          ))}
          {filtered.length === 0 && search.trim() && (
            <div onMouseDown={() => { onAddCustom(search.trim()); setSearch(""); setOpen(false); }}
              style={{ padding: "10px 16px", fontSize: 14, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
              Add "{search}" as custom →
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PhoneMockup = () => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div style={{
      width: 240, height: 500, background: "#fff", borderRadius: 40,
      padding: 8, position: "relative", boxShadow: "0 8px 30px rgba(0,0,0,0.35)"
    }}>
      <div style={{ border: "5px solid #1a1a1a", borderRadius: 32, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{
          position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
          width: 70, height: 18, background: "#1a1a1a", borderRadius: "0 0 12px 12px", zIndex: 2
        }} />
        <div style={{ background: "#0D1B2A", padding: "30px 16px 16px" }}>
          <div style={{ fontSize: 10, color: "#F4822A", fontWeight: 800, letterSpacing: 1, marginBottom: 10 }}>YOUR TRADIE</div>
          <div style={{ fontSize: 17, color: "#fff", fontWeight: 800, lineHeight: 1.25, marginBottom: 6 }}>Find a trusted tradie near you</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Verified · No lead fees · Real reviews</div>
          <div style={{ background: "#fff", borderRadius: 8, padding: "9px 11px", fontSize: 10, color: "#888", marginBottom: 8 }}>Search trade, name, suburb...</div>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "7px 9px", fontSize: 9, color: "#fff" }}>All trades</div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "7px 9px", fontSize: 9, color: "#fff" }}>All areas</div>
          </div>
        </div>
        <div style={{ background: "#F5F5F0", padding: 14, flex: 1, overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <div style={{ flex: 1, background: "#fff", border: "1.5px dashed #F4822A", borderRadius: 10, padding: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "#222" }}>Working Area</div>
              <div style={{ fontSize: 7, color: "#888" }}>Who's working near you</div>
            </div>
            <div style={{ flex: 1, background: "#F4822A", borderRadius: 10, padding: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>Post a Job</div>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,0.8)" }}>Get tradies to you</div>
            </div>
          </div>
          <div style={{ fontSize: 8, color: "#888", marginBottom: 8 }}>5 tradies found</div>
          <div style={{ background: "#fff", borderRadius: 10, padding: 10, marginBottom: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 11, color: "#222", fontWeight: 800 }}>Dave Kowalski</div>
            <div style={{ fontSize: 9, color: "#F4822A", marginBottom: 3 }}>Electrician · Redcliffe</div>
            <div style={{ fontSize: 8, color: "#888" }}>4.9 stars · 87 reviews</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, padding: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 11, color: "#222", fontWeight: 800 }}>Mel Torres</div>
            <div style={{ fontSize: 9, color: "#F4822A" }}>Plumber · Bribie Island</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", padding: "10px 8px" }}>
          {[
            { icon: "📊", label: "Dashboard" },
            { icon: "🔨", label: "Jobs" },
            { icon: "💬", label: "Messages" },
            { icon: "👤", label: "Account" }
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{item.icon}</div>
              <div style={{ fontSize: 7, color: "#888", marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const NavBar = ({ active }) => {
  const icons = ["chart-bar", "briefcase", "message-circle", "user"];
  return (
    <div style={{ background: "#fff", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-around", padding: 7, flexShrink: 0 }}>
      {icons.map(icon => (
        <i key={icon} className={`ti ti-${icon}`} style={{ fontSize: 13, color: icon === active ? "#F4822A" : "#ccc" }} aria-hidden="true"></i>
      ))}
    </div>
  );
};

const FeaturePhoneFrame = ({ children, label }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{
      width: 150, height: 380, background: "#fff", borderRadius: 26,
      padding: 6, margin: "0 auto", boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
    }}>
      <div style={{ border: "4px solid #1a1a1a", borderRadius: 20, height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{
          position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)",
          width: 40, height: 9, background: "#1a1a1a", borderRadius: "0 0 7px 7px", zIndex: 2
        }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 10, fontWeight: 600 }}>{label}</div>
  </div>
);

const GetSeenSection = () => (
 <div style={{ width: "100%", maxWidth: 800, margin: "0 auto", padding: "50px 20px" }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4, textAlign: "center" }}>Get seen</div>
    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 28, textAlign: "center" }}>Homeowners find you by trade and area — your work speaks for itself</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>

      <FeaturePhoneFrame label="Find tradies near you">
        <div style={{ background: "#0D1B2A", padding: "20px 9px 7px" }}>
          <div style={{ fontSize: 6, color: "#F4822A", fontWeight: 800, letterSpacing: 0.5 }}>WORKING AREA</div>
          <div style={{ fontSize: 9, color: "#fff", fontWeight: 800, marginTop: 2 }}>Tradies near Brisbane</div>
        </div>
        <div style={{ height: 80, background: "#E5E9E0", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "35%", height: "100%", background: "#C9DCEA", borderRadius: "50% 0 0 50%" }} />
          <div style={{ position: "absolute", top: "22%", left: "25%", width: 11, height: 11, background: "#fff", border: "2px solid #F4822A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5 }}>⚡</div>
          <div style={{ position: "absolute", top: "55%", left: "48%", width: 11, height: 11, background: "#fff", border: "2px solid #1D9E75", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5 }}>🔧</div>
          <div style={{ position: "absolute", top: "35%", left: "65%", width: 11, height: 11, background: "#fff", border: "2px solid #D4537E", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5 }}>🎨</div>
        </div>
        <div style={{ padding: 7, flex: 1, background: "#F8F8F6", overflow: "hidden" }}>
          <div style={{ fontSize: 6, color: "#888", marginBottom: 4 }}>3 tradies near you</div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 5, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: "#F4822A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, color: "#fff", fontWeight: 800 }}>DK</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>Dave Kowalski</div>
              <div style={{ fontSize: 5, color: "#F4822A" }}>Electrician · Redcliffe</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 5, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, color: "#fff", fontWeight: 800 }}>MT</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>Mel Torres</div>
              <div style={{ fontSize: 5, color: "#F4822A" }}>Plumber · Bribie Island</div>
            </div>
          </div>
        </div>
        <NavBar active="chart-bar" />
      </FeaturePhoneFrame>

      <FeaturePhoneFrame label="Verified profile">
        <div style={{ background: "#0D1B2A", padding: "22px 9px 10px", textAlign: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F4822A", margin: "0 auto 5px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 800 }}>DK</div>
          <div style={{ fontSize: 9, color: "#fff", fontWeight: 800 }}>Dave Kowalski</div>
          <div style={{ fontSize: 7, color: "#F4822A" }}>Electrician · Redcliffe</div>
        </div>
        <div style={{ padding: 7, flex: 1, background: "#F8F8F6" }}>
          <div style={{ background: "#E1F5EE", borderRadius: 5, padding: 5, display: "flex", alignItems: "center", gap: 3, marginBottom: 5 }}>
            <i className="ti ti-circle-check" style={{ color: "#0F6E56", fontSize: 9 }} aria-hidden="true"></i>
            <span style={{ fontSize: 6, color: "#0F6E56", fontWeight: 800 }}>Licence verified</span>
          </div>
          <div style={{ background: "#E1F5EE", borderRadius: 5, padding: 5, display: "flex", alignItems: "center", gap: 3, marginBottom: 6 }}>
            <i className="ti ti-circle-check" style={{ color: "#0F6E56", fontSize: 9 }} aria-hidden="true"></i>
            <span style={{ fontSize: 6, color: "#0F6E56", fontWeight: 800 }}>ABN verified</span>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 6 }}>
            <div style={{ fontSize: 5, color: "#555", lineHeight: 1.5 }}>Licensed electrician working on switchboards, EV charging and renovations.</div>
          </div>
        </div>
        <NavBar active="chart-bar" />
      </FeaturePhoneFrame>

      <FeaturePhoneFrame label="Show what you do">
        <div style={{ background: "#0D1B2A", padding: "20px 9px 8px" }}>
          <div style={{ fontSize: 8, color: "#fff", fontWeight: 800 }}>Specialties</div>
        </div>
        <div style={{ padding: 7, flex: 1, background: "#F8F8F6" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
            <span style={{ background: "#FAEEDA", color: "#854F0B", fontSize: 6, padding: "3px 7px", borderRadius: 8 }}>Solar</span>
            <span style={{ background: "#FAEEDA", color: "#854F0B", fontSize: 6, padding: "3px 7px", borderRadius: 8 }}>Switchboards</span>
            <span style={{ background: "#FAEEDA", color: "#854F0B", fontSize: 6, padding: "3px 7px", borderRadius: 8 }}>EV Charging</span>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 6, marginBottom: 5 }}>
            <div style={{ fontSize: 5, color: "#888", marginBottom: 2 }}>Years experience</div>
            <div style={{ fontSize: 7, color: "#222", fontWeight: 800 }}>14 years</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 6 }}>
            <div style={{ fontSize: 5, color: "#888", marginBottom: 2 }}>Service areas</div>
            <div style={{ fontSize: 6, color: "#222" }}>Redcliffe, Bribie, Caboolture</div>
          </div>
        </div>
        <NavBar active="user" />
      </FeaturePhoneFrame>

    </div>
  </div>
);

const GetHiredSection = () => (
 <div style={{ width: "100%", maxWidth: 800, margin: "0 auto", padding: "50px 20px" }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4, textAlign: "center" }}>Get hired</div>
    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 28, textAlign: "center" }}>Direct messages, no middlemen, no lead fees</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>

      <FeaturePhoneFrame label="Browse jobs near you">
        <div style={{ background: "#0D1B2A", padding: "20px 9px 7px" }}>
          <div style={{ fontSize: 8, color: "#fff", fontWeight: 800 }}>Jobs board</div>
          <div style={{ fontSize: 5, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>No lead fees · Unlimited</div>
        </div>
        <div style={{ padding: 7, flex: 1, background: "#F8F8F6" }}>
          <div style={{ background: "#fff", borderRadius: 6, padding: 6, marginBottom: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>Switchboard upgrade</span>
              <span style={{ background: "#FCEBEB", color: "#A32D2D", fontSize: 4, padding: "1px 4px", borderRadius: 5 }}>Urgent</span>
            </div>
            <div style={{ fontSize: 5, color: "#888" }}>Redcliffe · 2hrs ago</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 6, marginBottom: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>EV charger install</span>
              <span style={{ background: "#FAEEDA", color: "#854F0B", fontSize: 4, padding: "1px 4px", borderRadius: 5 }}>This week</span>
            </div>
            <div style={{ fontSize: 5, color: "#888" }}>Bribie Island · 1d ago</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>New power point</span>
              <span style={{ background: "#EAF3DE", color: "#3B6D11", fontSize: 4, padding: "1px 4px", borderRadius: 5 }}>Planning</span>
            </div>
            <div style={{ fontSize: 5, color: "#888" }}>Caboolture · 3d ago</div>
          </div>
        </div>
        <NavBar active="briefcase" />
      </FeaturePhoneFrame>

      <FeaturePhoneFrame label="Direct messages, no fees">
        <div style={{ background: "#0D1B2A", padding: "20px 9px 7px" }}>
          <div style={{ fontSize: 8, color: "#fff", fontWeight: 800 }}>Messages</div>
          <div style={{ fontSize: 5, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Tradie view</div>
        </div>
        <div style={{ padding: 7, flex: 1, background: "#F8F8F6" }}>
          <div style={{ background: "#fff", borderRadius: 6, padding: 5, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#378ADD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, color: "#fff" }}>SM</div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>Sarah M.</div>
              <div style={{ fontSize: 5, color: "#888" }}>Free next week?</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 5, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#D4537E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, color: "#fff" }}>JT</div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>James T.</div>
              <div style={{ fontSize: 5, color: "#888" }}>Thanks for the quote!</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 5, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, color: "#fff" }}>RK</div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>Rachel K.</div>
              <div style={{ fontSize: 5, color: "#888" }}>Do Thursday?</div>
            </div>
          </div>
        </div>
        <NavBar active="message-circle" />
      </FeaturePhoneFrame>

      <FeaturePhoneFrame label="Homeowner messaging you">
        <div style={{ background: "#0D1B2A", padding: "20px 9px 7px" }}>
          <div style={{ fontSize: 8, color: "#fff", fontWeight: 800 }}>Dave Kowalski</div>
          <div style={{ fontSize: 5, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Online now</div>
        </div>
        <div style={{ padding: 7, flex: 1, background: "#F8F8F6", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ background: "#fff", borderRadius: "8px 8px 8px 2px", padding: "5px 7px", maxWidth: "85%", alignSelf: "flex-start" }}>
            <div style={{ fontSize: 5, color: "#222" }}>Happy to quote on your switchboard job.</div>
          </div>
          <div style={{ background: "#F4822A", borderRadius: "8px 8px 2px 8px", padding: "5px 7px", maxWidth: "85%", alignSelf: "flex-end" }}>
            <div style={{ fontSize: 5, color: "#fff" }}>When can you look?</div>
          </div>
          <div style={{ background: "#fff", borderRadius: "8px 8px 8px 2px", padding: "5px 7px", maxWidth: "85%", alignSelf: "flex-start" }}>
            <div style={{ fontSize: 5, color: "#222" }}>Tomorrow 9am works</div>
          </div>
        </div>
        <NavBar active="message-circle" />
      </FeaturePhoneFrame>

    </div>
  </div>
);

const GetRewardedSection = () => (
 <div style={{ width: "100%", maxWidth: 800, margin: "0 auto", padding: "50px 20px" }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4, textAlign: "center" }}>Get rewarded</div>
    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 28, textAlign: "center" }}>Every job done builds your reputation on the platform</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>

      <FeaturePhoneFrame label="Real reviews build trust">
        <div style={{ background: "#F4822A", padding: "20px 9px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#fff" }}>★★★★★</div>
          <div style={{ fontSize: 8, color: "#fff", fontWeight: 800, marginTop: 2 }}>4.9 · 87 reviews</div>
        </div>
        <div style={{ padding: 7, flex: 1, background: "#F8F8F6" }}>
          <div style={{ background: "#fff", borderRadius: 6, padding: 6, marginBottom: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>Sarah M.</span>
              <span style={{ fontSize: 6, color: "#F4822A" }}>★★★★★</span>
            </div>
            <div style={{ fontSize: 5, color: "#888", lineHeight: 1.4 }}>Switchboard upgrade done same day.</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>James T.</span>
              <span style={{ fontSize: 6, color: "#F4822A" }}>★★★★★</span>
            </div>
            <div style={{ fontSize: 5, color: "#888", lineHeight: 1.4 }}>Punctual, fair price, very tidy.</div>
          </div>
        </div>
        <NavBar active="user" />
      </FeaturePhoneFrame>

      <FeaturePhoneFrame label="Show your finished work">
        <div style={{ background: "#0D1B2A", padding: "20px 9px 7px" }}>
          <div style={{ fontSize: 8, color: "#fff", fontWeight: 800 }}>Completed work</div>
        </div>
        <div style={{ padding: 7, flex: 1, background: "#F8F8F6" }}>
          <div style={{ borderRadius: 6, height: 80, marginBottom: 5, position: "relative", overflow: "hidden" }}>
            <img src="/solar-job.jpg" alt="Solar panel installation" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: 6 }}>
            <div style={{ fontSize: 6, color: "#222", fontWeight: 800, marginBottom: 2 }}>Solar panel install</div>
            <div style={{ fontSize: 5, color: "#888" }}>Brisbane · Completed last week</div>
          </div>
        </div>
        <NavBar active="user" />
      </FeaturePhoneFrame>

      <FeaturePhoneFrame label="Detailed reviews">
        <div style={{ background: "#0D1B2A", padding: "20px 9px 7px" }}>
          <div style={{ fontSize: 8, color: "#fff", fontWeight: 800 }}>New review</div>
        </div>
        <div style={{ padding: 7, flex: 1, background: "#F8F8F6" }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#378ADD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5, color: "#fff" }}>SM</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 6, color: "#222", fontWeight: 800 }}>Sarah M.</div>
                <div style={{ fontSize: 4, color: "#888" }}>2 days ago</div>
              </div>
            </div>
            <div style={{ fontSize: 7, color: "#F4822A", marginBottom: 4 }}>★★★★★</div>
            <div style={{ fontSize: 5, color: "#555", lineHeight: 1.5 }}>"Dave was on time, explained everything clearly. Highly recommend."</div>
          </div>
        </div>
        <NavBar active="user" />
      </FeaturePhoneFrame>

    </div>
  </div>
);

const CongratsPage = () => (
  <div style={{ minHeight: "100vh", background: "#0D1B2A", fontFamily: "sans-serif" }}>
    <div style={{ padding: "50px 24px 30px", textAlign: "center" }}>
      <Logo />
      <div style={{ fontSize: 32, fontWeight: 800, color: "#F4822A", marginTop: 24, marginBottom: 12 }}>
        Congratulations!
      </div>
      <div style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto" }}>
        You're officially on the Your Tradie waitlist.
      </div>
    </div>

    <div style={{ width: "100%", maxWidth: 700, margin: "0 auto", padding: "0 24px 30px", textAlign: "center" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
        Building Australia's Largest Tradie Network
      </div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
        We're connecting homeowners with tradies. No lead fees, no bidding wars, no middlemen — just the best way for tradies to get seen, get hired, and get the jobs they deserve.
      </div>
    </div>

    <GetSeenSection />
    <GetHiredSection />
    <GetRewardedSection />

    <div style={{ textAlign: "center", padding: "30px 24px 60px" }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2025 Your Tradie · Australia</div>
    </div>
  </div>
);

export default function App() {
  const isDevMode = window.location.pathname === DEV_PATH;
  const [view, setView] = useState(isDevMode ? "landing" : "waitlist");

  const [wName, setWName] = useState("");
  const [wEmail, setWEmail] = useState("");
  const [wPhone, setWPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [trades, setTrades] = useState([]);
  const [customTrades, setCustomTrades] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [customSpecialties, setCustomSpecialties] = useState([]);
  const [primaryArea, setPrimaryArea] = useState("");
  const [secondaryAreas, setSecondaryAreas] = useState([]);
  const [postcode, setPostcode] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [abn, setAbn] = useState("");
  const [photo, setPhoto] = useState(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const handleWaitlistSubmit = async () => {
    if (!wName || !wEmail) { setErrorMsg("Please enter your name and email."); return; }
    setLoading(true); setErrorMsg("");
    try {
      const { error } = await supabase.from("Waitlist").insert([{ name: wName, email: wEmail, phone: wPhone, type: "waitlist" }]);
      if (error) { setErrorMsg("Error: " + error.message); setLoading(false); }
      else { setSubmitted(true); setLoading(false); }
    } catch (err) { setErrorMsg("Error: " + err.message); setLoading(false); }
  };

  const addTrade = (t) => { if (!trades.includes(t)) setTrades([...trades, t]); };
  const removeTrade = (t) => setTrades(trades.filter(x => x !== t));
  const addCustomTrade = (t) => { if (!customTrades.includes(t)) setCustomTrades([...customTrades, t]); };
  const removeCustomTrade = (t) => setCustomTrades(customTrades.filter(x => x !== t));

  const addSpecialty = (s) => { if (!specialties.includes(s)) setSpecialties([...specialties, s]); };
  const removeSpecialty = (s) => setSpecialties(specialties.filter(x => x !== s));
  const addCustomSpecialty = (s) => { if (!customSpecialties.includes(s)) setCustomSpecialties([...customSpecialties, s]); };
  const removeCustomSpecialty = (s) => setCustomSpecialties(customSpecialties.filter(x => x !== s));

  const toggleSecondaryArea = (a) => {
    if (secondaryAreas.includes(a)) setSecondaryAreas(secondaryAreas.filter(x => x !== a));
    else setSecondaryAreas([...secondaryAreas, a]);
  };

  const handleLaunch = async () => {
    const allCustom = [
      ...customTrades.map(t => ({ type: "trade", value: t })),
      ...customSpecialties.map(s => ({ type: "specialty", value: s }))
    ];
    if (allCustom.length > 0) {
      await supabase.from("suggestions").insert(allCustom.map(c => ({
        suggestion_type: c.type, value: c.value, submitted_by: fullName, status: "pending"
      })));
    }
    setOnboardingComplete(true);
  };

  if (view === "waitlist") {
    if (submitted) {
      return <CongratsPage />;
    }
    return (
      <div style={{ minHeight: "100vh", background: "#0D1B2A", fontFamily: "sans-serif", padding: "40px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          maxWidth: 1000, margin: "0 auto", width: "100%", display: "grid",
          gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center"
        }}>
          <div>
            <Logo />
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.3, marginBottom: 10 }}>
                Get found. Get hired. Get rewarded.
              </div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                Connecting you with tradies.
              </div>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#FFFFFF", marginBottom: 6, textAlign: "center" }}>Join the Community</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Be first when we launch in your area</div>
              <input style={inputStyle} placeholder="Full name" value={wName} onChange={e => setWName(e.target.value)} />
              <input style={inputStyle} placeholder="Email address" type="email" value={wEmail} onChange={e => setWEmail(e.target.value)} />
              <input style={inputStyle} placeholder="Phone number (optional)" type="tel" value={wPhone} onChange={e => setWPhone(e.target.value)} />
              {errorMsg && <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 10, textAlign: "center", padding: "8px", background: "rgba(255,107,107,0.1)", borderRadius: 8 }}>{errorMsg}</div>}
              <button onClick={handleWaitlistSubmit} disabled={loading}
                style={{ width: "100%", background: loading ? "rgba(244,130,42,0.5)" : "#F4822A", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 800, color: "#fff", cursor: loading ? "default" : "pointer", marginTop: 4 }}>
                {loading ? "Joining..." : "Join the Waitlist →"}
              </button>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 14 }}>No spam. No lead fees. Ever.</div>
            </div>
          </div>
          <PhoneMockup />
        </div>
        <div style={{ marginTop: 64, fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          © 2025 Your Tradie · Australia
        </div>
      </div>
    );
  }

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

  if (view === "tradie-onboarding") {
    if (onboardingComplete) {
      return (
        <Wrapper>
          <Logo />
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Profile Launched!</div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 24 }}>
              Welcome to Your Tradie, {fullName.split(" ")[0]}!
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

          {step === 1 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>About You</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Let's start with the basics</div>
              <input style={inputStyle} placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} />
              <input style={inputStyle} placeholder="Business name (optional)" value={businessName} onChange={e => setBusinessName(e.target.value)} />
              <button onClick={() => fullName && setStep(2)} style={{ ...btnPrimary(!fullName), width: "100%", marginTop: 4 }}>Next →</button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>Your Trade</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>What do you do? Select all that apply.</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Primary trade(s)</div>
              <SearchSelect items={TRADES} selected={trades} onAdd={addTrade} onAddCustom={addCustomTrade} placeholder="Search or type your trade..." />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {trades.map(t => <Tag key={t} label={t} onRemove={() => removeTrade(t)} />)}
                {customTrades.map(t => <Tag key={t} label={t} onRemove={() => removeCustomTrade(t)} pending />)}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Specialties (optional)</div>
              <SearchSelect items={SPECIALTIES} selected={specialties} onAdd={addSpecialty} onAddCustom={addCustomSpecialty} placeholder="Search or type a specialty..." max={6} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {specialties.map(s => <Tag key={s} label={s} onRemove={() => removeSpecialty(s)} />)}
                {customSpecialties.map(s => <Tag key={s} label={s} onRemove={() => removeCustomSpecialty(s)} pending />)}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(1)} style={btnSecondary}>← Back</button>
                <button onClick={() => (trades.length > 0 || customTrades.length > 0) && setStep(3)} style={btnPrimary(trades.length === 0 && customTrades.length === 0)}>Next →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>Service Areas</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Where do you work?</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Primary area</div>
              <select value={primaryArea} onChange={e => setPrimaryArea(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }}>
                <option value="">Select your main area</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Postcode (if outside listed areas)</div>
              <input style={inputStyle} placeholder="e.g. 4507" value={postcode} onChange={e => setPostcode(e.target.value)} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Also service</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {AREAS.filter(a => a !== primaryArea).map(area => (
                  <div key={area} onClick={() => toggleSecondaryArea(area)}
                    style={{
                      background: secondaryAreas.includes(area) ? "rgba(244,130,42,0.2)" : "rgba(255,255,255,0.05)",
                      border: secondaryAreas.includes(area) ? "1px solid rgba(244,130,42,0.4)" : "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 20, padding: "6px 14px", fontSize: 13,
                      color: secondaryAreas.includes(area) ? "#F4822A" : "rgba(255,255,255,0.5)", cursor: "pointer"
                    }}>
                    {area}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(2)} style={btnSecondary}>← Back</button>
                <button onClick={() => (primaryArea || postcode) && setStep(4)} style={btnPrimary(!primaryArea && !postcode)}>Next →</button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>Credentials</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Licence number and/or ABN</div>
              <input style={inputStyle} placeholder="Licence number (if applicable)" value={licenceNumber} onChange={e => setLicenceNumber(e.target.value)} />
              <input style={inputStyle} placeholder="ABN" value={abn} onChange={e => setAbn(e.target.value)} />
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 16, textAlign: "center" }}>At least one required to go live</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(3)} style={btnSecondary}>← Back</button>
                <button onClick={() => (licenceNumber || abn) && setStep(5)} style={btnPrimary(!licenceNumber && !abn)}>Next →</button>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6, textAlign: "center" }}>Profile Photo</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Add a photo or logo</div>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.07)",
                  border: "2px dashed rgba(255,255,255,0.2)", margin: "0 auto 16px",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, cursor: "pointer"
                }} onClick={() => document.getElementById("photo-upload").click()}>
                  {photo ? "📷" : "👤"}
                </div>
                <input id="photo-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => setPhoto(e.target.files[0])} />
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{photo ? photo.name : "Tap to upload"}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep(4)} style={btnSecondary}>← Back</button>
                <button onClick={handleLaunch} style={{ ...btnPrimary(false), flex: 2 }}>Launch My Profile 🚀</button>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 12 }}>You can add a photo later</div>
            </>
          )}
        </div>
        <button onClick={() => setView("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 12, cursor: "pointer", marginTop: 16 }}>← Back to home</button>
      </Wrapper>
    );
  }

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