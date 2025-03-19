"""
test_memory_service.py
---------------------
Tests for the MemoryService class.
Verifying that our memory service works as expected.
The test of digital memory management.
"""

import unittest
from unittest.mock import patch, MagicMock
from backend.services.memory.memory_service import MemoryService

class TestMemoryService(unittest.TestCase):
    """Test cases for MemoryService.
    
    Ensuring the memory service functions correctly.
    Testing the orchestration of digital recollection.
    """
    
    def setUp(self):
        """Set up the test environment.
        
        Creating a controlled space for testing.
        A sandbox for memory service operations.
        """
        # Mock dependencies
        self.mock_vector_store = MagicMock()
        self.mock_query_preprocessor = MagicMock()
        
        # Set up mock responses
        self.mock_vector_store.upsert_memory_chip.return_value = True
        self.mock_vector_store.get_memory.return_value = {
            'id': 'test_id',
            'source_text': 'Test memory content',
            'metadata': {
                'summary': 'Test summary',
                'emotion': 'nostalgic',
                'timestamp': '2025-03-18T12:00:00Z',
                'importance_score': 0.8,
                'is_pinned': False,
                'tags': ['test', 'memory']
            }
        }
        self.mock_vector_store.search_memories.return_value = [
            {
                'id': 'test_id',
                'source_text': 'Test memory content',
                'score': 0.95,
                'metadata': {
                    'summary': 'Test summary',
                    'emotion': 'nostalgic',
                    'timestamp': '2025-03-18T12:00:00Z',
                    'importance_score': 0.8,
                    'is_pinned': False,
                    'tags': ['test', 'memory']
                }
            }
        ]
        self.mock_vector_store.delete_memory.return_value = True
        
        self.mock_query_preprocessor.preprocess_query.return_value = ('Optimized query', True)
        
        # Create MemoryService instance
        self.service = MemoryService(
            vector_store=self.mock_vector_store,
            query_preprocessor=self.mock_query_preprocessor
        )
    
    def test_store_memory(self):
        """Test storing a memory.
        
        Verifying that memories can be preserved.
        The act of committing a moment to digital permanence.
        """
        # Test storing a memory
        memory_id = self.service.store_memory(
            source_text="Test memory content",
            summary="Test summary",
            emotion="nostalgic",
            topic="memories",
            importance_score=0.8,
            is_pinned=False,
            user_id=1,
            character_id=2,
            tags=['test', 'memory']
        )
        
        # Verify the vector store was called correctly
        self.mock_vector_store.upsert_memory_chip.assert_called_once()
        
        # Verify a memory ID was returned
        self.assertIsNotNone(memory_id)
    
    def test_retrieve_memory(self):
        """Test retrieving a memory.
        
        Verifying that specific memories can be recalled.
        The act of finding a particular moment in the digital past.
        """
        # Test retrieving a memory
        memory = self.service.retrieve_memory("test_id")
        
        # Verify the vector store was called correctly
        self.mock_vector_store.get_memory.assert_called_once_with("test_id")
        
        # Verify the memory was returned and formatted correctly
        self.assertEqual(memory['id'], 'test_id')
        self.assertEqual(memory['source_text'], 'Test memory content')
        self.assertEqual(memory['summary'], 'Test summary')
        self.assertEqual(memory['emotion'], 'nostalgic')
    
    def test_search_memories_with_preprocessing(self):
        """Test searching for memories with query preprocessing.
        
        Verifying that the past can be queried with optimized language.
        The act of finding echoes of previous moments through refined questions.
        """
        # Test searching for memories with preprocessing
        results = self.service.search_memories(
            query="Test query",
            top_k=5,
            preprocess_query=True
        )
        
        # Verify the query preprocessor was called
        self.mock_query_preprocessor.preprocess_query.assert_called_once_with("Test query")
        
        # Verify the vector store was called with the optimized query
        self.mock_vector_store.search_memories.assert_called_once_with(
            query="Optimized query",
            top_k=5,
            filter_dict=None,
            relevance_threshold=0.0
        )
        
        # Verify the results were returned and formatted correctly
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], 'test_id')
        self.assertEqual(results[0]['source_text'], 'Test memory content')
        self.assertEqual(results[0]['summary'], 'Test summary')
    
    def test_search_memories_without_preprocessing(self):
        """Test searching for memories without query preprocessing.
        
        Verifying that the past can be queried with raw language.
        The act of finding echoes of previous moments through direct questions.
        """
        # Test searching for memories without preprocessing
        results = self.service.search_memories(
            query="Test query",
            top_k=5,
            preprocess_query=False
        )
        
        # Verify the query preprocessor was not called
        self.mock_query_preprocessor.preprocess_query.assert_not_called()
        
        # Verify the vector store was called with the original query
        self.mock_vector_store.search_memories.assert_called_once_with(
            query="Test query",
            top_k=5,
            filter_dict=None,
            relevance_threshold=0.0
        )
        
        # Verify the results were returned and formatted correctly
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], 'test_id')
    
    def test_delete_memory(self):
        """Test deleting a memory.
        
        Verifying that forgetting is possible.
        The mercy of digital erasure.
        """
        # Test deleting a memory
        result = self.service.delete_memory("test_id")
        
        # Verify the vector store was called correctly
        self.mock_vector_store.delete_memory.assert_called_once_with("test_id")
        
        # Verify the result
        self.assertTrue(result)

if __name__ == '__main__':
    unittest.main()
