import { Document, Query, RAGResponse, ServiceResponse } from '../common-libs/types';
import { generateId, formatTimestamp, delay } from '../common-libs/utils';

export class LLMService {
  async generateAnswer(query: Query, context: Document[]): Promise<ServiceResponse<RAGResponse>> {
    // Simulate LLM processing delay
    await delay(1500);

    const contextText = context.map(doc => doc.content).join('\n\n');
    
    // Mock answer generation - in production, call actual LLM
    const mockAnswers = [
      `Based on the provided context, ${query.text.toLowerCase().includes('policy') ? 'our company policy emphasizes' : 'the technical approach involves'} ${contextText.slice(0, 200)}...`,
      `According to the documentation, ${query.text.toLowerCase().includes('architecture') ? 'our microservices architecture' : 'the system'} demonstrates strong performance with ${Math.floor(Math.random() * 50) + 50}% efficiency improvement.`,
      `The context indicates that ${query.text.toLowerCase().includes('success') ? 'client satisfaction rates' : 'implementation results'} show positive outcomes across multiple metrics.`
    ];

    const answer = mockAnswers[Math.floor(Math.random() * mockAnswers.length)];

    const response: RAGResponse = {
      id: generateId(),
      queryId: query.id,
      answer,
      sources: context,
      suggestions: [], // Will be filled by suggestions service
      confidence: 0.85 + Math.random() * 0.1,
      timestamp: formatTimestamp()
    };

    return {
      success: true,
      data: response,
      timestamp: formatTimestamp()
    };
  }

  async summarizeDocuments(documents: Document[]): Promise<ServiceResponse<string>> {
    await delay(800);

    const totalDocs = documents.length;
    const topics = [...new Set(documents.flatMap(doc => doc.metadata.tags))];
    
    const summary = `Summary of ${totalDocs} documents covering topics: ${topics.join(', ')}. Key insights include performance improvements, policy compliance, and technical architecture best practices.`;

    return {
      success: true,
      data: summary,
      timestamp: formatTimestamp()
    };
  }
}