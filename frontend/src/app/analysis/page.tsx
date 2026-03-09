"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createRun } from "../api-client";

function DropZone({ label, badge, badgeColor, preview, onFile, index }: {
  label: string; badge: string; badgeColor: string;
  preview: string | null; onFile: (f: File) => void; index: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        flex: 1, position: "relative", cursor: "pointer",
        aspectRatio: "4/3",
        border: dragging ? `3px solid ${badgeColor}` : preview ? `2px solid ${badgeColor}40` : "2px dashed rgba(255,255,255,0.15)",
        borderRadius: 24, overflow: "hidden",
        background: dragging ? `${badgeColor}12` : preview ? "transparent" : "rgba(255,255,255,0.02)",
        transition: "all 0.3s ease",
        boxShadow: dragging ? `0 0 40px ${badgeColor}30` : preview ? `0 0 30px ${badgeColor}20` : "none",
      }}>
      <input ref={inputRef} type="file" accept="image/*,.tif,.tiff"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />

      {preview ? (
        <>
          <img src={preview} alt={label}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
          <div style={{ position: "absolute", top: 20, left: 20 }}>
            <span style={{
              background: badgeColor, color: "white", padding: "6px 18px",
              borderRadius: 100, fontSize: 15, fontFamily: "monospace", fontWeight: 800,
              letterSpacing: "0.1em", boxShadow: `0 0 20px ${badgeColor}80`,
            }}>{badge}</span>
          </div>
          <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>Click to replace</div>
          </div>
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `${badgeColor}15`, border: `2px solid ${badgeColor}40`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
          }}>🛰️</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: badgeColor, marginBottom: 8, letterSpacing: "0.05em" }}>{badge}</div>
            <div style={{ fontSize: 16, color: "#94a3b8", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 13, color: "#475569", fontFamily: "monospace" }}>
              Drop here or click to browse<br/>
              <span style={{ color: "#334155" }}>.png · .jpg · .tif · .tiff</span>
            </div>
          </div>
          <div style={{
            padding: "10px 24px", border: `1px solid ${badgeColor}40`,
            borderRadius: 100, fontSize: 13, color: badgeColor,
            fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em",
          }}>+ UPLOAD IMAGE</div>
        </div>
      )}
    </div>
  );
}

