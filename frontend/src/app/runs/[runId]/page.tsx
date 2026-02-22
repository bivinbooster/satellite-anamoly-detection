"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRun, absUrl, type DetectResult } from "../../lib/api";
import ImageCompareSlider from "../../../components/ImageCompareSlider";

export default function RunPage({ params }: { params: Promise<{ runId: string }> }) {
  const router = useRouter();
  const [run, setRun] = useState<DetectResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState<string>("");

  useEffect(() => {
    async function getParams() {
      const { runId: id } = await params;
      setRunId(id);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (!runId) return;
    
    async function loadRun() {
      try {
        const data = await getRun(runId);
        setRun(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadRun();
  }, [runId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading detection results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">Run not found</div>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← Back to Home
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Anomaly Detection Results
            </h1>
            <p className="text-gray-600 mt-2">
              Run ID: {run.run_id}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Images */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Satellite Image Comparison</h2>
                
                <ImageCompareSlider
                  beforeImage={absUrl(run.assets.t0_rgb)}
                  afterImage={absUrl(run.assets.t1_rgb)}
                  beforeLabel="Before (t0) - Original"
                  afterLabel="After (t1) - With Changes"
                />
              </div>

              {/* Analysis Results */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h2>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Detection Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Global Anomaly Pixels</span>
                        <span className="text-2xl font-bold text-red-600">{run.metrics.global.anomaly_pixels_pct.toFixed(2)}%</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(run.metrics.global.anomaly_pixels_pct * 10, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Mean Score</span>
                          <span className="text-lg font-semibold text-blue-600">{run.metrics.global.score_mean.toFixed(3)}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">95th Percentile</span>
                          <span className="text-lg font-semibold text-purple-600">{run.metrics.global.score_p95.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Anomaly Heatmap</h3>
                  <div className="relative group">
                    <img 
                      src={absUrl(run.assets.heatmap)} 
                      alt="Heatmap" 
                      className="w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.error('Failed to load heatmap image:', absUrl(run.assets.heatmap));
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => console.log('Successfully loaded heatmap image')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      High Intensity
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Red areas indicate high anomaly probability</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">Change Overlay</h3>
                  <div className="relative group">
                    <img 
                      src={absUrl(run.assets.overlay)} 
                      alt="Overlay" 
                      className="w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.error('Failed to load overlay image:', absUrl(run.assets.overlay));
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => console.log('Successfully loaded overlay image')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Detected Changes
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Red highlights show detected anomalies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
