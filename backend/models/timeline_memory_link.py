"""
timeline_memory_link.py
----------------------
Junction table model for linking timeline entries to memory chips.
The threads that connect moments to memories.
The associations that give context to our chronology.
"""

from sqlalchemy import Column, Integer, ForeignKey, Table, UniqueConstraint
from backend.models.base import Base

# Define the junction table for the many-to-many relationship
# between timeline entries and memory chips
timeline_memory_links = Table(
    'timeline_memory_links',
    Base.metadata,
    Column('timeline_id', Integer, ForeignKey('timeline_entries.id', ondelete='CASCADE'), primary_key=True),
    Column('memory_id', Integer, ForeignKey('memory_chips.id', ondelete='CASCADE'), primary_key=True),
    UniqueConstraint('timeline_id', 'memory_id', name='uix_timeline_memory'),
    extend_existing=True
)
