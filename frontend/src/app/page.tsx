"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh", background: "#070d1a", color: "white",
      fontFamily: "'Courier New', 'Lucida Console', monospace",
      display: "flex", flexDirection: "column",
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)",
      }} />

      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes orbit{from{transform:rotate(0deg) translateX(120px)}to{transform:rotate(360deg) translateX(120px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(56,189,248,0.3)}50%{box-shadow:0 0 40px rgba(56,189,248,0.7)}}
        .card-hover{transition:all 0.25s ease;cursor:default}
        .card-hover:hover{transform:translateY(-4px);border-color:rgba(56,189,248,0.3) !important;background:rgba(56,189,248,0.05) !important}
        .btn-primary{transition:all 0.2s ease;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(56,189,248,0.35) !important;}
        .btn-secondary{transition:all 0.2s ease;}
        .btn-secondary:hover{background:rgba(255,255,255,0.07) !important;border-color:rgba(255,255,255,0.2) !important;}
      `}</style>

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 10,
        borderBottom: "1px solid rgba(56,189,248,0.15)",
        padding: "18px 40px", display: "flex", alignItems: "center", gap: 14,
        background: "rgba(7,13,26,0.8)", backdropFilter: "blur(12px)",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: "linear-gradient(135deg, #38bdf8, #818cf8)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
        }}>🛰️</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", color: "#e2e8f0" }}>SATELLITE ANOMALY STUDIO</div>
          <div style={{ fontSize: 9, color: "#334155", letterSpacing: "0.2em" }}>CHANGE DETECTION · TEMPORAL ANALYSIS · AI INSIGHTS</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 10, color: "#22c55e", letterSpacing: "0.12em" }}>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        flex: 1, position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "60px 24px",
      }}>

        {/* Satellite orbit decoration */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: 280, height: 280, borderRadius: "50%",
          border: "1px dashed rgba(56,189,248,0.08)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 18px",
          background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)",
          borderRadius: 100, marginBottom: 32,
          animation: "fadeUp 0.4s ease",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#38bdf8", letterSpacing: "0.15em" }}>AI-POWERED · SATELLITE IMAGERY ANALYSIS</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800,
          lineHeight: 1.1, textAlign: "center", marginBottom: 24,
          animation: "fadeUp 0.5s ease",
          letterSpacing: "-0.02em",
        }}>
          <span style={{ color: "#e2e8f0" }}>SATELLITE</span>
          <br />
          <span style={{
            background: "linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8)",
            backgroundSize: "200%",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>CHANGE DETECTION</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(13px, 2vw, 17px)", color: "#64748b", maxWidth: 540,
          textAlign: "center", lineHeight: 1.8, marginBottom: 48,
          animation: "fadeUp 0.6s ease",
          fontFamily: "monospace",
        }}>
          Upload a pair of satellite images. The AI detects temporal anomalies,
          generates heatmaps, and delivers precise change analysis — in seconds.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
          marginBottom: 80, animation: "fadeUp 0.7s ease",
        }}>
          <button
            className="btn-primary"
            onClick={() => router.push("/analysis")}
            style={{
              padding: "14px 36px",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              border: "none", borderRadius: 10, color: "white",
              fontSize: 13, fontFamily: "monospace", fontWeight: 700,
              letterSpacing: "0.15em", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
            }}>
            ⚡ START ANALYSIS
            <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </button>
          <button
            className="btn-secondary"
            style={{
              padding: "14px 36px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8",
              fontSize: 13, fontFamily: "monospace", cursor: "pointer", letterSpacing: "0.12em",
            }}>
            📖 VIEW DOCS
          </button>
        </div>

        {/* Feature cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          maxWidth: 820, width: "100%", animation: "fadeUp 0.8s ease",
        }}>
          {[
            { icon: "🤖", title: "DEEP LEARNING", desc: "Neural network-based pixel-wise change detection across spectral bands", color: "#818cf8" },
            { icon: "🔥", title: "HEATMAP ANALYSIS", desc: "Fire, Viridis & Plasma colormaps to visualize anomaly intensity", color: "#f59e0b" },
            { icon: "⇔", title: "COMPARE SLIDER", desc: "Interactive drag-to-reveal slider for precise before/after comparison", color: "#38bdf8" },
          ].map((f, i) => (
            <div key={i} className="card-hover" style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "24px 20px",
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: f.color, letterSpacing: "0.15em", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 48, marginTop: 64, flexWrap: "wrap", justifyContent: "center",
          animation: "fadeUp 0.9s ease",
        }}>
          {[
            { val: "99.5%", label: "ACCURACY" },
            { val: "< 2s", label: "PROCESSING" },
            { val: "4K", label: "RESOLUTION" },
            { val: "24/7", label: "UPTIME" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 28, fontWeight: 800, fontFamily: "'Courier New', monospace",
                background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{s.val}</div>
              <div style={{ fontSize: 9, color: "#334155", letterSpacing: "0.2em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "16px 40px", textAlign: "center",
        fontSize: 10, color: "#1e293b", letterSpacing: "0.15em",
      }}>
        SATELLITE ANOMALY STUDIO · TEMPORAL CHANGE DETECTION ENGINE
      </div>
    </div>
  );
}
