const API_BASE_URL = 'http://localhost:8000';

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(5000) });
    return await response.json();
  } catch {
    return null;
  }
};

export const fetchModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/models`);
    const data = await response.json();
    return data.models || [];
  } catch {
    return [];
  }
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error('Upload gagal');
  return await response.json();
};

export const createGenerateJob = async (modelName, inputImageId = null) => {
  const body = { model_name: modelName };
  if (inputImageId) body.input_image_id = inputImageId;
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Gagal membuat job');
  return await response.json();
};

export const getJobStatus = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/api/generate/${jobId}`);
  if (!response.ok) throw new Error('Gagal mengambil status job');
  return await response.json();
};

export const fetchJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`);
    const data = await response.json();
    return data.jobs || [];
  } catch {
    return [];
  }
};

export const getImageUrl = (path) => `${API_BASE_URL}/static/generated/${path}`;
export const getUploadUrl = (filename) => `${API_BASE_URL}/static/uploads/${filename}`;