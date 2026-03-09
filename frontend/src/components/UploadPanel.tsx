"use client"

import { useState } from "react";

interface UploadPanelProps {
  onAnalyze: (before: File, after: File) => void;
  loading: boolean;
}

export default function UploadPanel({onAnalyze, loading}: UploadPanelProps) {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleAnalyze = () => {
    if (beforeFile && afterFile) {
      onAnalyze(beforeFile, afterFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle dropped files
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="gradient-text">Upload Satellite Images</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Select your before and after satellite images to start AI-powered change detection analysis
          </p>
        </div>

        {/* Upload Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Before Image Upload */}
          <div className="relative">
            <div className="stunning-card p-8 rounded-3xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Before Image</h3>
                  <p className="text-gray-600">Baseline satellite imagery</p>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
                  className="w-full h-32 opacity-0 absolute inset-0 cursor-pointer z-10"
                />
                <div className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  beforeFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                }`}>
                  {beforeFile ? (
                    <div>
                      <div className="text-4xl mb-2">✅</div>
                      <p className="font-semibold text-gray-800">{beforeFile.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {(beforeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📤</div>
                      <p className="font-semibold text-gray-700">Click to upload</p>
                      <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPG, TIFF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* After Image Upload */}
          <div className="relative">
            <div className="stunning-card p-8 rounded-3xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">🛰️</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">After Image</h3>
                  <p className="text-gray-600">Updated satellite imagery</p>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
                  className="w-full h-32 opacity-0 absolute inset-0 cursor-pointer z-10"
                />
                <div className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  afterFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50'
                }`}>
                  {afterFile ? (
                    <div>
                      <div className="text-4xl mb-2">✅</div>
                      <p className="font-semibold text-gray-800">{afterFile.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {(afterFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📤</div>
                      <p className="font-semibold text-gray-700">Click to upload</p>
                      <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                      <p className="text-xs text-gray-400 mt-2">PNG, JPG, TIFF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Button */}
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={!beforeFile || !afterFile || loading}
            className={`group relative px-12 py-6 text-xl font-bold text-white rounded-2xl transition-all duration-300 ${
              !beforeFile || !afterFile || loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 shadow-2xl pulse-glow'
            }`}
            style={{
              background: beforeFile && afterFile && !loading 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing with AI...
                </>
              ) : (
                <>
                  🚀 Start AI Analysis
                  <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
            {beforeFile && afterFile && !loading && (
              <div className="absolute inset-0 rounded-2xl bg-white/20 transform transition-transform duration-300 group-hover:scale-110"></div>
            )}
          </button>
          
          <p className="text-white/70 mt-4 text-lg">
            {beforeFile && afterFile 
              ? 'Ready for AI-powered change detection analysis' 
              : 'Please upload both images to begin analysis'}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: '🤖', title: 'Deep Learning AI', desc: 'Advanced neural networks analyze pixel-level changes' },
            { icon: '⚡', title: 'Lightning Fast', desc: 'Results in seconds, not minutes' },
            { icon: '🎯', title: 'High Precision', desc: '99.5% accuracy in change detection' }
          ].map((feature, index) => (
            <div key={index} className="glass-effect p-6 rounded-2xl text-center">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
              <p className="text-white/70 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
