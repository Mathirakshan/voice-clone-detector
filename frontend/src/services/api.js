// API Service Module for VoiceGuard AI Backend Integration

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Health check ping to backend service
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    console.error("Health check error:", err);
    return null;
  }
}

/**
 * Submit audio file for XLS-R Wild deepfake analysis
 * @param {File} audioFile 
 */
export async function analyzeAudio(audioFile) {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Analysis request failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetch all historical security audit logs
 */
export async function fetchHistory() {
  const response = await fetch(`${API_BASE_URL}/api/history`);
  if (!response.ok) {
    throw new Error("Failed to fetch security logs");
  }
  return await response.json();
}

/**
 * Clear all historical logs from backend
 */
export async function clearHistory() {
  const response = await fetch(`${API_BASE_URL}/api/history`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to clear security logs");
  }
  return await response.json();
}

/**
 * Delete individual history record by ID
 * @param {string} recordId 
 */
export async function deleteHistoryItem(recordId) {
  const response = await fetch(`${API_BASE_URL}/api/history/${recordId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete log ${recordId}`);
  }
  return await response.json();
}

/**

 * Generate a new random dynamic voice challenge
 */
export async function generateChallenge() {
  const response = await fetch(`${API_BASE_URL}/api/challenge/generate`, {
    method: "POST",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate dynamic challenge");
  }
  return await response.json();
}

/**
 * Submit challenge response audio for Forensics XLS-R Wild deepfake analysis
 * @param {File} audioFile 
 * @param {string} challengeId 
 */
export async function analyzeChallenge(audioFile, challengeId) {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const url = challengeId 
    ? `${API_BASE_URL}/api/analyze-challenge?challengeId=${encodeURIComponent(challengeId)}`
    : `${API_BASE_URL}/api/analyze-challenge`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Challenge analysis request failed with status ${response.status}`);
  }

  return await response.json();
}

