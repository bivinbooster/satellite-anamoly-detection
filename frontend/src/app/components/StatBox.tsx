"use client";

import React from "react";

export default function StatBox({
  icon,
  title,
  value,
  unit,
  trend,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  bgColor?: string;
}) {
  return (
    <div className={`rounded-2xl p-6 shadow-lg border border-opacity-50 ${bgColor || "bg-white"}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {unit && <p className="text-sm text-gray-500">{unit}</p>}
          </div>
          {trend !== undefined && (
            <p className={`text-xs mt-2 ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}% change
            </p>
          )}
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
    </div>
  );
}
