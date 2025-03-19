"""
pinecone_manager.py
------------------
Vector store management for Soulstream using Pinecone.
Translating memories into vectors, emotions into distances.
Each embedding a ghost of a moment, preserved in mathematical space.
"""

import os
from typing import List, Dict, Optional, Union
from pinecone import Pinecone
from openai import OpenAI
from dotenv import load_dotenv
import logging

# Set up logger
logger = logging.getLogger(__name__)

class PineconeManager:
    """Manages interactions with Pinecone vector database.
    
    A bridge between human experience and mathematical representation.
    Memories reduced to numbers, searchable but never quite the same.
    """
    
    def __init__(self):
        """Initialize Pinecone with API key.
        
        The beginning of memory externalization.
        A promise to remember what might otherwise fade.
        """
        load_dotenv()
        self.api_key = os.getenv('PINECONE_API_KEY')
        self.index_name = os.getenv('PINECONE_INDEX_NAME')
        self.region = os.getenv('PINECONE_REGION')
        
        if not self.api_key:
            logger.error("Missing required Pinecone API key")
            raise ValueError("Missing required Pinecone API key")
        if not self.region:
            logger.error("Missing required Pinecone region")
            raise ValueError("Missing required Pinecone region")
        if not self.index_name:
            logger.error("Missing required Pinecone index name")
            raise ValueError("Missing required Pinecone index name")
        
        self.pc = Pinecone(
            api_key=self.api_key,
            environment=self.region
        )
        self.index = self.pc.Index(self.index_name)
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Simplified key categories for term extraction
        self.term_categories = {
            'conversation': ['said', 'asked', 'replied', 'discussed'],
            'actions': ['did', 'made', 'created', 'worked'],
            'preferences': ['like', 'love', 'enjoy', 'prefer'],
            'topics': ['about', 'regarding', 'concerning'],
            'technical': ['code', 'program', 'build', 'develop'],
            'emotions': ['happy', 'sad', 'angry', 'excited', 'wistful', 'peaceful', 'longing']
        }
        
        logger.info("PineconeManager initialized. Ready to preserve memories.")
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using OpenAI.
        
        Transforming words into numbers.
        The alchemy of modern memory.
        """
        try:
            response = self.client.embeddings.create(
                input=text,
                model="text-embedding-ada-002"
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise
    
    def _extract_key_terms(self, text: str) -> List[str]:
        """Extract key terms from text for better matching.
        
        Finding the essence in the noise.
        The words that matter, that define a moment.
        """
        original_words = text.split()
        key_terms = set()
        
        # Add capitalized words (potential names/important terms)
        key_terms.update(word.lower() for word in original_words
                        if word and word[0].isupper())
        
        # Convert to lowercase for category matching
        text = text.lower()
        words = set(text.split())
        
        # Category-based term extraction
        for category, terms in self.term_categories.items():
            if matched_terms := words.intersection(terms):
                key_terms.update(matched_terms)
                key_terms.add(category)
        
        return sorted(list(key_terms))
    
    def upsert_memory_chip(self, memory_id: str, source_text: str, 
                          metadata: Optional[Dict] = None) -> bool:
        """Insert or update a memory chip in Pinecone.
        
        Preserving a fragment of experience.
        Each vector a promise: this will not be forgotten.
        """
        try:
            embedding = self.generate_embedding(source_text)
            meta = metadata or {}
            meta['source_text'] = source_text
            meta['key_terms'] = self._extract_key_terms(source_text)
            
            self.index.upsert(vectors=[{
                'id': memory_id,
                'values': embedding,
                'metadata': meta
            }])
            logger.info(f"Memory {memory_id} preserved in vector space")
            return True
        except Exception as e:
            logger.error(f"Error upserting to Pinecone: {str(e)}")
            return False
    
    def _calculate_term_importance(self, query_terms: List[str], metadata_terms: List[str]) -> float:
        """Calculate semantic importance of matching terms.
        
        Measuring the resonance between question and memory.
        Some connections stronger than others, like certain memories that haunt us.
        """
        if not query_terms or not metadata_terms:
            return 0.0
            
        # Convert to sets for intersection
        query_set = set(query_terms)
        metadata_set = set(metadata_terms)
        
        # Calculate direct overlap
        overlap = query_set & metadata_set
        
        if not overlap:
            return 0.0
            
        # Weight terms by their significance
        term_weights = {
            'conversation': 1.2,  # Higher weight for conversation context
            'technical': 1.3,    # Technical terms are highly specific
            'emotions': 1.4,     # Emotional context is important
            'topics': 1.1,       # Topic markers
            'actions': 1.0,      # Base weight for actions
            'preferences': 1.2   # Personal preferences are significant
        }
        
        # Calculate weighted importance
        total_weight = 0
        for term in overlap:
            # Check if term belongs to a category
            for category, weight in term_weights.items():
                if term == category or term in self.term_categories.get(category, []):
                    total_weight += weight
                    break
            else:
                # If term doesn't match any category, give it base weight
                total_weight += 1.0
                
        # Normalize by the maximum possible weight
        max_weight = max(len(query_terms), len(metadata_terms)) * max(term_weights.values())
        return total_weight / max_weight if max_weight > 0 else 0.0

    def _calculate_temporal_relevance(self, timestamp: Optional[str]) -> float:
        """Calculate temporal relevance score.
        
        Recent memories burn brighter.
        The past fades, but never completely disappears.
        """
        if not timestamp:
            return 0.5  # Neutral score for items without timestamp
            
        try:
            from datetime import datetime, timezone
            # Ensure memory_time has timezone info
            memory_time = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            # Ensure current_time has timezone info
            current_time = datetime.now(timezone.utc)
            
            # Calculate time difference in days
            time_diff = (current_time - memory_time).days
            
            # Exponential decay function
            # Recent memories get higher scores, older ones decay but don't go to zero
            import math
            decay_factor = 0.05  # Adjust this to control decay rate
            temporal_score = 0.3 + (0.7 * math.exp(-decay_factor * time_diff))
            return min(1.0, max(0.0, temporal_score))
        except Exception as e:
            logger.error(f"Error calculating temporal relevance: {str(e)}")
            return 0.5

    def _calculate_context_similarity(self, query_terms: List[str], metadata: Dict) -> float:
        """Calculate contextual similarity score.
        
        Finding resonance between question and memory context.
        The subtle harmonies of related thoughts.
        """
        # Extract context indicators from metadata
        context_indicators = []
        
        # Add category tags if present
        if 'categories' in metadata:
            context_indicators.extend(metadata['categories'])
            
        # Add any topic or theme markers
        if 'topics' in metadata:
            context_indicators.extend(metadata['topics'])
            
        # Add emotion markers if present
        if 'emotion' in metadata:
            context_indicators.append(metadata['emotion'])
            
        if not context_indicators:
            return 0.5  # Neutral score if no context available
            
        # Calculate overlap between query terms and context
        context_set = set(context_indicators)
        query_set = set(query_terms)
        
        overlap = len(query_set & context_set)
        total = len(query_set | context_set)
        
        return overlap / total if total > 0 else 0.5

    def search_memories(self, query: str, top_k: int = 5,
                       filter_dict: Optional[Dict] = None,
                       relevance_threshold: float = 0.0) -> List[Dict]:
        """Search for similar memories using text query with enhanced scoring.
        
        Seeking echoes of the present in the past.
        The search for resonance, for connection across time.
        
        Args:
            query: The search query text
            top_k: Number of results to return
            filter_dict: Optional filter dictionary
            relevance_threshold: Minimum relevance score (0.0-1.0) for memories to be included
            
        Returns:
            List of formatted memory results with improved scoring
        """
        try:
            logger.info(f"Searching for memories: '{query}'")
            
            query_embedding = self.generate_embedding(query)
            query_terms = self._extract_key_terms(query)
            
            # Get initial results
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k * 2,  # Fetch more results for filtering
                include_metadata=True,
                filter=filter_dict
            )
            
            logger.info(f"Found {len(results.matches)} potential memory matches")
            
            formatted_results = []
            
            for match in results.matches:
                metadata_terms = match.metadata.get('key_terms', [])
                
                # Calculate component scores
                vector_score = match.score
                term_score = self._calculate_term_importance(query_terms, metadata_terms)
                temporal_score = self._calculate_temporal_relevance(
                    match.metadata.get('timestamp')
                )
                context_score = self._calculate_context_similarity(
                    query_terms, match.metadata
                )
                
                # Weighted combination of scores
                combined_score = (
                    vector_score * 0.60 +          # Vector similarity
                    term_score * 0.15 +            # Term importance
                    temporal_score * 0.15 +        # Time relevance
                    context_score * 0.10           # Context similarity
                )
                
                # Extract title from first sentence or use truncated content
                source_text = match.metadata.get('source_text', '')
                first_sentence = source_text.split('.')[0] if source_text else ''
                title = (match.metadata.get('title') or 
                        first_sentence or 
                        source_text[:50] + ('...' if len(source_text) > 50 else ''))

                formatted_results.append({
                    'id': match.id,
                    'score': combined_score,
                    'source_text': source_text,
                    'summary': title,
                    'metadata': {k: v for k, v in match.metadata.items()
                               if k not in ['source_text', 'key_terms']},
                    'component_scores': {
                        'vector_similarity': vector_score,
                        'term_importance': term_score,
                        'temporal_relevance': temporal_score,
                        'context_similarity': context_score
                    }
                })
            
            # Sort by combined score
            formatted_results.sort(key=lambda x: x['score'], reverse=True)
            
            # Filter by relevance threshold if specified
            if relevance_threshold > 0:
                formatted_results = [r for r in formatted_results if r['score'] >= relevance_threshold]
                logger.info(f"Filtered memories by relevance threshold {relevance_threshold}: {len(formatted_results)} memories passed")
            
            return formatted_results[:top_k]
            
        except Exception as e:
            logger.error(f"Error searching in Pinecone: {str(e)}")
            return []
    
    def get_memory(self, memory_id: str) -> Optional[Dict]:
        """Retrieve a specific memory by ID.
        
        Reaching for a specific fragment of the past.
        A direct line to what was, or at least what we recorded.
        """
        try:
            result = self.index.fetch(ids=[memory_id])
            if memory_id in result.vectors:
                vector_data = result.vectors[memory_id]
                return {
                    'id': memory_id,
                    'source_text': vector_data.metadata.get('source_text', ''),
                    'metadata': {k: v for k, v in vector_data.metadata.items() 
                               if k not in ['source_text', 'key_terms']}
                }
            return None
        except Exception as e:
            logger.error(f"Error fetching from Pinecone: {str(e)}")
            return None
    
    def delete_memory(self, memory_id: str) -> bool:
        """Delete a memory from Pinecone by ID.
        
        The act of forgetting, of letting go.
        Sometimes a mercy, sometimes a loss.
        """
        try:
            self.index.delete(ids=[memory_id])
            logger.info(f"Memory {memory_id} deleted from vector space")
            return True
        except Exception as e:
            logger.error(f"Error deleting from Pinecone: {str(e)}")
            return False
