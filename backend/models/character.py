"""
character.py
-----------
Character model for Soulstream.
The AI personas that interact with users, the other half of the conversation.
Each row an artificial presence, each field an aspect of simulated identity.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.models.base import Base, TimestampMixin

class Character(Base, TimestampMixin):
    """Model for storing AI character information.
    
    The artificial presence in the system.
    The companion, the listener, the rememberer.
    """
    
    __tablename__ = 'characters'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    name = Column(String(50), nullable=False)
    persona_traits = Column(Text, nullable=True)  # JSON stored as text
    avatar_url = Column(Text, nullable=True)
    
    # Relationships
    user = relationship('User', back_populates='characters')
    memory_chips = relationship('MemoryChip', back_populates='character', cascade='all, delete-orphan')
    
    def __repr__(self):
        """String representation of the character.
        
        A glimpse of the artificial presence.
        A whisper of simulated identity.
        """
        return f"<Character(id={self.id}, name='{self.name}', user_id={self.user_id})>"
