// Query API service configuration
import { SERVICE_CONFIG } from '../config/services';

export const QUERY_API_CONFIG = {
  // Service endpoints this API will communicate with
  VECTOR_SEARCH_ENDPOINT: `${SERVICE_CONFIG.VECTOR_SEARCH}/search`,
  RBAC_ENDPOINT: `${SERVICE_CONFIG.RBAC_SERVICE}/check-permissions`,
  LLM_ENDPOINT: `${SERVICE_CONFIG.LLM_SERVICE}/generate`,
  AUDIT_ENDPOINT: `${SERVICE_CONFIG.AUDIT_SERVICE}/log`,
  SUGGESTIONS_ENDPOINT: `${SERVICE_CONFIG.SUGGESTIONS_SERVICE}/generate`,
  
  // API settings
  MAX_QUERY_LENGTH: 1000,
  DEFAULT_SEARCH_LIMIT: 5,
  CACHE_TTL: 300, // 5 minutes
};