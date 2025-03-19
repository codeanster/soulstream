"""
test_pinecone_manager.py
-----------------------
Tests for the PineconeManager class.
Verifying that our memory system works as expected.
The test of digital remembrance.
"""

import unittest
import os
from unittest.mock import patch, MagicMock
from backend.services.vector_store.pinecone_manager import PineconeManager

class TestPineconeManager(unittest.TestCase):
    """Test cases for PineconeManager.
    
    Ensuring the foundation of memory is solid.
    Testing the infrastructure of digital recollection.
    """
    
    @patch('backend.services.vector_store.pinecone_manager.Pinecone')
    @patch('backend.services.vector_store.pinecone_manager.OpenAI')
    def setUp(self, mock_openai, mock_pinecone):
        """Set up the test environment.
        
        Creating a controlled space for testing.
        A sandbox for memory operations.
        """
        # Mock environment variables
        os.environ['PINECONE_API_KEY'] = 'test_api_key'
        os.environ['PINECONE_INDEX_NAME'] = 'test_index'
        os.environ['PINECONE_REGION'] = 'test_region'
        os.environ['OPENAI_API_KEY'] = 'test_openai_key'
        
        # Set up mock objects
        self.mock_index = MagicMock()
        mock_pinecone.return_value.Index.return_value = self.mock_index
        
        self.mock_openai_client = mock_openai.return_value
        self.mock_openai_client.embeddings.create.return_value.data = [
            MagicMock(embedding=[0.1, 0.2, 0.3])
        ]
        
        # Create PineconeManager instance
        self.manager = PineconeManager()
    
    def test_generate_embedding(self):
        """Test generating embeddings.
        
        Verifying that thoughts can be translated to numbers.
        The alchemy of turning words into vectors.
        """
        # Test generating an embedding
        embedding = self.manager.generate_embedding("Test text")
        
        # Verify the OpenAI API was called correctly
        self.mock_openai_client.embeddings.create.assert_called_once_with(
            input="Test text",
            model="text-embedding-ada-002"
        )
        
        # Verify the embedding was returned
        self.assertEqual(embedding, [0.1, 0.2, 0.3])
    
    def test_upsert_memory_chip(self):
        """Test upserting a memory chip.
        
        Ensuring memories can be preserved.
        The act of committing a moment to digital permanence.
        """
        # Test upserting a memory
        result = self.manager.upsert_memory_chip(
            memory_id="test_id",
            source_text="Test memory content",
            metadata={"emotion": "nostalgic"}
        )
        
        # Verify the Pinecone API was called correctly
        self.mock_index.upsert.assert_called_once()
        
        # Verify the result
        self.assertTrue(result)
    
    def test_search_memories(self):
        """Test searching for memories.
        
        Verifying that the past can be queried.
        The act of finding echoes of previous moments.
        """
        # Set up mock response
        mock_match = MagicMock()
        mock_match.id = "test_id"
        mock_match.score = 0.95
        mock_match.metadata = {
            "source_text": "Test memory content",
            "key_terms": ["test", "memory"],
            "emotion": "nostalgic",
            "timestamp": "2025-03-18T12:00:00Z"
        }
        
        self.mock_index.query.return_value.matches = [mock_match]
        
        # Test searching for memories
        results = self.manager.search_memories("Test query")
        
        # Verify the Pinecone API was called correctly
        self.mock_index.query.assert_called_once()
        
        # Verify the results
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], "test_id")
        self.assertEqual(results[0]["source_text"], "Test memory content")
    
    def test_delete_memory(self):
        """Test deleting a memory.
        
        Verifying that forgetting is possible.
        The mercy of digital erasure.
        """
        # Test deleting a memory
        result = self.manager.delete_memory("test_id")
        
        # Verify the Pinecone API was called correctly
        self.mock_index.delete.assert_called_once_with(ids=["test_id"])
        
        # Verify the result
        self.assertTrue(result)

if __name__ == '__main__':
    unittest.main()
