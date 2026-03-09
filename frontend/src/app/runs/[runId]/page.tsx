// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { getRun, getAssetUrl, type RunData } from "../../api-client";

// // ─── Animated Score Ring ──────────────────────────────────────────────────────
// function ScoreRing({ score, max = 100, label, color }: { score: number; max?: number; label: string; color: string }) {
//   const pct = Math.min(score / max, 1);
//   const r = 44, c = 2 * Math.PI * r;
//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
//       <svg width={110} height={110} viewBox="0 0 110 110">
//         <circle cx={55} cy={55} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={9} />
//         <circle cx={55} cy={55} r={r} fill="none" stroke={color} strokeWidth={9}
//           strokeDasharray={`${pct * c} ${c}`} strokeLinecap="round"
//           transform="rotate(-90 55 55)"
//           style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color})` }} />
//         <text x={55} y={51} textAnchor="middle" fill="white" fontSize={18} fontWeight={700} fontFamily="'Courier New', monospace">
//           {score.toFixed(score < 10 ? 2 : 1)}
//         </text>
//         <text x={55} y={66} textAnchor="middle" fill="#64748b" fontSize={10} fontFamily="monospace">/{max}</text>
//       </svg>
//       <div style={{ color: "#94a3b8", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>{label}</div>
//     </div>
//   );
// }

// // ─── Metric Card ──────────────────────────────────────────────────────────────
// function MetricCard({ label, value, unit, color, icon }: { label: string; value: string; unit: string; color: string; icon: string }) {
//   return (
//     <div style={{
//       background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
//       borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.12em" }}>
//         <span>{icon}</span>{label}
//       </div>
//       <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
//         <span style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Courier New', monospace", lineHeight: 1 }}>{value}</span>
//         <span style={{ fontSize: 12, color: "#475569" }}>{unit}</span>
//       </div>
//     </div>
//   );
// }

// // ─── Image Compare Slider ─────────────────────────────────────────────────────
// function CompareSlider({ beforeUrl, afterUrl }: { beforeUrl: string; afterUrl: string }) {
//   const [pos, setPos] = useState(50);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const dragging = useRef(false);

//   const handleMove = useCallback((clientX: number) => {
//     if (!dragging.current || !containerRef.current) return;
//     const rect = containerRef.current.getBoundingClientRect();
//     const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
//     setPos(x * 100);
//   }, []);

//   useEffect(() => {
//     const up = () => { dragging.current = false; };
//     const move = (e: MouseEvent) => handleMove(e.clientX);
//     const touchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
//     window.addEventListener("mouseup", up);
//     window.addEventListener("mousemove", move);
//     window.addEventListener("touchend", up);
//     window.addEventListener("touchmove", touchMove);
//     return () => {
//       window.removeEventListener("mouseup", up);
//       window.removeEventListener("mousemove", move);
//       window.removeEventListener("touchend", up);
//       window.removeEventListener("touchmove", touchMove);
//     };
//   }, [handleMove]);

//   return (
//     <div ref={containerRef}
//       style={{
//         position: "relative", width: "100%", aspectRatio: "1/1", cursor: "col-resize",
//         borderRadius: 14, overflow: "hidden", userSelect: "none",
//         background: "#0a1020", border: "1px solid rgba(255,255,255,0.1)"
//       }}
//       onMouseDown={() => { dragging.current = true; }}
//       onTouchStart={() => { dragging.current = true; }}>

//       {/* After (full width base) */}
//       <img src={afterUrl} alt="After" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

//       {/* Before (clipped to left of divider) */}
//       <div style={{ position: "absolute", inset: 0, overflow: "hidden", width: `${pos}%` }}>
//         <img src={beforeUrl} alt="Before"
//           style={{ position: "absolute", top: 0, left: 0, width: `${10000 / pos}%`, height: "100%", objectFit: "cover", maxWidth: "none" }} />
//       </div>

//       {/* Divider line */}
//       <div style={{
//         position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2,
//         background: "white", boxShadow: "0 0 14px rgba(255,255,255,0.9)", transform: "translateX(-50%)",
//         pointerEvents: "none",
//       }}>
//         <div style={{
//           position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
//           width: 38, height: 38, borderRadius: "50%",
//           background: "white", boxShadow: "0 0 18px rgba(255,255,255,0.7)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontSize: 15, color: "#0f172a", fontWeight: 800, pointerEvents: "none",
//         }}>⇔</div>
//       </div>

//       {/* Labels */}
//       <div style={{ position: "absolute", top: 10, left: 12, background: "rgba(0,0,0,0.75)", color: "#22c55e", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontFamily: "monospace", fontWeight: 700, pointerEvents: "none" }}>
//         T₀ BEFORE
//       </div>
//       <div style={{ position: "absolute", top: 10, right: 12, background: "rgba(0,0,0,0.75)", color: "#ef4444", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontFamily: "monospace", fontWeight: 700, pointerEvents: "none" }}>
//         T₁ AFTER
//       </div>
//       <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.6)", color: "#94a3b8", padding: "3px 12px", borderRadius: 6, fontSize: 10, fontFamily: "monospace", pointerEvents: "none" }}>
//         ← drag to compare →
//       </div>
//     </div>
//   );
// }

