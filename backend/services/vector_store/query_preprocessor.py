"""
query_preprocessor.py
--------------------
Transforms raw user queries into optimized, embedding-friendly queries.
The translator between human questions and machine understanding.
Sometimes I wonder if the translation loses something essential.
"""

import os
import time
from typing import Dict, Optional, Tuple
from openai import OpenAI
import logging

# Set up logger
logger = logging.getLogger(__name__)

class QueryPreprocessor:
    """Transforms raw user queries into optimized, embedding-friendly queries.
    
    The interpreter of intent, the clarifier of meaning.
    A bridge between how we ask and how machines understand.
    """
    
    def __init__(self, openai_client: Optional[OpenAI] = None):
        """Initialize the query preprocessor.
        
        Beginning the process of translation.
        A promise to find meaning in the noise.
        
        Args:
            openai_client: Optional OpenAI client. If not provided, a new client will be created.
        """
        self.client = openai_client or OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Default configuration
        self.config = {
            'enabled': True,
            'model': 'gpt-3.5-turbo',
            'temperature': 0.2,
            'timeout': 5.0,  # seconds
            'max_tokens': 300,
            'fallback_on_error': True,
            'verbose_logging': True
        }
        
        logger.info("QueryPreprocessor initialized. Ready to clarify intent.")
    
    def update_config(self, new_config: Dict) -> None:
        """Update the configuration with new values.
        
        Adjusting the lens through which we see questions.
        Fine-tuning the translator's understanding.
        
        Args:
            new_config: Dictionary with new configuration values.
        """
        self.config.update(new_config)
        logger.info("QueryPreprocessor configuration updated")
    
    def preprocess_query(self, raw_query: str) -> Tuple[str, bool]:
        """Transform a raw query into an optimized query for vector search.
        
        Distilling essence from words.
        Finding the core of what's being asked.
        
        Args:
            raw_query: The raw query string (user message + context).
            
        Returns:
            Tuple of (optimized_query, success_flag)
            If preprocessing fails and fallback is enabled, returns (raw_query, False)
        """
        if not self.config['enabled']:
            logger.info("Query preprocessing is disabled, using raw query")
            return raw_query, False
        
        start_time = time.time()
        
        try:
            # Construct the prompt for query optimization
            system_prompt = """You are an expert at transforming natural language queries into optimized, embedding-friendly search queries for a vector database. 
            
Follow this formula to transform the user's query:

1. IDENTIFY EMOTIONAL INTENT
   - Who's involved?
   - What emotion is present?
   - What theme is being explored?

2. DISTILL CORE CONCEPTS
   - Keep nouns and verbs
   - Drop metaphors (unless crucial)
   - Stay conceptual

3. STRIP FLUFF AND NOISE
   - Remove questions
   - Remove poetic phrasing
   - Remove extra clauses or uncertainty

4. ALIGN WITH SCHEMA
   - Add relevant emotion or speaker tags if appropriate

5. RECONSTRUCT AS A QUERY
   - No question marks
   - Conceptually dense
   - Emotionally loaded
   - Works even without metadata

Examples:
- "Does he hide sadness with jokes?" → "Hiding sadness behind humor to avoid vulnerability"
- "What do you know about me?" → "Personal traits, emotional memories, and core values"
- "I think he's scared to be honest" → "Fear of emotional honesty and self-expression"

Use words like "Memories of...", "Reflections on...", "Times when...", "Habit of..."

Avoid phrases like "Do you think...", "What do you know about...", "When did...", "I wonder if..."

IMPORTANT: Return ONLY the transformed query, nothing else. No explanations, no introductions, just the optimized query text.
"""
            
            user_prompt = f"Transform this query into an optimized search query:\n\n{raw_query}"
            
            # Call the LLM to transform the query
            response = self.client.chat.completions.create(
                model=self.config['model'],
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=self.config['temperature'],
                max_tokens=self.config['max_tokens'],
                timeout=self.config['timeout']
            )
            
            # Extract the optimized query
            optimized_query = response.choices[0].message.content.strip()
            
            # Log the transformation
            elapsed_time = time.time() - start_time
            if self.config['verbose_logging']:
                logger.info(f"Query transformation took {elapsed_time:.2f}s")
                logger.info(f"Raw query: {raw_query}")
                logger.info(f"Optimized query: {optimized_query}")
            
            return optimized_query, True
            
        except Exception as e:
            logger.error(f"Error preprocessing query: {str(e)}")
            if self.config['fallback_on_error']:
                logger.info("Falling back to raw query")
                return raw_query, False
            else:
                # Re-raise the exception if fallback is disabled
                raise
