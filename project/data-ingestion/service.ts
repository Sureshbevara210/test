import { Document, ServiceResponse } from '../common-libs/types';
import { generateId, formatTimestamp, mockEmbedding } from '../common-libs/utils';

export class DataIngestionService {
  private documents: Document[] = [
    {
      id: generateId(),
      title: "Company Policy Manual",
      content: "Our company values integrity, innovation, and customer satisfaction. We maintain the highest standards of professional conduct...",
      embedding: mockEmbedding(),
      metadata: {
        source: "hr-docs",
        tags: ["policy", "hr", "conduct"],
        accessLevel: "internal",
        createdAt: formatTimestamp()
      }
    },
    {
      id: generateId(),
      title: "Technical Architecture Guide",
      content: "Our microservices architecture follows domain-driven design principles with clear service boundaries...",
      embedding: mockEmbedding(),
      metadata: {
        source: "tech-docs",
        tags: ["architecture", "microservices", "technical"],
        accessLevel: "engineering",
        createdAt: formatTimestamp()
      }
    },
    {
      id: generateId(),
      title: "Customer Success Stories",
      content: "Client feedback shows 98% satisfaction rate with our RAG implementation, reducing query response time by 75%...",
      embedding: mockEmbedding(),
      metadata: {
        source: "marketing",
        tags: ["success", "client", "case-study"],
        accessLevel: "public",
        createdAt: formatTimestamp()
      }
    }
  ];

  async ingestDocument(content: string, metadata: any): Promise<ServiceResponse<Document>> {
    const document: Document = {
      id: generateId(),
      title: metadata.title || "Untitled Document",
      content,
      embedding: mockEmbedding(),
      metadata: {
        ...metadata,
        createdAt: formatTimestamp()
      }
    };

    this.documents.push(document);

    return {
      success: true,
      data: document,
      timestamp: formatTimestamp()
    };
  }

  async getAllDocuments(): Promise<ServiceResponse<Document[]>> {
    return {
      success: true,
      data: this.documents,
      timestamp: formatTimestamp()
    };
  }

  async processTextChunks(text: string): Promise<string[]> {
    // Simple chunking - in production, use more sophisticated methods
    const chunks = text.match(/.{1,500}/g) || [];
    return chunks;
  }
}