// // ─── Severity config ──────────────────────────────────────────────────────────
// function getSeverity(pct: number) {
//   if (pct > 15) return { label: "CRITICAL", color: "#ef4444", icon: "🚨", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" };
//   if (pct > 7)  return { label: "MODERATE", color: "#f59e0b", icon: "⚠️",  bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" };
//   return           { label: "LOW",      color: "#22c55e", icon: "✅",  bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.25)" };
// }

// // ─── MAIN PAGE ────────────────────────────────────────────────────────────────
// export default function RunPage({ params }: { params: Promise<{ runId: string }> }) {
//   const router = useRouter();
//   const [run, setRun] = useState<RunData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [runId, setRunId] = useState<string>("");
//   const [activeTab, setActiveTab] = useState<"compare" | "heatmap" | "overlay" | "metrics">("compare");

//   useEffect(() => {
//     async function getParams() {
//       const { runId: id } = await params;
//       setRunId(id);
//     }
//     getParams();
//   }, [params]);

//   useEffect(() => {
//     if (!runId) return;
//     async function loadRun() {
//       try {
//         const data = await getRun(runId);
//         setRun(data);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadRun();
//   }, [runId]);

//   // ── Loading ──
//   if (loading) return (
//     <div style={{ minHeight: "100vh", background: "#070d1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ fontSize: 42, marginBottom: 20 }}>🛰️</div>
//         <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
//           {[0, 1, 2].map(i => (
//             <div key={i} style={{
//               width: 10, height: 10, borderRadius: "50%", background: "#38bdf8",
//               animation: "bounce 0.8s ease infinite",
//               animationDelay: `${i * 0.15}s`,
//             }} />
//           ))}
//         </div>
//         <div style={{ color: "#94a3b8", fontSize: 13, letterSpacing: "0.2em" }}>PROCESSING SATELLITE DATA…</div>
//         <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
//       </div>
//     </div>
//   );

//   // ── Error ──
//   if (error || !run) return (
//     <div style={{ minHeight: "100vh", background: "#070d1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
//       <div style={{ textAlign: "center", color: "white" }}>
//         <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
//         <div style={{ color: "#ef4444", marginBottom: 8 }}>{error || "Run not found"}</div>
//         <button onClick={() => router.push("/")} style={{
//           marginTop: 16, padding: "10px 24px", background: "rgba(56,189,248,0.15)",
//           border: "1px solid rgba(56,189,248,0.3)", borderRadius: 8, color: "#38bdf8",
//           fontFamily: "monospace", cursor: "pointer", fontSize: 12, letterSpacing: "0.1em",
//         }}>← BACK TO HOME</button>
//       </div>
//     </div>
//   );

//   const metrics = run.metrics?.global ?? {};
//   const anomalyPct: number = metrics.anomaly_pixels_pct ?? 0;
//   const scoreMean: number = metrics.score_mean ?? 0;
//   const scoreP95: number = metrics.score_p95 ?? 0;
//   const sev = getSeverity(anomalyPct);

//   const tabs = [
//     { id: "compare" as const, label: "⇔ Compare" },
//     { id: "heatmap" as const, label: "🔥 Heatmap" },
//     { id: "overlay" as const, label: "🎯 Overlay" },
//     { id: "metrics" as const, label: "📊 Metrics" },
//   ];

//   return (
//     <div style={{ minHeight: "100vh", background: "#070d1a", color: "white", fontFamily: "'Courier New', monospace" }}>
//       {/* Scanline texture */}
//       <div style={{
//         position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
//         backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)",
//       }} />

//       <style>{`
//         @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
//       `}</style>

//       {/* Header */}
//       <div style={{
//         background: "rgba(7,13,26,0.96)", borderBottom: "1px solid rgba(56,189,248,0.18)",
//         padding: "18px 32px", display: "flex", alignItems: "center", gap: 14,
//         position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)",
//       }}>
//         <button onClick={() => router.push("/")} style={{
//           padding: "8px 16px", background: "rgba(255,255,255,0.05)",
//           border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94a3b8",
//           fontFamily: "monospace", cursor: "pointer", fontSize: 11, letterSpacing: "0.1em",
//         }}>← HOME</button>
//         <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)" }} />
//         <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", color: "#e2e8f0" }}>ANOMALY DETECTION</div>
//         <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace" }}>RUN · {runId.slice(0, 8).toUpperCase()}</div>
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
//           <div style={{ width: 7, height: 7, borderRadius: "50%", background: sev.color, boxShadow: `0 0 6px ${sev.color}`, animation: "pulse 2s infinite" }} />
//           <span style={{ fontSize: 11, color: sev.color, letterSpacing: "0.12em" }}>{sev.label}</span>
//         </div>
//       </div>

//       <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 60px", position: "relative", zIndex: 1 }}>

