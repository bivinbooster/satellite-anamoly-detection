const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export async function analyzeImages(before: File, after: File) {
  const formData = new FormData();
  formData.append('before', before);
  formData.append('after', after);

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return await response.json();
}
