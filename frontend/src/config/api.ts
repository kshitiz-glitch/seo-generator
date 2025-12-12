// API Configuration
// Uses environment variable in production, localhost in development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
    generateSeo: `${API_BASE_URL}/api/v1/generate-seo`,
    status: (jobId: string) => `${API_BASE_URL}/api/v1/status/${jobId}`,
    signup: `${API_BASE_URL}/api/v1/signup`,
    login: `${API_BASE_URL}/api/v1/login`,
    history: `${API_BASE_URL}/api/v1/history`,
}
