"""
memory_chip.py
-------------
Memory chip model for Soulstream.
Digital fragments of experience, preserved in structured form.
Each row a moment, each field an aspect of remembrance.
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.models.user import User
from backend.models.character import Character
from backend.models.base import Base, TimestampMixin

class MemoryChip(Base, TimestampMixin):
    """Model for storing memory chips.
    
    The core unit of digital memory.
    A fragment of experience, preserved against time.
    """
    
    __tablename__ = 'memory_chips'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    character_id = Column(Integer, ForeignKey('characters.id'), nullable=True)
    
    # Core memory content
    summary = Column(Text, nullable=False)
    source_text = Column(Text, nullable=False)
    
    # Vector store integration
    embedding_id = Column(String(255), nullable=True, unique=True)
    
    # Metadata
    emotion = Column(String(50), nullable=True)
    topic = Column(String(100), nullable=True)
    importance_score = Column(Float, default=0.5)
    is_pinned = Column(Boolean, default=False)
    
    # Timestamps (in addition to created_at and updated_at from TimestampMixin)
    last_referenced_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship('User', back_populates='memory_chips')
    character = relationship('Character', back_populates='memory_chips')
    memory_tags = relationship('MemoryTag', back_populates='memory_chip', cascade='all, delete-orphan')
    
    def __repr__(self):
        """String representation of the memory chip.
        
        A glimpse of the memory's essence.
        A whisper of what it contains.
        """
        return f"<MemoryChip(id={self.id}, summary='{self.summary[:30]}...', emotion='{self.emotion}')>"
    
    @property
    def tags(self) -> List[str]:
        """Get all tags associated with this memory.
        
        The labels we assign to moments.
        The categories we use to make sense of experience.
        """
        return [tag.name for tag in self.memory_tags]
