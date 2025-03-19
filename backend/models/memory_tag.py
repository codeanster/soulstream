"""
memory_tag.py
------------
Memory tag model for Soulstream.
The labels we assign to memories, the categories of experience.
A system of meaning imposed on the chaos of recollection.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, ForeignKey, Table, Text, Float, Boolean
from sqlalchemy.orm import relationship
from backend.models.base import Base, TimestampMixin

# Association table for many-to-many relationship between memory chips and tags
memory_tag_association = Table(
    'memory_tag_association',
    Base.metadata,
    Column('memory_chip_id', Integer, ForeignKey('memory_chips.id'), primary_key=True),
    Column('memory_tag_id', Integer, ForeignKey('memory_tags.id'), primary_key=True)
)

class MemoryTag(Base, TimestampMixin):
    """Model for storing memory tags.
    
    The taxonomy of remembrance.
    The categories we use to make sense of experience.
    """
    
    __tablename__ = 'memory_tags'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    color = Column(String(10), nullable=True)  # Hex code for UI
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    # Relationships
    memory_chips = relationship(
        'MemoryChip',
        secondary=memory_tag_association,
        back_populates='memory_tags'
    )
    
    def __repr__(self):
        """String representation of the memory tag.
        
        A glimpse of the category's essence.
        A whisper of how we organize experience.
        """
        return f"<MemoryTag(id={self.id}, name='{self.name}')>"
