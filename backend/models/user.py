"""
user.py
------
User model for Soulstream.
The human presence in the system, the source of memories.
Each row a person, each field an aspect of identity.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from backend.models.base import Base, TimestampMixin

class User(Base, TimestampMixin):
    """Model for storing user information.
    
    The human presence in the system.
    The source of memories, the reason for remembering.
    """
    
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), nullable=True)
    last_login = Column(DateTime, nullable=True)
    timezone = Column(String(50), default='UTC', nullable=False)
    is_premium = Column(Boolean, default=False)
    
    # Relationships
    characters = relationship('Character', back_populates='user', cascade='all, delete-orphan')
    memory_chips = relationship('MemoryChip', back_populates='user', cascade='all, delete-orphan')
    memory_tags = relationship('MemoryTag', back_populates='user', cascade='all, delete-orphan')
    timeline_entries = relationship('TimelineEntry', back_populates='user', cascade='all, delete-orphan')
    settings = relationship('Settings', back_populates='user', uselist=False, cascade='all, delete-orphan')
    
    def __repr__(self):
        """String representation of the user.
        
        A glimpse of the person behind the data.
        A whisper of who they are.
        """
        return f"<User(id={self.id}, username='{self.username}')>"
