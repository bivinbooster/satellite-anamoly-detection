  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8003';

  export interface CreateRunResponse {
    run_id: string;
  }

  export interface DetectResult {
    assets: string[];
    metrics: Record<string, any>;
  }

  export interface RunData {
    id: string;
    status: string;
    assets: Record<string, string>;
    metrics: Record<string, any>;
  }

  export async function createRun(t0: File, t1: File): Promise<string> {
    console.log('Creating run with files:', {
      t0: { name: t0.name, size: t0.size, type: t0.type },
      t1: { name: t1.name, size: t1.size, type: t1.type }
    });
    
    const formData = new FormData();
    formData.append('t0', t0);
    formData.append('t1', t1);

    console.log('Sending request to:', `${API_BASE}/api/runs`);
    
    const response = await fetch(`${API_BASE}/api/runs`, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', errorText);
      throw new Error(`Failed to create run: ${response.statusText} - ${errorText}`);
    }

    const result: CreateRunResponse = await response.json();
    console.log('Run created successfully:', result);
    return result.run_id;
  }

  export async function detectRun(runId: string): Promise<DetectResult> {
    const response = await fetch(`${API_BASE}/api/runs/${runId}/detect`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to start detection: ${response.statusText}`);
    }

    return await response.json();
  }

  export async function getRun(runId: string): Promise<RunData> {
    const response = await fetch(`${API_BASE}/api/runs/${runId}`);

    if (!response.ok) {
      throw new Error(`Failed to get run: ${response.statusText}`);
    }

    return await response.json();
  }

  export function getAssetUrl(runId: string, assetType: string): string {
    const url = `${API_BASE}/api/assets/${runId}/${assetType}`;
    console.log(`Asset URL for ${runId}/${assetType}:`, url);
    return url;
  }
