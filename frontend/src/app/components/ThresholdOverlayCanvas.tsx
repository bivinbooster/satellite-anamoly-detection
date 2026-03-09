// "use client";

// import React, { useEffect, useRef } from "react";

// function loadImg(src: string): Promise<HTMLImageElement> {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = src;
//   });
// }

// export default function ThresholdOverlayCanvas({
//   baseSrc,        // t1_rgb
//   anomalyU8Src,   // anomaly_u8 grayscale 0..255
//   threshold,      // 0..1
//   opacity = 0.45,
//   className = "",
// }: {
//   baseSrc: string;
//   anomalyU8Src: string;
//   threshold: number;
//   opacity?: number;
//   className?: string;
// }) {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     let cancelled = false;

//     async function render() {
//       const canvas = canvasRef.current;
//       if (!canvas) return;

//       const [base, anom] = await Promise.all([loadImg(baseSrc), loadImg(anomalyU8Src)]);
//       if (cancelled) return;

//       const w = base.naturalWidth;
//       const h = base.naturalHeight;

//       canvas.width = w;
//       canvas.height = h;

//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;

//       // Draw base (t1)
//       ctx.clearRect(0, 0, w, h);
//       ctx.drawImage(base, 0, 0, w, h);

//       // Read anomaly pixels
//       const tmp = document.createElement("canvas");
//       tmp.width = w;
//       tmp.height = h;
//       const tctx = tmp.getContext("2d")!;
//       tctx.drawImage(anom, 0, 0, w, h);
//       const anomData = tctx.getImageData(0, 0, w, h).data;

//       const imgData = ctx.getImageData(0, 0, w, h);
//       const data = imgData.data;

//       const thrU8 = Math.floor(Math.max(0, Math.min(1, threshold)) * 255);

//       for (let i = 0; i < w * h; i++) {
//         const j = i * 4;
//         const a = anomData[j]; // grayscale in R channel
//         if (a >= thrU8) {
//           // blend red
//           data[j] = Math.round((1 - opacity) * data[j] + opacity * 255);
//           data[j + 1] = Math.round((1 - opacity) * data[j + 1] + opacity * 0);
//           data[j + 2] = Math.round((1 - opacity) * data[j + 2] + opacity * 0);
//         }
//       }

//       ctx.putImageData(imgData, 0, 0);
//     }

//     render().catch(() => {});
//     return () => {
//       cancelled = true;
//     };
//   }, [baseSrc, anomalyU8Src, threshold, opacity]);

//   return <canvas ref={canvasRef} className={className} style={{ width: "100%", height: "auto" }} />;
// }


// "use client";

// import React, { useEffect, useRef } from "react";

// function loadImg(src: string): Promise<HTMLImageElement> {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = src;
//   });
// }

// export default function ThresholdOverlayCanvas({
//   baseSrc,
//   anomalyU8Src,
//   threshold,
//   opacity = 0.45,
//   className = "",
// }: {
//   baseSrc: string;
//   anomalyU8Src: string;
//   threshold: number;
//   opacity?: number;
//   className?: string;
// }) {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     let cancelled = false;

//     async function render() {
//       const canvas = canvasRef.current;
//       if (!canvas) return;

//       const [base, anom] = await Promise.all([
//         loadImg(baseSrc),
//         loadImg(anomalyU8Src),
//       ]);
//       if (cancelled) return;

//       const w = base.naturalWidth;
//       const h = base.naturalHeight;

//       // Set canvas drawing buffer size (not CSS size)
//       canvas.width = w;
//       canvas.height = h;

//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;

//       // Draw base
//       ctx.drawImage(base, 0, 0);

//       // Read anomaly pixels
//       const tmp = document.createElement("canvas");
//       tmp.width = w;
//       tmp.height = h;
//       const tctx = tmp.getContext("2d")!;
//       tctx.drawImage(anom, 0, 0);
//       const anomData = tctx.getImageData(0, 0, w, h).data;

//       const imgData = ctx.getImageData(0, 0, w, h);
//       const data = imgData.data;

//       const thrU8 = Math.floor(Math.max(0, Math.min(1, threshold)) * 255);

//       for (let i = 0; i < w * h; i++) {
//         const j = i * 4;
//         const a = anomData[j]; // grayscale value
//         if (a >= thrU8) {
//           // Blend red
//           data[j] = Math.round((1 - opacity) * data[j] + opacity * 255);
//           data[j + 1] = Math.round((1 - opacity) * data[j + 1] + opacity * 0);
//           data[j + 2] = Math.round((1 - opacity) * data[j + 2] + opacity * 0);
//         }
//       }

//       ctx.putImageData(imgData, 0, 0);
//     }

//     render().catch(console.error);
//     return () => {
//       cancelled = true;
//     };
//   }, [baseSrc, anomalyU8Src, threshold, opacity]);

//   // CSS controls display size, canvas.width/height controls resolution
//   return (
//     <canvas
//       ref={canvasRef}
//       className={className}
//       style={{ width: "100%", height: "auto", display: "block" }}
//     />
//   );
// }



"use client";

import React, { useEffect, useRef } from "react";

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function ThresholdOverlayCanvas({
  baseSrc,
  anomalyU8Src,
  threshold,
  opacity = 0.45,
  className = "",
}: {
  baseSrc: string;
  anomalyU8Src: string;
  threshold: number;
  opacity?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const [base, anom] = await Promise.all([loadImg(baseSrc), loadImg(anomalyU8Src)]);
        if (cancelled) return;

        const w = base.naturalWidth;
        const h = base.naturalHeight;

        // Limit canvas size for better performance
        const maxSize = 600;
        const scale = Math.min(1, maxSize / Math.max(w, h));
        canvas.width = w * scale;
        canvas.height = h * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw base
        ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

        // Read anomaly pixels
        const tmp = document.createElement("canvas");
        tmp.width = w;
        tmp.height = h;
        const tctx = tmp.getContext("2d")!;
        tctx.drawImage(anom, 0, 0);
        const anomData = tctx.getImageData(0, 0, w, h).data;

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const thrU8 = Math.floor(Math.max(0, Math.min(1, threshold)) * 255);

        for (let i = 0; i < canvas.width * canvas.height; i++) {
          const j = i * 4;
          const sourceIdx = Math.floor((i / (canvas.width * canvas.height)) * w * h) * 4;
          const a = anomData[sourceIdx];

          if (a >= thrU8) {
            data[j] = Math.round((1 - opacity) * data[j] + opacity * 255);
            data[j + 1] = Math.round((1 - opacity) * data[j + 1] + opacity * 0);
            data[j + 2] = Math.round((1 - opacity) * data[j + 2] + opacity * 0);
          }
        }

        ctx.putImageData(imgData, 0, 0);
      } catch (err) {
        console.error("Error rendering canvas:", err);
      }
    }

    render().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [baseSrc, anomalyU8Src, threshold, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "auto", display: "block", maxHeight: "600px" }}
    />
  );
}