//         {/* Severity Banner */}
//         <div style={{
//           background: sev.bg, border: `1px solid ${sev.border}`, borderRadius: 14,
//           padding: "18px 24px", marginBottom: 24, display: "flex", alignItems: "center",
//           justifyContent: "space-between", animation: "fadeUp 0.4s ease",
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//             <span style={{ fontSize: 32 }}>{sev.icon}</span>
//             <div>
//               <div style={{ fontSize: 16, fontWeight: 700, color: sev.color, letterSpacing: "0.1em" }}>
//                 {sev.label} ANOMALY DETECTED
//               </div>
//               <div style={{ fontSize: 11, color: "#475569", marginTop: 3, fontFamily: "monospace" }}>
//                 Run ID: {runId} · AI-powered temporal change analysis complete
//               </div>
//             </div>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <div style={{ fontSize: 40, fontWeight: 700, color: sev.color, fontFamily: "'Courier New', monospace" }}>
//               {anomalyPct.toFixed(1)}%
//             </div>
//             <div style={{ fontSize: 10, color: "#475569" }}>ANOMALY PIXELS</div>
//           </div>
//         </div>

//         {/* Metric Cards */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24, animation: "fadeUp 0.5s ease" }}>
//           <MetricCard label="Anomaly Pixels" value={anomalyPct.toFixed(1)} unit="%" color={sev.color} icon="⚡" />
//           <MetricCard label="Mean Score" value={scoreMean.toFixed(3)} unit="" color="#38bdf8" icon="📈" />
//           <MetricCard label="95th Percentile" value={scoreP95.toFixed(3)} unit="" color="#818cf8" icon="🎯" />
//         </div>

//         {/* Tabs */}
//         <div style={{
//           display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.03)",
//           padding: 4, borderRadius: 10, width: "fit-content", animation: "fadeUp 0.6s ease",
//         }}>
//           {tabs.map(t => (
//             <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
//               padding: "9px 22px", borderRadius: 7, border: "none", cursor: "pointer",
//               background: activeTab === t.id ? "rgba(56,189,248,0.12)" : "transparent",
//               color: activeTab === t.id ? "#38bdf8" : "#64748b",
//               fontSize: 12, fontFamily: "monospace", fontWeight: activeTab === t.id ? 700 : 400,
//               letterSpacing: "0.06em",
//               borderBottom: activeTab === t.id ? "2px solid #38bdf8" : "2px solid transparent",
//               transition: "all 0.2s",
//             }}>{t.label}</button>
//           ))}
//         </div>

