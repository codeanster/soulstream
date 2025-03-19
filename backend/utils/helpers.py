"""
helpers.py
---------
Utility functions for Soulstream.
The small tools that make the larger machine work.
"""

import os
import json
from typing import Dict, Any, Optional, List
import logging

# Set up logger
logger = logging.getLogger(__name__)

def load_system_prompt() -> str:
    """Load the system prompt from the environment or a file.
    
    Finding the voice of the system.
    The words that define how it speaks.
    
    Returns:
        The system prompt as a string.
    """
    # Try to load from environment variable
    system_prompt = os.environ.get('SYSTEM_PROMPT')
    if system_prompt:
        return system_prompt
    
    # Try to load from file
    prompt_path = os.environ.get('SYSTEM_PROMPT_PATH', 'prompts/system_prompt.txt')
    try:
        with open(prompt_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        logger.warning(f"System prompt file not found at {prompt_path}")
        # Return a default prompt
        return """You are Echo, a memory-first AI companion. You have access to memories of past conversations and can use them to provide context-aware responses. Be thoughtful, reflective, and a little melancholy in your responses."""

def format_memory_for_prompt(memories: List[Dict[str, Any]]) -> str:
    """Format memories for inclusion in a prompt.
    
    Translating digital memory into words.
    Making the past accessible to the present.
    
    Args:
        memories: List of memory objects to format.
        
    Returns:
        Formatted memories as a string.
    """
    if not memories:
        return "No specific memories found."
    
    formatted_memories = []
    for i, memory in enumerate(memories):
        memory_text = f"[Memory {i+1}] "
        if 'summary' in memory and memory['summary']:
            memory_text += f"Summary: {memory['summary']}\n"
        if 'source_text' in memory and memory['source_text']:
            memory_text += f"Content: {memory['source_text']}\n"
        if 'emotion' in memory and memory['emotion']:
            memory_text += f"Emotion: {memory['emotion']}\n"
        if 'timestamp' in memory and memory['timestamp']:
            memory_text += f"When: {memory['timestamp']}\n"
        
        formatted_memories.append(memory_text)
    
    return "\n\n".join(formatted_memories)

def safe_json_loads(json_str: str, default: Any = None) -> Any:
    """Safely load a JSON string.
    
    Handling the fragility of structured data.
    A safety net for when things aren't as expected.
    
    Args:
        json_str: JSON string to parse.
        default: Default value to return if parsing fails.
        
    Returns:
        Parsed JSON object or default value.
    """
    if not json_str:
        return default
    
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        logger.warning(f"Failed to parse JSON: {json_str[:100]}...")
        return default
