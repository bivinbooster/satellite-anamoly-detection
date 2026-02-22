"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRun, detectRun } from "./lib/api";

export default function HomePage() {
  const router = useRouter();
  const [files, setFiles] = useState({ t0: null as File | null, t1: null as File | null });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 't0' | 't1') => {
    const file = e.target.files?.[0] ?? null;
    setFiles(prev => ({ ...prev, [type]: file }));
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Satellite Anomaly Detection
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload before and after satellite images to detect anomalies
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Before Image (t0)
              </label>
              <input
                type="file"
                accept=".tif,.tiff,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 't0')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                After Image (t1)
              </label>
              <input
                type="file"
                accept=".tif,.tiff,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 't1')}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {err}
              </div>
            )}

            <button
              onClick={onDetect}
              disabled={busy || !files.t0 || !files.t1}
              className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                busy || !files.t0 || !files.t1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {busy ? 'Processing...' : 'Start Detection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}