// API service layer - where HTTP calls would be made
import { SERVICE_CONFIG, buildServiceUrl } from '../config/services';

export class APIService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = SERVICE_CONFIG.QUERY_API, timeout: number = SERVICE_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  // Generic HTTP client method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = buildServiceUrl('QUERY_API' as any, endpoint);
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  // Query processing
  async processQuery(userId: string, query: string) {
    return this.request('/query', {
      method: 'POST',
      body: JSON.stringify({ userId, query }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // User management
  async getUserInfo(userId: string) {
    return this.request(`/users/${userId}`);
  }

  // Admin endpoints
  async getAuditLogs() {
    return this.request('/admin/audit-logs');
  }

  async getSystemStats() {
    return this.request('/admin/stats');
  }
}