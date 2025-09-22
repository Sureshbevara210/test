// Service configuration - main file where you'd configure IPs
export const SERVICE_CONFIG = {
  // Base URLs for each microservice
  QUERY_API: import.meta.env.VITE_QUERY_API_URL || 'http://localhost:3003',
  DATA_INGESTION: import.meta.env.VITE_DATA_INGESTION_URL || 'http://localhost:3001',
  VECTOR_SEARCH: import.meta.env.VITE_VECTOR_SEARCH_URL || 'http://localhost:3002',
  RBAC_SERVICE: import.meta.env.VITE_RBAC_SERVICE_URL || 'http://localhost:3004',
  LLM_SERVICE: import.meta.env.VITE_LLM_SERVICE_URL || 'http://localhost:3005',
  AUDIT_SERVICE: import.meta.env.VITE_AUDIT_SERVICE_URL || 'http://localhost:3006',
  SUGGESTIONS_SERVICE: import.meta.env.VITE_SUGGESTIONS_SERVICE_URL || 'http://localhost:3007',
  
  // Database configurations
  DATABASE_URL: import.meta.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ragdb',
  VECTOR_DB_URL: import.meta.env.VECTOR_DB_URL || 'http://localhost:6333',
  REDIS_URL: import.meta.env.REDIS_URL || 'redis://localhost:6379',
  
  // API configurations
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Helper function to build service URLs
export const buildServiceUrl = (service: keyof typeof SERVICE_CONFIG, endpoint: string) => {
  const baseUrl = SERVICE_CONFIG[service];
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Network utility functions
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getServiceHealth = async (serviceUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(`${serviceUrl}/health`, { 
      method: 'GET',
      timeout: 5000 
    });
    return response.ok;
  } catch {
    return false;
  }
};