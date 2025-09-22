// Shared types across all microservices
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
}

export interface Document {
  id: string;
  title: string;
  content: string;
  embedding?: number[];
  metadata: {
    source: string;
    tags: string[];
    accessLevel: string;
    createdAt: string;
  };
}

export interface Query {
  id: string;
  userId: string;
  text: string;
  embedding?: number[];
  timestamp: string;
  context?: Document[];
}

export interface RAGResponse {
  id: string;
  queryId: string;
  answer: string;
  sources: Document[];
  suggestions: string[];
  confidence: number;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  queryId?: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}