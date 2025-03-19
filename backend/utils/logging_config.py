"""
logging_config.py
---------------
Logging configuration for Soulstream.
The silent witness to the system's operation.
Recording the echoes of digital memory.
"""

import logging
import os
import sys
from typing import Optional

def setup_logger(name: Optional[str] = None) -> logging.Logger:
    """Set up a logger with the given name.
    
    Creating the silent observer.
    The one who watches and remembers what the system does.
    
    Args:
        name: The name of the logger. If None, the root logger is returned.
        
    Returns:
        A configured logger instance.
    """
    # Get or create logger
    logger = logging.getLogger(name)
    
    # Only configure if it hasn't been configured yet
    if not logger.handlers:
        # Set log level based on environment
        log_level = os.environ.get('LOG_LEVEL', 'INFO')
        logger.setLevel(getattr(logging, log_level))
        
        # Create console handler
        handler = logging.StreamHandler(sys.stdout)
        
        # Create formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        
        # Add formatter to handler
        handler.setFormatter(formatter)
        
        # Add handler to logger
        logger.addHandler(handler)
        
        # Prevent propagation to avoid duplicate logs
        logger.propagate = False
    
    return logger
