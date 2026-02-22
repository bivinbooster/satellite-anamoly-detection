"use client";

import React from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

export default function ImageCompare({
  before,
  after,
  title,
}: {
  before: string;
  after: string;
  title: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4 bg-gray-50">
        <div className="rounded-lg overflow-hidden border-2 border-gray-200">
          <ReactCompareSlider
            itemOne={<ReactCompareSliderImage src={before} alt="Before" />}
            itemTwo={<ReactCompareSliderImage src={after} alt="After" />}
            style={{ width: "100%", height: 350 }}
            onlyHandleDraggable={true}
          />
        </div>
      </div>
    </div>
  );
}
