"use client"

import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider"

interface ImageCompareSliderProps {
  before: string;
  after: string;
}

export default function ImageCompareSlider({before, after}: ImageCompareSliderProps){
  return (
    <div className="relative">
      {/* Labels */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-between px-4 pointer-events-none">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg border border-blue-400/30">
          📸 Before Image
        </div>
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg border border-red-400/30">
          🛰️ After Image
        </div>
      </div>

      {/* Comparison Slider */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-md">
        <div style={{ width: "100%", height: "500px" }}>
          <ReactCompareSlider
            itemOne={
              <div className="relative w-full h-full">
                <ReactCompareSliderImage 
                  src={before} 
                  alt="before"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  BASELINE
                </div>
              </div>
            }
            itemTwo={
              <div className="relative w-full h-full">
                <ReactCompareSliderImage 
                  src={after} 
                  alt="after"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  UPDATED
                </div>
              </div>
            }
            position={50}
            changePositionOnHover={true}
            style={{
              position: "relative",
              overflow: "hidden"
            }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full text-sm font-bold backdrop-blur-sm shadow-xl pointer-events-none border border-white/20">
        🎚️ Drag slider or hover to compare • AI-powered analysis
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-red-400/20 blur-xl -z-10"></div>
    </div>
  );
}