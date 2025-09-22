# RAG Microservices Project

A comprehensive Retrieval-Augmented Generation system built with microservices architecture.

## Architecture Overview

This project demonstrates a production-ready RAG system with the following microservices:

### Microservices

1. **data-ingestion** - Extract, chunk, embed, and preprocess documents
2. **vector-search** - Store and perform similarity search on embeddings  
3. **query-api** - Authentication, query handling, and vector generation
4. **rbac-service** - Role-based access control implementation
5. **llm-service** - Answer generation using LLM with retrieved context
6. **audit-service** - Query logging and compliance tracking
7. **suggestions-service** - Follow-up question generation
8. **user-interface** - Frontend chat and admin dashboard
9. **common-libs** - Shared utilities and types
10. **deployments** - Infrastructure and deployment configurations

## Data Flow

```
user-interface → query-api → vector-search → rbac-service → llm-service
                     ↓              ↓              ↓           ↓
              audit-service ← suggestions-service ←───────────┘
```

## Development Setup

```bash
npm install
npm run dev
```

## Current Implementation

This version provides a unified demonstration of the microservices architecture concepts with:
- Simulated service interactions
- Mock data and responses
- Complete UI implementation
- RBAC simulation
- Audit logging
- Suggestions system

## Next Steps for Production

1. **Containerization**: Add Docker files for each service
2. **Service Separation**: Split into actual microservices
3. **Database Integration**: Add Vector DB (Pinecone, Weaviate, etc.)
4. **Real LLM Integration**: Connect to OpenAI, Anthropic, or local models
5. **Authentication**: Implement OAuth2/JWT properly
6. **Orchestration**: Add Kubernetes manifests
7. **CI/CD**: Setup GitHub Actions pipelines