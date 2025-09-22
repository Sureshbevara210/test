import { Query, RAGResponse, ServiceResponse, User } from '../common-libs/types';
import { generateId, formatTimestamp, mockEmbedding } from '../common-libs/utils';
import { DataIngestionService } from '../data-ingestion/service';
import { VectorSearchService } from '../vector-search/service';
import { RBACService } from '../rbac-service/service';
import { LLMService } from '../llm-service/service';
import { AuditService } from '../audit-service/service';
import { SuggestionsService } from '../suggestions-service/service';

export class QueryAPIService {
  private dataIngestion: DataIngestionService;
  private vectorSearch: VectorSearchService;
  private rbac: RBACService;
  private llm: LLMService;
  private audit: AuditService;
  private suggestions: SuggestionsService;

  constructor() {
    this.dataIngestion = new DataIngestionService();
    this.vectorSearch = new VectorSearchService();
    this.rbac = new RBACService();
    this.llm = new LLMService();
    this.audit = new AuditService();
    this.suggestions = new SuggestionsService();
    
    // Initialize with sample documents
    this.initializeData();
  }

  private async initializeData() {
    const docsResponse = await this.dataIngestion.getAllDocuments();
    if (docsResponse.success && docsResponse.data) {
      this.vectorSearch.setDocuments(docsResponse.data);
    }
  }

  async processQuery(userId: string, queryText: string): Promise<ServiceResponse<RAGResponse>> {
    try {
      // Log query initiation
      await this.audit.logEvent(userId, 'query_initiated', { queryText });

      // Create query object with embedding
      const query: Query = {
        id: generateId(),
        userId,
        text: queryText,
        embedding: mockEmbedding(),
        timestamp: formatTimestamp()
      };

      // Search for relevant documents
      const searchResponse = await this.vectorSearch.searchSimilar(query);
      if (!searchResponse.success || !searchResponse.data) {
        throw new Error('Vector search failed');
      }

      // Apply RBAC filtering
      const rbacResponse = await this.rbac.filterDocumentsByPermissions(userId, searchResponse.data);
      if (!rbacResponse.success || !rbacResponse.data) {
        throw new Error('RBAC filtering failed');
      }

      // Generate answer using LLM
      const llmResponse = await this.llm.generateAnswer(query, rbacResponse.data);
      if (!llmResponse.success || !llmResponse.data) {
        throw new Error('LLM generation failed');
      }

      // Generate suggestions
      const suggestionsResponse = await this.suggestions.generateSuggestions(query, llmResponse.data);
      if (suggestionsResponse.success && suggestionsResponse.data) {
        llmResponse.data.suggestions = suggestionsResponse.data;
      }

      // Log successful query completion
      await this.audit.logEvent(userId, 'query_completed', { 
        queryId: query.id,
        responseId: llmResponse.data.id,
        sourcesCount: rbacResponse.data.length
      });

      return llmResponse;

    } catch (error) {
      await this.audit.logEvent(userId, 'query_failed', { 
        queryText, 
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Query processing failed',
        timestamp: formatTimestamp()
      };
    }
  }

  async getUserInfo(userId: string): Promise<ServiceResponse<User>> {
    return this.rbac.getUserById(userId);
  }

  async getAuditLogs(userId: string): Promise<ServiceResponse<any[]>> {
    return this.audit.getLogsByUser(userId);
  }

  async getAllAuditLogs(): Promise<ServiceResponse<any[]>> {
    return this.audit.getAllLogs();
  }

  async getVectorSearchStats(): Promise<ServiceResponse<any>> {
    return this.vectorSearch.getStats();
  }
}