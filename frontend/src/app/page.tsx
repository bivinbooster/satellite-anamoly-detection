// "use client";

// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();

//   return (
//     <div style={{
//       minHeight: "100vh", background: "#070d1a", color: "white",
//       fontFamily: "'Courier New', 'Lucida Console', monospace",
//       display: "flex", flexDirection: "column",
//     }}>
//       {/* Scanline overlay */}
//       <div style={{
//         position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
//         backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)",
//       }} />

//       {/* Grid background */}
//       <div style={{
//         position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.04,
//         backgroundImage: "linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)",
//         backgroundSize: "60px 60px",
//       }} />

//       <style>{`
//         @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
//         @keyframes orbit{from{transform:rotate(0deg) translateX(120px)}to{transform:rotate(360deg) translateX(120px)}}
//         @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(56,189,248,0.3)}50%{box-shadow:0 0 40px rgba(56,189,248,0.7)}}
//         .card-hover{transition:all 0.25s ease;cursor:default}
//         .card-hover:hover{transform:translateY(-4px);border-color:rgba(56,189,248,0.3) !important;background:rgba(56,189,248,0.05) !important}
//         .btn-primary{transition:all 0.2s ease;}
//         .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(56,189,248,0.35) !important;}
//         .btn-secondary{transition:all 0.2s ease;}
//         .btn-secondary:hover{background:rgba(255,255,255,0.07) !important;border-color:rgba(255,255,255,0.2) !important;}
//       `}</style>

//       {/* Header */}
//       <div style={{
//         position: "relative", zIndex: 10,
//         borderBottom: "1px solid rgba(56,189,248,0.15)",
//         padding: "18px 40px", display: "flex", alignItems: "center", gap: 14,
//         background: "rgba(7,13,26,0.8)", backdropFilter: "blur(12px)",
//       }}>
//         <div style={{
//           width: 34, height: 34, borderRadius: 8,
//           background: "linear-gradient(135deg, #38bdf8, #818cf8)",
//           display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
//         }}>🛰️</div>
//         <div>
//           <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", color: "#e2e8f0" }}>SATELLITE ANOMALY STUDIO</div>
//           <div style={{ fontSize: 9, color: "#334155", letterSpacing: "0.2em" }}>CHANGE DETECTION · TEMPORAL ANALYSIS · AI INSIGHTS</div>
//         </div>
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
//           <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
//           <span style={{ fontSize: 10, color: "#22c55e", letterSpacing: "0.12em" }}>SYSTEM ONLINE</span>
//         </div>
//       </div>

//       {/* Hero */}
//       <div style={{
//         flex: 1, position: "relative", zIndex: 1,
//         display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//         padding: "60px 24px",
//       }}>

//         {/* Satellite orbit decoration */}
//         <div style={{
//           position: "absolute", top: "50%", left: "50%",
//           width: 280, height: 280, borderRadius: "50%",
//           border: "1px dashed rgba(56,189,248,0.08)",
//           transform: "translate(-50%, -50%)",
//           pointerEvents: "none",
//         }} />

//         {/* Badge */}
//         <div style={{
//           display: "inline-flex", alignItems: "center", gap: 8,
//           padding: "6px 18px",
//           background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)",
//           borderRadius: 100, marginBottom: 32,
//           animation: "fadeUp 0.4s ease",
//         }}>
//           <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8", animation: "pulse 2s infinite" }} />
//           <span style={{ fontSize: 11, color: "#38bdf8", letterSpacing: "0.15em" }}>AI-POWERED · SATELLITE IMAGERY ANALYSIS</span>
//         </div>

//         {/* Title */}
//         <h1 style={{
//           fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800,
//           lineHeight: 1.1, textAlign: "center", marginBottom: 24,
//           animation: "fadeUp 0.5s ease",
//           letterSpacing: "-0.02em",
//         }}>
//           <span style={{ color: "#e2e8f0" }}>SATELLITE</span>
//           <br />
//           <span style={{
//             background: "linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8)",
//             backgroundSize: "200%",
//             WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//           }}>CHANGE DETECTION</span>
//         </h1>

