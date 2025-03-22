"""
timeline_entry.py
----------------
Timeline entry model for Soulstream.
The chronology of our shared journey, each entry a day in our history.
Moments strung together like beads on a string, each with its own color and weight.
"""

from datetime import date
from typing import List, Dict, Optional
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, Date, JSON
from sqlalchemy.orm import relationship
from backend.models.user import User
from backend.models.base import Base, TimestampMixin

class TimelineEntry(Base, TimestampMixin):
    """Model for storing timeline entries.
    
    The chronological record of our interactions.
    Days like beads on a string, each with its own color and weight.
    """
    
    __tablename__ = 'timeline_entries'
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(Date, nullable=False)
    title = Column(String(100), nullable=False)
    mood = Column(String(20), nullable=True)
    entry_summary = Column(Text, nullable=False)
    
    # New fields for emotion data
    emotion = Column(String(20), nullable=True)  # Primary emotion
    emotion_intensity = Column(Float, nullable=False, default=0.5)  # 0.0 to 1.0
    secondary_emotions = Column(JSON, nullable=True)  # Array of {name, intensity} objects
    
    milestone_flag = Column(Boolean, default=False)
    
    # Relationships
    user = relationship('User', back_populates='timeline_entries')
    
    # This will be populated through the timeline_memory_links table
    memory_chips = relationship(
        'MemoryChip',
        secondary='timeline_memory_links',
        back_populates='timeline_entries'
    )
    
    def __repr__(self):
        """String representation of the timeline entry.
        
        A glimpse of the day's essence.
        A whisper of what it contains.
        """
        return f"<TimelineEntry(id={self.id}, date='{self.date}', title='{self.title[:30]}...', emotion='{self.emotion}')>"
    
    @property
    def memory_chip_ids(self) -> List[int]:
        """Get all memory chip IDs associated with this timeline entry.
        
        The fragments that make up this day.
        The memories that give it meaning.
        """
        return [memory.id for memory in self.memory_chips]