//         {/* ── Compare Tab ── */}
//         {activeTab === "compare" && (
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, animation: "fadeUp 0.3s ease" }}>
//             <div>
//               <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.2em", marginBottom: 10 }}>INTERACTIVE COMPARISON SLIDER</div>
//               <CompareSlider
//                 beforeUrl={getAssetUrl(runId, "t0_rgb")}
//                 afterUrl={getAssetUrl(runId, "t1_rgb")}
//               />
//               <div style={{ marginTop: 10, padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, fontSize: 11, color: "#475569", lineHeight: 1.7 }}>
//                 Drag the white divider left/right to reveal changes between the two time periods. <span style={{ color: "#22c55e" }}>T₀ = baseline</span>, <span style={{ color: "#ef4444" }}>T₁ = target</span>.
//               </div>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               <div style={{
//                 background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
//                 borderRadius: 14, padding: "24px 0", display: "flex", justifyContent: "space-around",
//               }}>
//                 <ScoreRing score={anomalyPct} max={100} label="Anomaly %" color={sev.color} />
//                 <ScoreRing score={Math.min(scoreMean * 1000, 100)} max={100} label="Mean × 1000" color="#38bdf8" />
//                 <ScoreRing score={Math.min(scoreP95 * 1000, 100)} max={100} label="P95 × 1000" color="#818cf8" />
//               </div>
//               {/* Anomaly bar */}
//               <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20 }}>
//                 <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.2em", marginBottom: 14 }}>CHANGE INTENSITY SCALE</div>
//                 {[
//                   { label: "Anomaly Pixels", value: anomalyPct, max: 100, color: sev.color },
//                   { label: "Mean Score", value: scoreMean * 100, max: 100, color: "#38bdf8" },
//                   { label: "P95 Score", value: scoreP95 * 100, max: 100, color: "#818cf8" },
//                 ].map((item, i) => (
//                   <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
//                     <div style={{ width: 110, fontSize: 10, color: "#64748b", fontFamily: "monospace", flexShrink: 0 }}>{item.label}</div>
//                     <div style={{ flex: 1, height: 18, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
//                       <div style={{
//                         height: "100%", borderRadius: 4, background: item.color,
//                         width: `${Math.min(item.value, 100)}%`,
//                         boxShadow: `0 0 8px ${item.color}60`,
//                         transition: "width 1.1s cubic-bezier(0.34,1.56,0.64,1)",
//                       }} />
//                     </div>
//                     <div style={{ width: 52, textAlign: "right", fontSize: 11, color: item.color, fontFamily: "monospace", flexShrink: 0 }}>
//                       {item.value.toFixed(1)}%
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── Heatmap Tab ── */}
//         {activeTab === "heatmap" && (
//           <div style={{ animation: "fadeUp 0.3s ease" }}>
//             <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
//               <div>
//                 <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.2em", marginBottom: 10 }}>AI ANOMALY HEATMAP</div>
//                 <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(245,158,11,0.25)" }}>
//                   <img
//                     src={getAssetUrl(runId, "heatmap")}
//                     alt="Heatmap"
//                     style={{ width: "100%", display: "block" }}
//                     onError={(e) => { e.currentTarget.style.opacity = "0.2"; }}
//                   />
//                   <div style={{ position: "absolute", top: 10, right: 12, background: "rgba(0,0,0,0.75)", color: "#f59e0b", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}>
//                     🔥 FIRE COLORMAP
//                   </div>
//                   {/* Legend */}
//                   <div style={{ position: "absolute", bottom: 10, left: 12, background: "rgba(0,0,0,0.8)", padding: "8px 12px", borderRadius: 8 }}>
//                     <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6, fontFamily: "monospace" }}>INTENSITY SCALE</div>
//                     <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
//                       {["#000080","#0000ff","#00ffff","#00ff00","#ffff00","#ff8000","#ff0000"].map((c, i) => (
//                         <div key={i} style={{ width: 24, height: 14, background: c }} />
//                       ))}
//                     </div>
//                     <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 9, color: "#64748b", fontFamily: "monospace" }}>
//                       <span>LOW</span><span>HIGH</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                 <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 18 }}>
//                   <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em", marginBottom: 10 }}>HEATMAP GUIDE</div>
//                   {[
//                     { color: "#ef4444", label: "Critical change zone" },
//                     { color: "#f59e0b", label: "High intensity anomaly" },
//                     { color: "#eab308", label: "Moderate change" },
//                     { color: "#22c55e", label: "Low activity" },
//                     { color: "#1e3a5f", label: "No change detected" },
//                   ].map((item, i) => (
//                     <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
//                       <div style={{ width: 14, height: 14, borderRadius: 3, background: item.color, flexShrink: 0, boxShadow: `0 0 6px ${item.color}60` }} />
//                       <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{item.label}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 18 }}>
//                   <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em", marginBottom: 12 }}>STATS</div>
//                   <div style={{ fontSize: 28, fontWeight: 700, color: sev.color, fontFamily: "monospace" }}>{anomalyPct.toFixed(1)}%</div>
//                   <div style={{ fontSize: 10, color: "#475569", marginBottom: 12 }}>pixels above threshold</div>
//                   <div style={{ fontSize: 18, fontWeight: 700, color: "#38bdf8", fontFamily: "monospace" }}>{scoreP95.toFixed(4)}</div>
//                   <div style={{ fontSize: 10, color: "#475569" }}>95th percentile score</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── Overlay Tab ── */}
//         {activeTab === "overlay" && (
//           <div style={{ animation: "fadeUp 0.3s ease" }}>
//             <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
//               <div>
//                 <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.2em", marginBottom: 10 }}>CHANGE DETECTION OVERLAY</div>
//                 <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(99,102,241,0.25)" }}>
//                   <img
//                     src={getAssetUrl(runId, "overlay")}
//                     alt="Overlay"
//                     style={{ width: "100%", display: "block" }}
//                     onError={(e) => { e.currentTarget.style.opacity = "0.2"; }}
//                   />
//                   <div style={{ position: "absolute", top: 10, right: 12, background: "rgba(0,0,0,0.75)", color: "#818cf8", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}>
//                     🎯 ANOMALY MASK
//                   </div>
//                 </div>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                 <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: 18 }}>
//                   <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em", marginBottom: 10 }}>OVERLAY GUIDE</div>
//                   <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.8, fontFamily: "monospace" }}>
//                     Red/highlighted regions are areas where the model detected statistically significant changes between T₀ and T₁.<br /><br />
//                     The overlay is superimposed on the T₁ image for spatial context.
//                   </div>
//                 </div>
//                 <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 18 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
//                     <div style={{ width: 16, height: 16, borderRadius: 3, background: "#ef4444" }} />
//                     <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>Detected anomaly region</span>
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                     <div style={{ width: 16, height: 16, borderRadius: 3, background: "rgba(255,255,255,0.08)" }} />
//                     <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>No significant change</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── Metrics Tab ── */}
//         {activeTab === "metrics" && (
//           <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeUp 0.3s ease" }}>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
//               <MetricCard label="Anomaly Pixels" value={anomalyPct.toFixed(1)} unit="%" color={sev.color} icon="⚡" />
//               <MetricCard label="Mean Score" value={scoreMean.toFixed(4)} unit="" color="#38bdf8" icon="📈" />
//               <MetricCard label="95th Percentile" value={scoreP95.toFixed(4)} unit="" color="#818cf8" icon="🎯" />
//             </div>
//             <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24 }}>
//               <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.2em", marginBottom: 18 }}>FULL METRICS DUMP</div>
//               <pre style={{
//                 fontFamily: "monospace", fontSize: 12, color: "#94a3b8", lineHeight: 1.8,
//                 background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 8, overflow: "auto",
//                 border: "1px solid rgba(255,255,255,0.04)", maxHeight: 320,
//               }}>
//                 {JSON.stringify(run.metrics, null, 2)}
//               </pre>
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
//               {[
//                 { label: "Run ID", value: runId.slice(0, 8) + "…", icon: "🔢" },
//                 { label: "Status", value: run.status?.toUpperCase() ?? "DONE", icon: "✅" },
//                 { label: "Assets", value: Object.keys(run.assets ?? {}).length + " files", icon: "📦" },
//               ].map((item, i) => (
//                 <div key={i} style={{
//                   background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
//                   borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
//                 }}>
//                   <span style={{ fontSize: 22 }}>{item.icon}</span>
//                   <div>
//                     <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em" }}>{item.label}</div>
//                     <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginTop: 2, fontFamily: "monospace" }}>{item.value}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getRun, getAssetUrl, type RunData } from "../../api-client";