//         {/* Subtitle */}
//         <p style={{
//           fontSize: "clamp(13px, 2vw, 17px)", color: "#64748b", maxWidth: 540,
//           textAlign: "center", lineHeight: 1.8, marginBottom: 48,
//           animation: "fadeUp 0.6s ease",
//           fontFamily: "monospace",
//         }}>
//           Upload a pair of satellite images. The AI detects temporal anomalies,
//           generates heatmaps, and delivers precise change analysis — in seconds.
//         </p>

//         {/* CTA Buttons */}
//         <div style={{
//           display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
//           marginBottom: 80, animation: "fadeUp 0.7s ease",
//         }}>
//           <button
//             className="btn-primary"
//             onClick={() => router.push("/analysis")}
//             style={{
//               padding: "14px 36px",
//               background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
//               border: "none", borderRadius: 10, color: "white",
//               fontSize: 13, fontFamily: "monospace", fontWeight: 700,
//               letterSpacing: "0.15em", cursor: "pointer",
//               display: "flex", alignItems: "center", gap: 10,
//               boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
//             }}>
//             ⚡ START ANALYSIS
//             <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
//             </svg>
//           </button>
//           <button
//             className="btn-secondary"
//             style={{
//               padding: "14px 36px",
//               background: "rgba(255,255,255,0.04)",
//               border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8",
//               fontSize: 13, fontFamily: "monospace", cursor: "pointer", letterSpacing: "0.12em",
//             }}>
//             📖 VIEW DOCS
//           </button>
//         </div>

//         {/* Feature cards */}
//         <div style={{
//           display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
//           maxWidth: 820, width: "100%", animation: "fadeUp 0.8s ease",
//         }}>
//           {[
//             { icon: "🤖", title: "DEEP LEARNING", desc: "Neural network-based pixel-wise change detection across spectral bands", color: "#818cf8" },
//             { icon: "🔥", title: "HEATMAP ANALYSIS", desc: "Fire, Viridis & Plasma colormaps to visualize anomaly intensity", color: "#f59e0b" },
//             { icon: "⇔", title: "COMPARE SLIDER", desc: "Interactive drag-to-reveal slider for precise before/after comparison", color: "#38bdf8" },
//           ].map((f, i) => (
//             <div key={i} className="card-hover" style={{
//               background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
//               borderRadius: 14, padding: "24px 20px",
//             }}>
//               <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
//               <div style={{ fontSize: 11, fontWeight: 700, color: f.color, letterSpacing: "0.15em", marginBottom: 8 }}>{f.title}</div>
//               <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.7 }}>{f.desc}</div>
//             </div>
//           ))}
//         </div>

//         {/* Stats */}
//         <div style={{
//           display: "flex", gap: 48, marginTop: 64, flexWrap: "wrap", justifyContent: "center",
//           animation: "fadeUp 0.9s ease",
//         }}>
//           {[
//             { val: "99.5%", label: "ACCURACY" },
//             { val: "< 2s", label: "PROCESSING" },
//             { val: "4K", label: "RESOLUTION" },
//             { val: "24/7", label: "UPTIME" },
//           ].map((s, i) => (
//             <div key={i} style={{ textAlign: "center" }}>
//               <div style={{
//                 fontSize: 28, fontWeight: 800, fontFamily: "'Courier New', monospace",
//                 background: "linear-gradient(135deg, #38bdf8, #818cf8)",
//                 WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//               }}>{s.val}</div>
//               <div style={{ fontSize: 9, color: "#334155", letterSpacing: "0.2em", marginTop: 4 }}>{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <div style={{
//         position: "relative", zIndex: 1,
//         borderTop: "1px solid rgba(255,255,255,0.04)",
//         padding: "16px 40px", textAlign: "center",
//         fontSize: 10, color: "#1e293b", letterSpacing: "0.15em",
//       }}>
//         SATELLITE ANOMALY STUDIO · TEMPORAL CHANGE DETECTION ENGINE
//       </div>
//     </div>
//   );
// }



