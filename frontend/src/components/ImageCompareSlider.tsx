"use client";

import { useState } from "react";
import { ReactCompareSlider } from "react-compare-slider";
import { motion } from "framer-motion";

interface ImageCompareSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function ImageCompareSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before (t0)",
  afterLabel = "After (t1)",
}: ImageCompareSliderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Top Labels */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-between px-4 pointer-events-none">
        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {beforeLabel}
        </div>
        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {afterLabel}
        </div>
      </div>

      {/* FIXED CONTAINER — NO STRETCHING */}
      <div className="relative rounded-lg overflow-hidden shadow-xl border border-gray-200 w-full max-w-3xl mx-auto">
        <div className="relative w-full" style={{ aspectRatio: "1 / 1" }}>
          <ReactCompareSlider
            itemOne={
              <img
                src={beforeImage}
                alt={beforeLabel}
                className="w-full h-full object-contain"
                style={{
                  imageRendering: "pixelated",
                  backgroundColor: "#000",
                }}
                onLoad={() => setIsLoaded(true)}
              />
            }
            itemTwo={
              <img
                src={afterImage}
                alt={afterLabel}
                className="w-full h-full object-contain"
                style={{
                  imageRendering: "pixelated",
                  backgroundColor: "#000",
                }}
              />
            }
            defaultValue={50}
            changePositionOnHover={true}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm pointer-events-none">
          Drag slider to compare
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3"
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-900">Before Image</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">Original satellite imagery</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 border border-red-200 rounded-lg p-3"
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-red-900">After Image</span>
          </div>
          <p className="text-xs text-red-700 mt-1">Updated with detected changes</p>
        </motion.div>
      </div>
    </motion.div>
  );
}