export default function AnalysisPage() {
  const router = useRouter();
  const [t0File, setT0File] = useState<File | null>(null);
  const [t1File, setT1File] = useState<File | null>(null);
  const [t0Preview, setT0Preview] = useState<string | null>(null);
  const [t1Preview, setT1Preview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File, type: "t0" | "t1") => {
    const url = URL.createObjectURL(file);
    if (type === "t0") { setT0File(file); setT0Preview(url); }
    else { setT1File(file); setT1Preview(url); }
    setError(null);
  }, []);

  const handleRun = async () => {
    if (!t0File || !t1File) return;
    setUploading(true);
    setError(null);
    setProgress("Uploading images…");
    try {
      setProgress("Running anomaly detection…");
      const runId = await createRun(t0File, t1File);
      setProgress("Done! Redirecting…");
      router.push(`/runs/${runId}`);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
      setUploading(false);
      setProgress("");
    }
  };

  const bothReady = t0File && t1File;
  const ready = bothReady && !uploading;

  return (
    <div style={{
      minHeight: "100vh", background: "#070d1a", color: "white",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(56,189,248,1) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,1) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{from{background-position:200% center}to{background-position:-200% center}}
        @keyframes progressBar{from{width:0%}to{width:95%}}
      `}</style>

      {/* Header */}
      <div style={{
        background: "rgba(7,13,26,0.95)", borderBottom: "1px solid rgba(56,189,248,0.15)",
        padding: "22px 48px", display: "flex", alignItems: "center", gap: 18,
        position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(16px)",
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: "linear-gradient(135deg, #38bdf8, #818cf8)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>🛰️</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.08em", color: "#e2e8f0" }}>SATELLITE ANOMALY STUDIO</div>
          <div style={{ fontSize: 12, color: "#475569", letterSpacing: "0.15em", fontFamily: "monospace" }}>CHANGE DETECTION ENGINE</div>
        </div>
        <button onClick={() => router.push("/")} style={{
          marginLeft: "auto", padding: "10px 24px",
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, color: "#94a3b8", fontSize: 14, cursor: "pointer",
          fontFamily: "monospace", letterSpacing: "0.08em",
        }}>← HOME</button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 40px 100px", position: "relative", zIndex: 1 }}>

        {/* Hero text */}
        <div style={{ textAlign: "center", marginBottom: 64, animation: "fadeUp 0.5s ease" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "8px 24px", background: "rgba(56,189,248,0.08)",
            border: "1px solid rgba(56,189,248,0.2)", borderRadius: 100, marginBottom: 28,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 14, color: "#38bdf8", letterSpacing: "0.15em", fontFamily: "monospace" }}>STEP 01 — UPLOAD IMAGE PAIR</span>
          </div>
          <h1 style={{
            fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900,
            lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em",
          }}>
            <span style={{ color: "#e2e8f0" }}>Upload Your </span>
            <span style={{
              background: "linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8)",
              backgroundSize: "200%", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}>Satellite Pair</span>
          </h1>
          <p style={{ fontSize: 18, color: "#64748b", maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
            Provide before and after satellite images of the same location.
            The AI will detect anomalies, generate heatmaps and deliver precise change analysis.
          </p>
        </div>

        {/* Drop zones */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24,
          marginBottom: 40, alignItems: "center",
          animation: "fadeUp 0.6s ease",
        }}>
          <DropZone label="Before Image (Baseline)" badge="T₀ BEFORE" badgeColor="#22c55e"
            preview={t0Preview} onFile={(f) => handleFile(f, "t0")} index={0} />

          {/* VS divider */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 900, color: "#475569", fontFamily: "monospace",
            }}>VS</div>
            <div style={{ width: 2, height: 60, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)" }} />
            <div style={{ fontSize: 28, opacity: 0.3 }}>⇔</div>
          </div>

          <DropZone label="After Image (Target)" badge="T₁ AFTER" badgeColor="#ef4444"
            preview={t1Preview} onFile={(f) => handleFile(f, "t1")} index={1} />
        </div>

        {/* File chips */}
        {(t0File || t1File) && (
          <div style={{ display: "flex", gap: 12, marginBottom: 32, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.3s ease" }}>
            {t0File && (
              <div style={{ padding: "8px 20px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100, fontSize: 14, color: "#22c55e", fontFamily: "monospace" }}>
                ✓ T₀: {t0File.name} · {(t0File.size / 1024).toFixed(0)} KB
              </div>
            )}
            {t1File && (
              <div style={{ padding: "8px 20px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 100, fontSize: 14, color: "#ef4444", fontFamily: "monospace" }}>
                ✓ T₁: {t1File.name} · {(t1File.size / 1024).toFixed(0)} KB
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: 28, padding: "16px 24px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 14, fontSize: 16, color: "#ef4444", textAlign: "center",
            animation: "fadeUp 0.3s ease",
          }}>⚠️ {error}</div>
        )}

        {/* CTA Button */}
        <div style={{ display: "flex", justifyContent: "center", animation: "fadeUp 0.7s ease" }}>
          <button
            onClick={handleRun}
            disabled={!ready}
            style={{
              padding: "20px 64px",
              background: ready
                ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                : "rgba(255,255,255,0.04)",
              border: ready ? "none" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, color: ready ? "white" : "#334155",
              fontSize: 18, fontWeight: 800, letterSpacing: "0.12em",
              cursor: ready ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: ready ? "0 8px 40px rgba(99,102,241,0.4)" : "none",
              transition: "all 0.3s ease",
              minWidth: 380,
            }}>
            {uploading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite", fontSize: 22 }}>⟳</span>
                {progress}
              </>
            ) : !t0File && !t1File ? (
              <span style={{ opacity: 0.4 }}>UPLOAD BOTH IMAGES FIRST</span>
            ) : !t0File || !t1File ? (
              <span style={{ opacity: 0.4 }}>WAITING FOR {!t0File ? "T₀ BEFORE" : "T₁ AFTER"} IMAGE</span>
            ) : (
              <>⚡ RUN ANOMALY DETECTION</>
            )}
          </button>
        </div>

        {/* Progress bar */}
        {uploading && (
          <div style={{ marginTop: 20, maxWidth: 480, margin: "20px auto 0" }}>
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                animation: "progressBar 2.5s ease forwards",
              }} />
            </div>
          </div>
        )}

        {/* Info cards at bottom */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20,
          marginTop: 72, animation: "fadeUp 0.8s ease",
        }}>
          {[
            { icon: "🔥", title: "Heatmap Analysis", desc: "JET colormap heatmap showing exact intensity of changes across every pixel", color: "#f59e0b" },
            { icon: "⇔", title: "Compare Slider", desc: "Drag to reveal before/after — interactively inspect every region of change", color: "#38bdf8" },
            { icon: "🎯", title: "Change Overlay", desc: "Red anomaly mask overlaid on the target image showing precise affected zones", color: "#818cf8" },
          ].map((c, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18, padding: "28px 24px", transition: "all 0.25s ease",
            }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{c.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.color, marginBottom: 10, letterSpacing: "0.05em" }}>{c.title}</div>
              <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
