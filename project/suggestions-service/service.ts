import { Query, RAGResponse, ServiceResponse } from '../common-libs/types';
import { formatTimestamp, delay } from '../common-libs/utils';

export class SuggestionsService {
  async generateSuggestions(query: Query, response: RAGResponse): Promise<ServiceResponse<string[]>> {
    await delay(500);

    const suggestions: string[] = [];
    const queryLower = query.text.toLowerCase();

    // Generate contextual follow-up questions
    if (queryLower.includes('policy')) {
      suggestions.push(
        "What are the specific compliance requirements?",
        "How are policy violations handled?",
        "When was this policy last updated?"
      );
    } else if (queryLower.includes('architecture') || queryLower.includes('technical')) {
      suggestions.push(
        "What are the scalability considerations?",
        "How do you handle service failures?",
        "What monitoring tools are recommended?"
      );
    } else if (queryLower.includes('performance') || queryLower.includes('success')) {
      suggestions.push(
        "What metrics were used to measure success?",
        "How does this compare to industry standards?",
        "What were the main challenges overcome?"
      );
    } else {
      // Generic follow-ups
      suggestions.push(
        "Can you provide more specific examples?",
        "What are the implementation steps?",
        "Are there any potential limitations?"
      );
    }

    // Add topic-based suggestions from response sources
    const topics = new Set();
    response.sources.forEach(source => {
      source.metadata.tags.forEach(tag => topics.add(tag));
    });

    if (topics.has('security')) {
      suggestions.push("What are the security implications?");
    }
    if (topics.has('performance')) {
      suggestions.push("How can performance be optimized?");
    }

    // Randomize and limit suggestions
    const finalSuggestions = suggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return {
      success: true,
      data: finalSuggestions,
      timestamp: formatTimestamp()
    };
  }

  async getPopularQueries(): Promise<ServiceResponse<string[]>> {
    const popular = [
      "What is our company policy on remote work?",
      "How does the microservices architecture work?",
      "What are our latest client success stories?",
      "What are the security best practices?",
      "How do we handle data privacy?"
    ];

    return {
      success: true,
      data: popular,
      timestamp: formatTimestamp()
    };
  }
}