"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div style={{ minHeight:"100vh", background:"#040b18", color:"white", fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes floatUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes orbitRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes twinkle{0%,100%{opacity:0.2;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        .btn-glow:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 20px 60px rgba(99,102,241,0.5) !important;}
        .btn-glow{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);}
        .card-lift:hover{transform:translateY(-8px);border-color:rgba(99,102,241,0.4) !important;box-shadow:0 20px 40px rgba(0,0,0,0.4) !important;}
        .card-lift{transition:all 0.3s ease;}
        .stat-item:hover .stat-val{transform:scale(1.1);}
        .stat-val{transition:transform 0.2s ease;display:inline-block;}
      `}</style>

      {/* Animated starfield background */}
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(56,189,248,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 70%)"}} />
        {[...Array(60)].map((_,i)=>(
          <div key={i} style={{
            position:"absolute",
            left:`${(i*37+13)%100}%`, top:`${(i*53+7)%100}%`,
            width: i%5===0?3:i%3===0?2:1, height: i%5===0?3:i%3===0?2:1,
            borderRadius:"50%", background:"white",
            animation:`twinkle ${2+i%3}s ease-in-out infinite`,
            animationDelay:`${(i*0.3)%3}s`, opacity:0.3,
          }}/>
        ))}
        {/* Orbit rings */}
        <div style={{position:"absolute",top:"50%",left:"50%",width:600,height:600,borderRadius:"50%",border:"1px solid rgba(99,102,241,0.06)",transform:"translate(-50%,-50%)"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:900,height:900,borderRadius:"50%",border:"1px solid rgba(56,189,248,0.04)",transform:"translate(-50%,-50%)"}}/>
      </div>

      {/* Header */}
      <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(4,11,24,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 48px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",height:72,display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#6366f1,#38bdf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:"0 0 20px rgba(99,102,241,0.4)"}}>🛰️</div>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",letterSpacing:"0.02em"}}>Satellite Anomaly Studio</div>
            <div style={{fontSize:12,color:"#475569",letterSpacing:"0.05em"}}>AI Change Detection Platform</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:24}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:13,color:"#22c55e",fontWeight:600}}>System Online</span>
            </div>
            <button onClick={()=>router.push("/analysis")} className="btn-glow" style={{padding:"10px 28px",background:"linear-gradient(135deg,#6366f1,#38bdf8)",border:"none",borderRadius:10,color:"white",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(99,102,241,0.35)"}}>Launch App</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main style={{position:"relative",zIndex:1,maxWidth:1200,margin:"0 auto",padding:"100px 48px 80px"}}>
        <div style={{textAlign:"center",marginBottom:80}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"10px 24px",background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:100,marginBottom:40,animation:"floatUp 0.5s ease"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#818cf8",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:14,color:"#818cf8",fontWeight:600,letterSpacing:"0.08em"}}>AI-POWERED SATELLITE IMAGERY ANALYSIS</span>
          </div>

          <h1 style={{fontSize:"clamp(52px,7vw,88px)",fontWeight:900,lineHeight:1.05,marginBottom:28,animation:"floatUp 0.6s ease",letterSpacing:"-0.03em"}}>
            <span style={{color:"#f1f5f9"}}>Detect Anomalies</span><br/>
            <span style={{background:"linear-gradient(135deg,#6366f1,#38bdf8,#a78bfa)",backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 4s ease infinite"}}>From Space</span>
          </h1>

          <p style={{fontSize:20,color:"#94a3b8",maxWidth:620,margin:"0 auto 56px",lineHeight:1.8,animation:"floatUp 0.7s ease",fontWeight:400}}>
            Upload a pair of satellite images and our AI instantly detects temporal changes,
            generates interactive heatmaps, and delivers precise anomaly analysis.
          </p>

          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",animation:"floatUp 0.8s ease"}}>
            <button onClick={()=>router.push("/analysis")} className="btn-glow" style={{
              padding:"18px 52px",background:"linear-gradient(135deg,#6366f1,#38bdf8)",border:"none",
              borderRadius:14,color:"white",fontSize:18,fontWeight:800,cursor:"pointer",
              display:"flex",alignItems:"center",gap:12,
              boxShadow:"0 8px 32px rgba(99,102,241,0.45)",letterSpacing:"0.02em",
            }}>
              <span>⚡</span> Start Analysis
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12"/></svg>
            </button>
            <button style={{padding:"18px 48px",background:"rgba(255,255,255,0.05)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:14,color:"#94a3b8",fontSize:18,fontWeight:600,cursor:"pointer",letterSpacing:"0.02em",transition:"all 0.2s ease"}}>
              View Demo
            </button>
          </div>
        </div>

        {/* Feature cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,marginBottom:80,animation:"floatUp 0.9s ease"}}>
          {[
            {icon:"🤖",title:"Deep Learning AI",desc:"Advanced neural networks analyze every pixel to detect statistically significant changes between temporal images.",color:"#818cf8",glow:"rgba(129,140,248,0.15)"},
            {icon:"🔥",title:"Heatmap Visualization",desc:"JET colormap heatmaps reveal the exact intensity and spatial distribution of detected anomalies.",color:"#fb923c",glow:"rgba(251,146,60,0.15)"},
            {icon:"⇔",title:"Interactive Comparison",desc:"Drag a slider to reveal before vs after — inspect any region of change with pixel-perfect precision.",color:"#38bdf8",glow:"rgba(56,189,248,0.15)"},
            {icon:"🎯",title:"Change Overlay",desc:"Red anomaly mask highlights exact affected zones overlaid on the target image for immediate clarity.",color:"#f87171",glow:"rgba(248,113,113,0.15)"},
            {icon:"📊",title:"Detailed Metrics",desc:"Anomaly percentage, mean score, P95 statistics and full metric dumps give you complete quantitative insight.",color:"#34d399",glow:"rgba(52,211,153,0.15)"},
            {icon:"⚡",title:"Instant Processing",desc:"Results in under 2 seconds. Upload, detect, and visualize — no waiting, no queue.",color:"#facc15",glow:"rgba(250,204,21,0.15)"},
          ].map((f,i)=>(
            <div key={i} className="card-lift" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"32px 28px",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
              <div style={{width:52,height:52,borderRadius:14,background:f.glow,border:`1px solid ${f.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:20}}>{f.icon}</div>
              <div style={{fontSize:18,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>{f.title}</div>
              <div style={{fontSize:15,color:"#64748b",lineHeight:1.7}}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"rgba(255,255,255,0.05)",borderRadius:20,overflow:"hidden",border:"1px solid rgba(255,255,255,0.08)",animation:"floatUp 1s ease"}}>
          {[
            {val:"99.5%",label:"Detection Accuracy",icon:"🎯"},
            {val:"< 2s",label:"Processing Time",icon:"⚡"},
            {val:"4K+",label:"Resolution Support",icon:"🔭"},
            {val:"24/7",label:"System Uptime",icon:"🛰️"},
          ].map((s,i)=>(
            <div key={i} className="stat-item" style={{padding:"36px 24px",textAlign:"center",background:"rgba(4,11,24,0.6)"}}>
              <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
              <div className="stat-val" style={{fontSize:36,fontWeight:900,background:"linear-gradient(135deg,#6366f1,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>{s.val}</div>
              <div style={{fontSize:14,color:"#64748b",fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{position:"relative",zIndex:1,borderTop:"1px solid rgba(255,255,255,0.05)",padding:"28px 48px",textAlign:"center",fontSize:14,color:"#334155",fontWeight:500}}>
        Satellite Anomaly Studio · AI-Powered Change Detection Platform
      </footer>
    </div>
  );
}
