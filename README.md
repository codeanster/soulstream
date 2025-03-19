# Soulstream

A Flask-based, memory-first companion platform for preserving and retrieving conversations and memories.

## Overview

Soulstream is a platform that orchestrates two major pipelines:
- Data ingestion & processing (storing conversation data, generating summaries)
- Retrieval & generation (fetching relevant memories for each new query)

The system uses vector embeddings to store and retrieve memories, allowing for semantic search and contextual responses.

## Features

- **Memory Storage**: Store conversations and memories with metadata like emotions, topics, and importance scores
- **Semantic Search**: Find relevant memories based on semantic similarity
- **Query Preprocessing**: Optimize user queries for better vector search results
- **Memory Tagging**: Organize memories with tags for better retrieval
- **Chat Interface**: Interact with the system through a chat interface that retrieves relevant memories

## Architecture

### Backend

- **Flask API**: RESTful API for interacting with the system
- **Vector Store**: Pinecone integration for storing and retrieving vector embeddings
- **Database**: SQLAlchemy models for structured data storage
- **Memory Service**: Core service for managing memories

### Frontend

- **React UI**: Modern, responsive user interface
- **Memory Components**: UI components for displaying and interacting with memories
- **Chat Interface**: Interface for conversing with the system

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL or SQLite database
- Pinecone account for vector storage
- OpenAI API key for embeddings and completions

### Installation

1. Clone the repository
2. Install backend dependencies: `pip install -r requirements.txt`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up environment variables in `.env` file (see Configuration section)
5. Initialize the database: `flask db upgrade`
6. Run the backend: `flask run`
7. Run the frontend: `cd frontend && npm start`

### Configuration

The following environment variables are required:

```
# Database Configuration
DATABASE_URL=mysql://user:password@localhost/soulstream

# Vector Embedding
EMBEDDING_MODEL=text-embedding-ada-002
EMBEDDING_DIMENSION=1536

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_REGION=your-pinecone-region
PINECONE_INDEX_NAME=your-pinecone-index-name

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Memory Settings
MEMORY_DEDUPLICATION_ENABLED=true
ADAPTIVE_THRESHOLD_ENABLED=true
MEMORY_RELEVANCE_THRESHOLD=0.6
```

## API Endpoints

### Chat API

- `POST /api/chat/message`: Send a message and get a response with relevant memories
- `GET /api/chat/history`: Get chat history

### Memory API

- `GET /api/memory/chips`: Get memory chips with optional filtering
- `GET /api/memory/search`: Search memories by query
- `POST /api/memory/pin`: Pin a memory to prevent automatic pruning
- `POST /api/memory/forget`: Delete a memory

## Development

### Directory Structure

```
soulstream/
├── backend/
│   ├── api/            # API endpoints
│   ├── models/         # Database models
│   ├── services/       # Business logic
│   │   ├── memory/     # Memory management
│   │   └── vector_store/ # Vector store integration
│   └── utils/          # Utility functions
├── frontend/
│   ├── public/         # Static assets
│   └── src/            # React components
│       ├── components/ # UI components
│       ├── contexts/   # React contexts
│       ├── pages/      # Page components
│       └── styles/     # CSS styles
└── docs/              # Documentation
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) for detailed instructions on how to get started with our project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
