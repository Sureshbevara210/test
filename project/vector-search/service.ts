import { Document, Query, ServiceResponse } from '../common-libs/types';
import { generateId, formatTimestamp, cosineSimilarity } from '../common-libs/utils';

export class VectorSearchService {
  private documents: Document[] = [];

  setDocuments(documents: Document[]) {
    this.documents = documents;
  }

  async searchSimilar(query: Query, limit: number = 5): Promise<ServiceResponse<Document[]>> {
    if (!query.embedding) {
      return {
        success: false,
        error: "Query embedding not provided",
        timestamp: formatTimestamp()
      };
    }

    // Calculate similarity scores
    const results = this.documents
      .map(doc => ({
        document: doc,
        similarity: doc.embedding ? cosineSimilarity(query.embedding, doc.embedding) : 0
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(result => result.document);

    return {
      success: true,
      data: results,
      timestamp: formatTimestamp()
    };
  }

  async addDocument(document: Document): Promise<ServiceResponse<boolean>> {
    this.documents.push(document);
    return {
      success: true,
      data: true,
      timestamp: formatTimestamp()
    };
  }

  async getStats(): Promise<ServiceResponse<{ totalDocuments: number, averageEmbeddingDim: number }>> {
    const avgDim = this.documents.length > 0 
      ? this.documents[0].embedding?.length || 0 
      : 0;

    return {
      success: true,
      data: {
        totalDocuments: this.documents.length,
        averageEmbeddingDim: avgDim
      },
      timestamp: formatTimestamp()
    };
  }
}