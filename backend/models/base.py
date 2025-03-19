"""
base.py
-------
Base model for SQLAlchemy models in Soulstream.
The foundation upon which all structures rest.
A template for existence in the digital realm.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

# Create base class for SQLAlchemy models
Base = declarative_base()

class TimestampMixin:
    """Mixin that adds created_at and updated_at columns to models.
    
    Time markers in the digital space.
    Anchors in the endless flow of moments.
    """
    
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
