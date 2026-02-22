"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRun, detectRun } from "./lib/api";

export default function HomePage() {
  const router = useRouter();
  const [files, setFiles] = useState({ t0: null as File | null, t1: null as File | null });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState({ t0: false, t1: false });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 't0' | 't1') => {
    const file = e.target.files?.[0] ?? null;
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleFileDrop = (e: React.DragEvent, type: 't0' | 't1') => {
    e.preventDefault();
    setDragActive(prev => ({ ...prev, [type]: false }));
    const file = e.dataTransfer.files[0] ?? null;
    if (file && (file.type.includes('image') || file.name.endsWith('.tif') || file.name.endsWith('.tiff'))) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleDragOver = (e: React.DragEvent, type: 't0' | 't1') => {
    e.preventDefault();
    setDragActive(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (type: 't0' | 't1') => {
    setDragActive(prev => ({ ...prev, [type]: false }));
  };

  async function onDetect() {
    setErr(null);
    if (!files.t0 || !files.t1) {
      setErr("Please upload both before (t0) and after (t1) satellite images.");
      return;
    }
    setBusy(true);
    try {
      const runId = await createRun(files.t0, files.t1);
      await detectRun(runId);
      router.push(`/runs/${runId}`);
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed. Please check your files and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="mx-auto max-w-6xl p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Satellite Anomaly Studio</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Advanced AI-powered change detection for satellite imagery. Upload bitemporal images to uncover environmental changes, urban development, and anomalies with precision analysis.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Before Image */}
            <div
              className={`relative group cursor-pointer transition-all duration-300 ${
                dragActive.t0 ? 'scale-105' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, 't0')}
              onDragLeave={() => handleDragLeave('t0')}
              onDrop={(e) => handleFileDrop(e, 't0')}
              onClick={() => document.getElementById('fileInputT0')?.click()}
            >
              <input
                type="file"
                id="fileInputT0"
                className="hidden"
                accept=".tif,.tiff,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 't0')}
              />
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive.t0 
                  ? 'border-blue-400 bg-blue-500/20' 
                  : files.t0 
                    ? 'border-green-400 bg-green-500/10' 
                    : 'border-gray-400 bg-gray-500/5 hover:border-blue-400 hover:bg-blue-500/10'
              }`}>
                <div className="flex flex-col items-center space-y-4">
                  {files.t0 ? (
                    <>
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">Before Image</p>
                        <p className="text-blue-200 text-sm mt-1">{files.t0.name}</p>
                        <p className="text-blue-300 text-xs mt-1">{(files.t0.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">Before (t0)</p>
                        <p className="text-blue-200 text-sm">Drag & drop or click to upload</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* After Image */}
            <div
              className={`relative group cursor-pointer transition-all duration-300 ${
                dragActive.t1 ? 'scale-105' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, 't1')}
              onDragLeave={() => handleDragLeave('t1')}
              onDrop={(e) => handleFileDrop(e, 't1')}
              onClick={() => document.getElementById('fileInputT1')?.click()}
            >
              <input
                type="file"
                id="fileInputT1"
                className="hidden"
                accept=".tif,.tiff,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 't1')}
              />
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive.t1 
                  ? 'border-blue-400 bg-blue-500/20' 
                  : files.t1 
                    ? 'border-green-400 bg-green-500/10' 
                    : 'border-gray-400 bg-gray-500/5 hover:border-blue-400 hover:bg-blue-500/10'
              }`}>
                <div className="flex flex-col items-center space-y-4">
                  {files.t1 ? (
                    <>
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">After Image</p>
                        <p className="text-blue-200 text-sm mt-1">{files.t1.name}</p>
                        <p className="text-blue-300 text-xs mt-1">{(files.t1.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">After (t1)</p>
                        <p className="text-blue-200 text-sm">Drag & drop or click to upload</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {err && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
              <p className="text-red-200 text-sm">{err}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onDetect}
              disabled={busy || !files.t0 || !files.t1}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                busy || !files.t0 || !files.t1
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {busy ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Satellite Data...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Detect Anomalies</span>
                </div>
              )}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Fast Processing</p>
                  <p className="text-blue-200 text-xs">AI-powered analysis in seconds</p>
                </div>
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Accurate Detection</p>
                  <p className="text-green-200 text-xs">Advanced change detection algorithms</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Rich Visualizations</p>
                  <p className="text-purple-200 text-xs">Heatmaps, overlays, and metrics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Tip */}
          <div className="mt-8 text-center">
            <p className="text-blue-200 text-sm">
              💡 <strong>Tip:</strong> Use OSCD pairs (Sentinel-2) from{" "}
              <a href="https://rcdaudt.github.io/oscd/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-400 underline">
                https://rcdaudt.github.io/oscd/
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}