function CompareSlider({ beforeUrl, afterUrl }: { beforeUrl: string; afterUrl: string }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, (clientX - rect.left) / rect.width * 100)));
  }, []);

  useEffect(() => {
    const up = () => { dragging.current = false; };
    const move = (e: MouseEvent) => handleMove(e.clientX);
    const tmove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchend", up);
    window.addEventListener("touchmove", tmove);
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", move); window.removeEventListener("touchend", up); window.removeEventListener("touchmove", tmove); };
  }, [handleMove]);

  return (
    <div ref={containerRef} style={{ position:"relative", width:"100%", aspectRatio:"1/1", cursor:"col-resize", borderRadius:20, overflow:"hidden", userSelect:"none", background:"#040b18", border:"1px solid rgba(255,255,255,0.08)" }}
      onMouseDown={() => { dragging.current = true; }} onTouchStart={() => { dragging.current = true; }}>
      <img src={afterUrl} alt="After" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
      <div style={{ position:"absolute", inset:0, overflow:"hidden", width:`${pos}%` }}>
        <img src={beforeUrl} alt="Before" style={{ position:"absolute", top:0, left:0, width:`${10000/pos}%`, height:"100%", objectFit:"cover", maxWidth:"none" }} />
      </div>
      {/* Divider */}
      <div style={{ position:"absolute", top:0, bottom:0, left:`${pos}%`, width:3, background:"white", boxShadow:"0 0 20px rgba(255,255,255,0.9)", transform:"translateX(-50%)", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:48, height:48, borderRadius:"50%", background:"white", boxShadow:"0 0 24px rgba(255,255,255,0.8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#1e293b", fontWeight:900, pointerEvents:"none" }}>⇔</div>
      </div>
      <div style={{ position:"absolute", top:14, left:16, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", color:"#22c55e", padding:"6px 16px", borderRadius:100, fontSize:14, fontWeight:800, pointerEvents:"none", letterSpacing:"0.05em" }}>T₀ BEFORE</div>
      <div style={{ position:"absolute", top:14, right:16, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", color:"#f87171", padding:"6px 16px", borderRadius:100, fontSize:14, fontWeight:800, pointerEvents:"none", letterSpacing:"0.05em" }}>T₁ AFTER</div>
      <div style={{ position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", color:"rgba(255,255,255,0.6)", padding:"5px 16px", borderRadius:100, fontSize:13, pointerEvents:"none" }}>← drag to compare →</div>
    </div>
  );
}

function MetricCard({ icon, label, value, unit, color }: { icon:string; label:string; value:string; unit:string; color:string }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"24px 20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <span style={{ fontSize:22 }}>{icon}</span>
        <span style={{ fontSize:13, color:"#64748b", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</span>
      </div>
      <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
        <span style={{ fontSize:36, fontWeight:900, color, lineHeight:1 }}>{value}</span>
        <span style={{ fontSize:16, color:"#475569", fontWeight:500 }}>{unit}</span>
      </div>
    </div>
  );
}

function ScoreRing({ score, max=100, label, color }: { score:number; max?:number; label:string; color:string }) {
  const pct = Math.min(score/max, 1);
  const r = 52, c = 2*Math.PI*r;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
      <svg width={130} height={130} viewBox="0 0 130 130">
        <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10}/>
        <circle cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${pct*c} ${c}`} strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition:"stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)", filter:`drop-shadow(0 0 8px ${color})` }}/>
        <text x={65} y={58} textAnchor="middle" fill="white" fontSize={22} fontWeight={900} fontFamily="Inter,sans-serif">{score.toFixed(1)}</text>
        <text x={65} y={76} textAnchor="middle" fill="#475569" fontSize={12} fontFamily="Inter,sans-serif">/{max}</text>
      </svg>
      <div style={{ fontSize:14, color:"#64748b", fontWeight:600, textAlign:"center" }}>{label}</div>
    </div>
  );
}

function BarRow({ label, value, max, color }: { label:string; value:number; max:number; color:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
      <div style={{ width:140, fontSize:14, color:"#94a3b8", fontWeight:500, flexShrink:0 }}>{label}</div>
      <div style={{ flex:1, height:20, background:"rgba(255,255,255,0.04)", borderRadius:10, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:10, background:color, width:`${Math.min(value/max*100, 100)}%`, boxShadow:`0 0 10px ${color}60`, transition:"width 1.1s cubic-bezier(0.34,1.56,0.64,1)" }}/>
      </div>
      <div style={{ width:60, textAlign:"right", fontSize:14, color, fontWeight:700, flexShrink:0 }}>{value.toFixed(1)}%</div>
    </div>
  );
}

function getSeverity(pct: number) {
  if(pct>15) return { label:"CRITICAL", color:"#f87171", bg:"rgba(248,113,113,0.08)", border:"rgba(248,113,113,0.25)", icon:"🚨" };
  if(pct>7)  return { label:"MODERATE", color:"#fb923c", bg:"rgba(251,146,60,0.08)",  border:"rgba(251,146,60,0.25)",  icon:"⚠️" };
  return           { label:"LOW",      color:"#34d399", bg:"rgba(52,211,153,0.08)",   border:"rgba(52,211,153,0.25)",  icon:"✅" };
}

export default function RunPage({ params }: { params: Promise<{ runId: string }> }) {
  const router = useRouter();
  const [run, setRun] = useState<RunData|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [runId, setRunId] = useState("");
  const [activeTab, setActiveTab] = useState<"compare"|"heatmap"|"overlay"|"metrics">("compare");

  useEffect(()=>{ params.then(({runId:id})=>setRunId(id)); },[params]);

  useEffect(()=>{
    if(!runId) return;
    getRun(runId).then(data=>{ setRun(data); setLoading(false); }).catch(e=>{ setError(e.message); setLoading(false); });
  },[runId]);

  if(loading) return (
    <div style={{minHeight:"100vh",background:"#040b18",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:24}}>🛰️</div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:20}}>
          {[0,1,2].map(i=><div key={i} style={{width:12,height:12,borderRadius:"50%",background:"#6366f1",animation:"bounce 0.8s ease infinite",animationDelay:`${i*0.15}s`}}/>)}
        </div>
        <div style={{fontSize:18,color:"#64748b",fontWeight:600}}>Processing satellite data…</div>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      </div>
    </div>
  );

  if(error||!run) return (
    <div style={{minHeight:"100vh",background:"#040b18",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,sans-serif"}}>
      <div style={{textAlign:"center",color:"white"}}>
        <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
        <div style={{fontSize:18,color:"#f87171",marginBottom:24,fontWeight:600}}>{error||"Run not found"}</div>
        <button onClick={()=>router.push("/")} style={{padding:"12px 32px",background:"rgba(99,102,241,0.15)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:12,color:"#818cf8",fontSize:16,cursor:"pointer",fontWeight:700}}>← Back to Home</button>
      </div>
    </div>
  );

  const metrics = run.metrics?.global ?? {};
  const anomalyPct: number = metrics.anomaly_pixels_pct ?? 0;
  const scoreMean: number = metrics.score_mean ?? 0;
  const scoreP95: number = metrics.score_p95 ?? 0;
  const sev = getSeverity(anomalyPct);

  const tabs = [
    { id:"compare" as const, label:"⇔  Compare" },
    { id:"heatmap" as const, label:"🔥  Heatmap" },
    { id:"overlay" as const, label:"🎯  Overlay" },
    { id:"metrics" as const, label:"📊  Metrics" },
  ];

  return (
    <div style={{minHeight:"100vh",background:"#040b18",color:"white",fontFamily:"'Inter','Segoe UI',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .tab-btn:hover{color:#f1f5f9 !important;}
        .tab-btn{transition:all 0.2s ease;}
      `}</style>

      {/* BG glow */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse at 20% 20%,rgba(99,102,241,0.1) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(56,189,248,0.07) 0%,transparent 50%)"}}/>

      {/* Header */}
      <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(4,11,24,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 48px"}}>
        <div style={{maxWidth:1300,margin:"0 auto",height:72,display:"flex",alignItems:"center",gap:16}}>
          <button onClick={()=>router.push("/")} style={{padding:"10px 20px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#94a3b8",fontSize:15,cursor:"pointer",fontWeight:600}}>← Home</button>
          <div style={{width:1,height:32,background:"rgba(255,255,255,0.07)"}}/>
          <div style={{width:40,height:40,borderRadius:10,background:"linear-gradient(135deg,#6366f1,#38bdf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛰️</div>
          <div>
            <div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>Anomaly Detection Results</div>
            <div style={{fontSize:12,color:"#475569"}}>Run · {runId.slice(0,8).toUpperCase()}</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10,padding:"8px 20px",background:sev.bg,border:`1px solid ${sev.border}`,borderRadius:100}}>
            <span style={{fontSize:16}}>{sev.icon}</span>
            <span style={{fontSize:15,color:sev.color,fontWeight:800,letterSpacing:"0.05em"}}>{sev.label}</span>
          </div>
        </div>
      </header>

      <div style={{maxWidth:1300,margin:"0 auto",padding:"40px 48px 80px",position:"relative",zIndex:1}}>

        {/* Severity banner */}
        <div style={{background:sev.bg,border:`1px solid ${sev.border}`,borderRadius:20,padding:"24px 32px",marginBottom:32,display:"flex",alignItems:"center",justifyContent:"space-between",animation:"fadeUp 0.4s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <span style={{fontSize:48}}>{sev.icon}</span>
            <div>
              <div style={{fontSize:24,fontWeight:900,color:sev.color,letterSpacing:"0.02em",marginBottom:4}}>{sev.label} ANOMALY DETECTED</div>
              <div style={{fontSize:15,color:"#64748b"}}>AI-powered temporal change analysis complete · Run {runId.slice(0,8)}</div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:52,fontWeight:900,color:sev.color,lineHeight:1}}>{anomalyPct.toFixed(1)}%</div>
            <div style={{fontSize:14,color:"#475569",fontWeight:500,marginTop:4}}>ANOMALY PIXELS</div>
          </div>
        </div>

        {/* Metric cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:32,animation:"fadeUp 0.5s ease"}}>
          <MetricCard icon="⚡" label="Anomaly Pixels" value={anomalyPct.toFixed(1)} unit="%" color={sev.color}/>
          <MetricCard icon="📈" label="Mean Score" value={scoreMean.toFixed(4)} unit="" color="#38bdf8"/>
          <MetricCard icon="🎯" label="95th Percentile" value={scoreP95.toFixed(4)} unit="" color="#818cf8"/>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,marginBottom:28,background:"rgba(255,255,255,0.03)",padding:6,borderRadius:14,width:"fit-content",animation:"fadeUp 0.55s ease"}}>
          {tabs.map(t=>(
            <button key={t.id} className="tab-btn" onClick={()=>setActiveTab(t.id)} style={{
              padding:"12px 28px",borderRadius:10,border:"none",cursor:"pointer",
              background:activeTab===t.id?"rgba(99,102,241,0.2)":"transparent",
              color:activeTab===t.id?"#818cf8":"#64748b",
              fontSize:16,fontWeight:activeTab===t.id?700:500,
              borderBottom:activeTab===t.id?"2px solid #818cf8":"2px solid transparent",
              fontFamily:"Inter,sans-serif",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── Compare Tab ── */}
        {activeTab==="compare"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,animation:"fadeUp 0.3s ease"}}>
            <div>
              <div style={{fontSize:13,color:"#475569",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Interactive Comparison Slider</div>
              <CompareSlider beforeUrl={getAssetUrl(runId,"t0_rgb")} afterUrl={getAssetUrl(runId,"t1_rgb")}/>
              <div style={{marginTop:14,padding:"14px 18px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,fontSize:14,color:"#475569",lineHeight:1.7}}>
                Drag the white handle left/right to reveal changes. <span style={{color:"#22c55e",fontWeight:600}}>T₀ = baseline</span>, <span style={{color:"#f87171",fontWeight:600}}>T₁ = target image</span>.
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"28px",display:"flex",justifyContent:"space-around"}}>
                <ScoreRing score={anomalyPct} max={100} label="Anomaly %" color={sev.color}/>
                <ScoreRing score={Math.min(scoreMean*1000,100)} max={100} label="Mean ×1000" color="#38bdf8"/>
                <ScoreRing score={Math.min(scoreP95*1000,100)} max={100} label="P95 ×1000" color="#818cf8"/>
              </div>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:"24px 28px",flex:1}}>
                <div style={{fontSize:13,color:"#475569",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:20}}>Change Intensity Scale</div>
                <BarRow label="Anomaly Pixels" value={anomalyPct} max={100} color={sev.color}/>
                <BarRow label="Mean Score" value={scoreMean*100} max={100} color="#38bdf8"/>
                <BarRow label="P95 Score" value={scoreP95*100} max={100} color="#818cf8"/>
              </div>
            </div>
          </div>
        )}

        {/* ── Heatmap Tab ── */}
        {activeTab==="heatmap"&&(
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24,animation:"fadeUp 0.3s ease"}}>
            <div>
              <div style={{fontSize:13,color:"#475569",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>AI Anomaly Heatmap</div>
              <div style={{position:"relative",borderRadius:20,overflow:"hidden",border:"1px solid rgba(251,146,60,0.2)"}}>
                <img src={getAssetUrl(runId,"heatmap")} alt="Heatmap" style={{width:"100%",display:"block"}} onError={e=>{e.currentTarget.style.opacity="0.2";}}/>
                <div style={{position:"absolute",top:14,right:16,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",color:"#fb923c",padding:"6px 16px",borderRadius:100,fontSize:14,fontWeight:800}}>🔥 JET COLORMAP</div>
                <div style={{position:"absolute",bottom:14,left:14,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",padding:"10px 16px",borderRadius:12}}>
                  <div style={{fontSize:11,color:"#64748b",marginBottom:6,fontWeight:600,letterSpacing:"0.1em"}}>INTENSITY SCALE</div>
                  <div style={{display:"flex",borderRadius:4,overflow:"hidden",width:180,height:16}}>
                    {["#000080","#0000ff","#00ffff","#00ff00","#ffff00","#ff8000","#ff0000"].map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:11,color:"#475569",fontWeight:600}}><span>LOW</span><span>HIGH</span></div>
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{background:"rgba(251,146,60,0.06)",border:"1px solid rgba(251,146,60,0.15)",borderRadius:16,padding:24}}>
                <div style={{fontSize:13,color:"#475569",fontWeight:600,letterSpacing:"0.1em",marginBottom:16}}>COLOR GUIDE</div>
                {[
                  {color:"#ff0000",label:"Critical anomaly zone"},
                  {color:"#ff8000",label:"High intensity change"},
                  {color:"#ffff00",label:"Moderate change"},
                  {color:"#00ff00",label:"Low activity"},
                  {color:"#0000ff",label:"No change detected"},
                ].map((item,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                    <div style={{width:16,height:16,borderRadius:4,background:item.color,flexShrink:0,boxShadow:`0 0 8px ${item.color}60`}}/>
                    <span style={{fontSize:15,color:"#94a3b8",fontWeight:500}}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:24}}>
                <div style={{fontSize:36,fontWeight:900,color:sev.color,marginBottom:4}}>{anomalyPct.toFixed(1)}%</div>
                <div style={{fontSize:14,color:"#475569",marginBottom:20,fontWeight:500}}>pixels above threshold</div>
                <div style={{fontSize:24,fontWeight:800,color:"#38bdf8",marginBottom:4}}>{scoreP95.toFixed(4)}</div>
                <div style={{fontSize:14,color:"#475569",fontWeight:500}}>95th percentile score</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Overlay Tab ── */}
        {activeTab==="overlay"&&(
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24,animation:"fadeUp 0.3s ease"}}>
            <div>
              <div style={{fontSize:13,color:"#475569",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Change Detection Overlay</div>
              <div style={{position:"relative",borderRadius:20,overflow:"hidden",border:"1px solid rgba(129,140,248,0.2)"}}>
                <img src={getAssetUrl(runId,"overlay")} alt="Overlay" style={{width:"100%",display:"block"}} onError={e=>{e.currentTarget.style.opacity="0.2";}}/>
                <div style={{position:"absolute",top:14,right:16,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",color:"#818cf8",padding:"6px 16px",borderRadius:100,fontSize:14,fontWeight:800}}>🎯 ANOMALY MASK</div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{background:"rgba(129,140,248,0.06)",border:"1px solid rgba(129,140,248,0.15)",borderRadius:16,padding:24}}>
                <div style={{fontSize:13,color:"#475569",fontWeight:600,letterSpacing:"0.1em",marginBottom:16}}>OVERLAY GUIDE</div>
                <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:16}}>
                  <div style={{width:20,height:20,borderRadius:4,background:"#ef4444",flexShrink:0,marginTop:2}}/>
                  <div style={{fontSize:15,color:"#94a3b8",lineHeight:1.6,fontWeight:500}}>Red regions indicate detected anomaly zones with statistically significant change</div>
                </div>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <div style={{width:20,height:20,borderRadius:4,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.15)",flexShrink:0,marginTop:2}}/>
                  <div style={{fontSize:15,color:"#94a3b8",lineHeight:1.6,fontWeight:500}}>Unchanged areas retain original T₁ image appearance</div>
                </div>
              </div>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:24,fontSize:15,color:"#64748b",lineHeight:1.8,fontWeight:400}}>
                The overlay is computed using pixel-wise absolute difference with morphological cleanup, then blended at 55% opacity over the T₁ target image.
              </div>
            </div>
          </div>
        )}

        {/* ── Metrics Tab ── */}
        {activeTab==="metrics"&&(
          <div style={{display:"flex",flexDirection:"column",gap:24,animation:"fadeUp 0.3s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              <MetricCard icon="⚡" label="Anomaly Pixels" value={anomalyPct.toFixed(2)} unit="%" color={sev.color}/>
              <MetricCard icon="📈" label="Mean Score" value={scoreMean.toFixed(4)} unit="" color="#38bdf8"/>
              <MetricCard icon="🎯" label="95th Percentile" value={scoreP95.toFixed(4)} unit="" color="#818cf8"/>
            </div>
            <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:28}}>
              <div style={{fontSize:13,color:"#475569",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:18}}>Full Metrics Output</div>
              <pre style={{fontFamily:"'Courier New',monospace",fontSize:14,color:"#94a3b8",lineHeight:1.9,background:"rgba(0,0,0,0.4)",padding:20,borderRadius:12,overflow:"auto",border:"1px solid rgba(255,255,255,0.04)",maxHeight:340}}>
                {JSON.stringify(run.metrics,null,2)}
              </pre>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {[
                {label:"Run ID",value:runId.slice(0,8)+"…",icon:"🔢"},
                {label:"Status",value:(run.status??"done").toUpperCase(),icon:"✅"},
                {label:"Assets",value:Object.keys(run.assets??{}).length+" files",icon:"📦"},
              ].map((item,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"20px 22px",display:"flex",alignItems:"center",gap:14}}>
                  <span style={{fontSize:28}}>{item.icon}</span>
                  <div>
                    <div style={{fontSize:13,color:"#475569",fontWeight:600,marginBottom:4}}>{item.label}</div>
                    <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9"}}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
