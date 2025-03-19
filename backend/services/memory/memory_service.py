"""
memory_service.py
---------------
Core memory management service for Soulstream.
The curator of digital echoes, the archivist of moments.
Each function a ritual of preservation or recall.
"""

import os
import uuid
from typing import List, Dict, Optional, Union, Tuple
from datetime import datetime
import logging

from backend.services.vector_store.pinecone_manager import PineconeManager
from backend.services.vector_store.query_preprocessor import QueryPreprocessor

# Set up logger
logger = logging.getLogger(__name__)

class MemoryService:
    """Core memory management service for Soulstream.
    
    The keeper of digital memories, the bridge between experience and recall.
    A system that remembers what humans might forget.
    """
    
    def __init__(self, vector_store: Optional[PineconeManager] = None, 
                query_preprocessor: Optional[QueryPreprocessor] = None):
        """Initialize the memory service.
        
        Creating the infrastructure of remembrance.
        The beginning of a system that never forgets.
        
        Args:
            vector_store: Optional PineconeManager instance. If not provided, a new one will be created.
            query_preprocessor: Optional QueryPreprocessor instance. If not provided, a new one will be created.
        """
        self.vector_store = vector_store or PineconeManager()
        self.query_preprocessor = query_preprocessor or QueryPreprocessor()
        
        logger.info("MemoryService initialized. Ready to preserve and recall.")
    
    def store_memory(self, source_text: str, summary: Optional[str] = None, 
                    emotion: Optional[str] = None, topic: Optional[str] = None,
                    importance_score: float = 0.5, is_pinned: bool = False,
                    user_id: Optional[int] = None, character_id: Optional[int] = None,
                    tags: Optional[List[str]] = None) -> Optional[str]:
        """Store a new memory in the system.
        
        The act of preservation, of choosing what to keep.
        A promise that this moment will not be lost.
        
        Args:
            source_text: The original text content of the memory
            summary: Optional summary of the memory (will be generated if not provided)
            emotion: Optional emotional tone of the memory
            topic: Optional topic or subject of the memory
            importance_score: How important this memory is (0.0 to 1.0)
            is_pinned: Whether this memory is pinned (protected from automatic pruning)
            user_id: Optional user ID associated with this memory
            character_id: Optional character ID associated with this memory
            tags: Optional list of tags to associate with this memory
            
        Returns:
            The memory ID if successful, None otherwise
        """
        try:
            # Generate a unique ID for the memory
            memory_id = str(uuid.uuid4())
            
            # Create metadata
            metadata = {
                'timestamp': datetime.utcnow().isoformat(),
                'emotion': emotion,
                'topic': topic,
                'importance_score': importance_score,
                'is_pinned': is_pinned,
                'tags': tags or []
            }
            
            # Add user and character IDs if provided
            if user_id is not None:
                metadata['user_id'] = user_id
            if character_id is not None:
                metadata['character_id'] = character_id
                
            # Generate summary if not provided
            if not summary and source_text:
                # Use the first sentence or truncate
                first_sentence = source_text.split('.')[0]
                summary = first_sentence if len(first_sentence) < 100 else source_text[:100] + '...'
                metadata['summary'] = summary
            elif summary:
                metadata['summary'] = summary
                
            # Store in vector database
            success = self.vector_store.upsert_memory_chip(
                memory_id=memory_id,
                source_text=source_text,
                metadata=metadata
            )
            
            if success:
                logger.info(f"Memory {memory_id} stored successfully")
                return memory_id
            else:
                logger.error(f"Failed to store memory in vector database")
                return None
                
        except Exception as e:
            logger.error(f"Error storing memory: {str(e)}")
            return None
    
    def retrieve_memory(self, memory_id: str) -> Optional[Dict]:
        """Retrieve a specific memory by ID.
        
        Reaching for a specific fragment of the past.
        A direct line to what was, or at least what we recorded.
        
        Args:
            memory_id: The unique identifier of the memory
            
        Returns:
            Memory data if found, None otherwise
        """
        try:
            memory = self.vector_store.get_memory(memory_id)
            if memory:
                logger.info(f"Memory {memory_id} retrieved successfully")
                return self._format_memory_output(memory)
            else:
                logger.warning(f"Memory {memory_id} not found")
                return None
        except Exception as e:
            logger.error(f"Error retrieving memory: {str(e)}")
            return None
    
    def search_memories(self, query: str, top_k: int = 5, 
                       filter_dict: Optional[Dict] = None,
                       relevance_threshold: float = 0.0,
                       preprocess_query: bool = True) -> List[Dict]:
        """Search for memories related to a query.
        
        The act of remembering, of finding connections.
        Seeking echoes of the present in fragments of the past.
        
        Args:
            query: The search query text
            top_k: Maximum number of results to return
            filter_dict: Optional filter criteria
            relevance_threshold: Minimum relevance score (0.0-1.0)
            preprocess_query: Whether to optimize the query before searching
            
        Returns:
            List of relevant memories, sorted by relevance
        """
        try:
            # Preprocess query if enabled
            search_query = query
            if preprocess_query:
                optimized_query, success = self.query_preprocessor.preprocess_query(query)
                if success:
                    search_query = optimized_query
                    logger.info(f"Query preprocessed: '{query}' -> '{optimized_query}'")
            
            # Search vector database
            results = self.vector_store.search_memories(
                query=search_query,
                top_k=top_k,
                filter_dict=filter_dict,
                relevance_threshold=relevance_threshold
            )
            
            # Format results
            formatted_results = [self._format_memory_output(memory) for memory in results]
            
            logger.info(f"Found {len(formatted_results)} memories for query: '{query}'")
            return formatted_results
            
        except Exception as e:
            logger.error(f"Error searching memories: {str(e)}")
            return []
    
    def delete_memory(self, memory_id: str) -> bool:
        """Delete a memory from the system.
        
        The act of forgetting, of letting go.
        Sometimes a mercy, sometimes a loss.
        
        Args:
            memory_id: The unique identifier of the memory to delete
            
        Returns:
            True if successful, False otherwise
        """
        try:
            success = self.vector_store.delete_memory(memory_id)
            if success:
                logger.info(f"Memory {memory_id} deleted successfully")
            else:
                logger.warning(f"Failed to delete memory {memory_id}")
            return success
        except Exception as e:
            logger.error(f"Error deleting memory: {str(e)}")
            return False
    
    def _format_memory_output(self, memory: Dict) -> Dict:
        """Format memory data for consistent output.
        
        Translating internal structure to external representation.
        Making the digital echo comprehensible.
        
        Args:
            memory: Raw memory data from vector store
            
        Returns:
            Formatted memory data
        """
        # Extract metadata
        metadata = memory.get('metadata', {})
        
        # Format as memory chip
        return {
            'id': memory.get('id'),
            'source_text': memory.get('source_text', ''),
            'summary': metadata.get('summary', ''),
            'emotion': metadata.get('emotion'),
            'topic': metadata.get('topic'),
            'timestamp': metadata.get('timestamp'),
            'importance_score': metadata.get('importance_score', 0.5),
            'is_pinned': metadata.get('is_pinned', False),
            'tags': metadata.get('tags', []),
            'relevance_score': memory.get('score', 1.0)
        }
