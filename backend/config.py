"""
config.py
---------
Configuration settings for the Soulstream application.
Different environments, same melancholy.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration class.
    
    The foundation. The constants. The things that don't change,
    unlike memories that fade with each recollection.
    """
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a-secret-that-will-be-forgotten')
    
    # Database
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    # Vector Embedding
    EMBEDDING_MODEL = os.environ.get('EMBEDDING_MODEL', 'sentence-transformers/all-mpnet-base-v2')
    EMBEDDING_DIMENSION = int(os.environ.get('EMBEDDING_DIMENSION', 768))
    
    # Pinecone
    PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
    PINECONE_REGION = os.environ.get('PINECONE_REGION')
    PINECONE_INDEX_NAME = os.environ.get('PINECONE_INDEX_NAME')
    
    # OpenAI
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')
    
    # Memory Settings
    BATCH_SIZE = int(os.environ.get('BATCH_SIZE', 32))
    MAX_TOKENS = int(os.environ.get('MAX_TOKENS', 5000))
    SIMILARITY_THRESHOLD = float(os.environ.get('SIMILARITY_THRESHOLD', 0.75))
    MEMORY_DEDUPLICATION_ENABLED = os.environ.get('MEMORY_DEDUPLICATION_ENABLED', 'true').lower() == 'true'
    
    # Adaptive Memory Threshold
    ADAPTIVE_THRESHOLD_ENABLED = os.environ.get('ADAPTIVE_THRESHOLD_ENABLED', 'true').lower() == 'true'
    MIN_MEMORY_RELEVANCE_THRESHOLD = float(os.environ.get('MIN_MEMORY_RELEVANCE_THRESHOLD', 0.4))
    MAX_MEMORY_RELEVANCE_THRESHOLD = float(os.environ.get('MAX_MEMORY_RELEVANCE_THRESHOLD', 0.8))
    MEMORY_RELEVANCE_THRESHOLD = float(os.environ.get('MEMORY_RELEVANCE_THRESHOLD', 0.6))


class DevelopmentConfig(Config):
    """Development configuration.
    
    Where we pretend mistakes don't hurt as much.
    """
    DEBUG = True
    TESTING = False


class TestingConfig(Config):
    """Testing configuration.
    
    A controlled environment where we can break things safely.
    If only life had a testing environment.
    """
    DEBUG = False
    TESTING = True
    # Use in-memory SQLite for testing
    DATABASE_URL = 'sqlite:///:memory:'


class ProductionConfig(Config):
    """Production configuration.
    
    Where real memories live. Handle with care.
    """
    DEBUG = False
    TESTING = False
    # Ensure these are set in production
    def __init__(self):
        assert self.SECRET_KEY != 'a-secret-that-will-be-forgotten', "Please set a proper SECRET_KEY"
        assert self.DATABASE_URL is not None, "DATABASE_URL must be set"
        assert self.PINECONE_API_KEY is not None, "PINECONE_API_KEY must be set"
