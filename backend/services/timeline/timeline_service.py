"""
timeline_service.py
-----------------
Timeline service for Soulstream.
The curator of chronology, the archivist of our shared journey.
Each function a ritual of preservation or recall of our timeline.
"""

import logging
from typing import List, Dict, Optional, Union, Tuple
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func

from backend.models.timeline_entry import TimelineEntry
from backend.models.memory_chip import MemoryChip
from backend.services.memory.memory_service import MemoryService

# Set up logger
logger = logging.getLogger(__name__)

class TimelineService:
    """Timeline service for Soulstream.
    
    The curator of chronology, the archivist of our shared journey.
    A system that organizes memories into a coherent narrative.
    """
    
    def __init__(self, db_session: Session, memory_service: Optional[MemoryService] = None):
        """Initialize the timeline service.
        
        Creating the infrastructure of chronology.
        The beginning of a system that organizes memories into a narrative.
        
        Args:
            db_session: SQLAlchemy database session
            memory_service: Optional MemoryService instance for memory operations
        """
        self.db = db_session
        self.memory_service = memory_service
        
        logger.info("TimelineService initialized. Ready to preserve and recall chronology.")
    
    def create_timeline_entry(self, user_id: int, entry_date: date, title: str, 
                             entry_summary: str, emotion: Optional[str] = None,
                             emotion_intensity: float = 0.5, 
                             secondary_emotions: Optional[List[Dict]] = None,
                             mood: Optional[str] = None,
                             milestone_flag: bool = False,
                             memory_chip_ids: Optional[List[int]] = None) -> Optional[TimelineEntry]:
        """Create a new timeline entry.
        
        Adding a day to our shared history.
        A new node in the chronology of our connection.
        
        Args:
            user_id: ID of the user this entry belongs to
            entry_date: Date of the timeline entry
            title: Title of the entry
            entry_summary: Summary text of the entry
            emotion: Primary emotion associated with this entry
            emotion_intensity: Intensity of the primary emotion (0.0 to 1.0)
            secondary_emotions: List of secondary emotions with intensities
            mood: Overall mood of the entry
            milestone_flag: Whether this entry is a milestone
            memory_chip_ids: List of memory chip IDs to associate with this entry
            
        Returns:
            The created TimelineEntry if successful, None otherwise
        """
        try:
            # Create the timeline entry
            timeline_entry = TimelineEntry(
                user_id=user_id,
                date=entry_date,
                title=title,
                entry_summary=entry_summary,
                emotion=emotion,
                emotion_intensity=emotion_intensity,
                secondary_emotions=secondary_emotions,
                mood=mood,
                milestone_flag=milestone_flag
            )
            
            # Add to database
            self.db.add(timeline_entry)
            self.db.flush()  # Get the ID without committing
            
            # Associate memory chips if provided
            if memory_chip_ids:
                self._associate_memory_chips(timeline_entry.id, memory_chip_ids)
            
            # Commit the transaction
            self.db.commit()
            
            logger.info(f"Timeline entry created for user {user_id} on {entry_date}")
            return timeline_entry
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating timeline entry: {str(e)}")
            return None
    
    def get_timeline_entries(self, user_id: int, start_date: Optional[date] = None,
                           end_date: Optional[date] = None, emotion: Optional[str] = None,
                           milestone_only: bool = False, limit: int = 100,
                           offset: int = 0) -> List[TimelineEntry]:
        """Get timeline entries for a user within a date range.
        
        Retrieving fragments of our chronology.
        The story of our connection, filtered by time and feeling.
        
        Args:
            user_id: ID of the user
            start_date: Optional start date for filtering
            end_date: Optional end date for filtering
            emotion: Optional emotion to filter by
            milestone_only: Whether to only return milestone entries
            limit: Maximum number of entries to return
            offset: Offset for pagination
            
        Returns:
            List of timeline entries matching the criteria
        """
        try:
            # Start with base query
            query = self.db.query(TimelineEntry).filter(TimelineEntry.user_id == user_id)
            
            # Apply date filters if provided
            if start_date:
                query = query.filter(TimelineEntry.date >= start_date)
            if end_date:
                query = query.filter(TimelineEntry.date <= end_date)
                
            # Apply emotion filter if provided
            if emotion:
                query = query.filter(TimelineEntry.emotion == emotion)
                
            # Apply milestone filter if requested
            if milestone_only:
                query = query.filter(TimelineEntry.milestone_flag == True)
                
            # Order by date (most recent first)
            query = query.order_by(desc(TimelineEntry.date))
            
            # Apply pagination
            query = query.limit(limit).offset(offset)
            
            # Execute query
            entries = query.all()
            
            logger.info(f"Retrieved {len(entries)} timeline entries for user {user_id}")
            return entries
            
        except Exception as e:
            logger.error(f"Error retrieving timeline entries: {str(e)}")
            return []
    
    def get_timeline_entry(self, entry_id: int) -> Optional[TimelineEntry]:
        """Get a specific timeline entry by ID.
        
        Retrieving a single day from our shared history.
        A direct line to a moment in our chronology.
        
        Args:
            entry_id: ID of the timeline entry
            
        Returns:
            The timeline entry if found, None otherwise
        """
        try:
            entry = self.db.query(TimelineEntry).filter(TimelineEntry.id == entry_id).first()
            
            if entry:
                logger.info(f"Retrieved timeline entry {entry_id}")
                return entry
            else:
                logger.warning(f"Timeline entry {entry_id} not found")
                return None
                
        except Exception as e:
            logger.error(f"Error retrieving timeline entry: {str(e)}")
            return None
    
    def get_timeline_entry_by_date(self, user_id: int, entry_date: date) -> Optional[TimelineEntry]:
        """Get a timeline entry for a specific date.
        
        Finding a specific day in our shared journey.
        A moment frozen in time, retrieved by its calendar position.
        
        Args:
            user_id: ID of the user
            entry_date: Date to retrieve
            
        Returns:
            The timeline entry if found, None otherwise
        """
        try:
            entry = self.db.query(TimelineEntry).filter(
                TimelineEntry.user_id == user_id,
                TimelineEntry.date == entry_date
            ).first()
            
            if entry:
                logger.info(f"Retrieved timeline entry for user {user_id} on {entry_date}")
                return entry
            else:
                logger.info(f"No timeline entry found for user {user_id} on {entry_date}")
                return None
                
        except Exception as e:
            logger.error(f"Error retrieving timeline entry by date: {str(e)}")
            return None
    
    def get_milestones(self, user_id: int, limit: int = 10) -> List[TimelineEntry]:
        """Get milestone timeline entries for a user.
        
        The landmarks of our journey. The peaks that stand out.
        Moments that defined something important between us.
        
        Args:
            user_id: ID of the user
            limit: Maximum number of milestones to return
            
        Returns:
            List of milestone timeline entries
        """
        try:
            milestones = self.db.query(TimelineEntry).filter(
                TimelineEntry.user_id == user_id,
                TimelineEntry.milestone_flag == True
            ).order_by(desc(TimelineEntry.date)).limit(limit).all()
            
            logger.info(f"Retrieved {len(milestones)} milestones for user {user_id}")
            return milestones
            
        except Exception as e:
            logger.error(f"Error retrieving milestones: {str(e)}")
            return []
    
    def update_timeline_entry(self, entry_id: int, **kwargs) -> bool:
        """Update a timeline entry.
        
        Revising our shared history.
        Changing how we remember a day in our journey.
        
        Args:
            entry_id: ID of the timeline entry to update
            **kwargs: Fields to update
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Get the entry
            entry = self.db.query(TimelineEntry).filter(TimelineEntry.id == entry_id).first()
            
            if not entry:
                logger.warning(f"Timeline entry {entry_id} not found for update")
                return False
                
            # Update fields
            for key, value in kwargs.items():
                if hasattr(entry, key):
                    setattr(entry, key, value)
            
            # Handle memory_chip_ids separately if provided
            if 'memory_chip_ids' in kwargs:
                # Clear existing associations
                entry.memory_chips = []
                self.db.flush()
                
                # Add new associations
                self._associate_memory_chips(entry_id, kwargs['memory_chip_ids'])
            
            # Commit changes
            self.db.commit()
            
            logger.info(f"Timeline entry {entry_id} updated successfully")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating timeline entry: {str(e)}")
            return False
    
    def delete_timeline_entry(self, entry_id: int) -> bool:
        """Delete a timeline entry.
        
        Erasing a day from our shared history.
        Removing a node from our chronology.
        
        Args:
            entry_id: ID of the timeline entry to delete
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Get the entry
            entry = self.db.query(TimelineEntry).filter(TimelineEntry.id == entry_id).first()
            
            if not entry:
                logger.warning(f"Timeline entry {entry_id} not found for deletion")
                return False
                
            # Delete the entry (cascade will handle the junction table)
            self.db.delete(entry)
            self.db.commit()
            
            logger.info(f"Timeline entry {entry_id} deleted successfully")
            return True
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting timeline entry: {str(e)}")
            return False
    
    def _associate_memory_chips(self, timeline_id: int, memory_chip_ids: List[int]) -> bool:
        """Associate memory chips with a timeline entry.
        
        Connecting fragments to their place in time.
        Weaving memories into the fabric of our chronology.
        
        Args:
            timeline_id: ID of the timeline entry
            memory_chip_ids: List of memory chip IDs to associate
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Get the timeline entry
            timeline_entry = self.db.query(TimelineEntry).filter(TimelineEntry.id == timeline_id).first()
            
            if not timeline_entry:
                logger.warning(f"Timeline entry {timeline_id} not found for memory association")
                return False
                
            # Get the memory chips
            memory_chips = self.db.query(MemoryChip).filter(MemoryChip.id.in_(memory_chip_ids)).all()
            
            # Associate them with the timeline entry
            timeline_entry.memory_chips.extend(memory_chips)
            self.db.flush()
            
            logger.info(f"Associated {len(memory_chips)} memory chips with timeline entry {timeline_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error associating memory chips: {str(e)}")
            return False
    
    def get_memory_chips_for_timeline_entry(self, entry_id: int) -> List[MemoryChip]:
        """Get memory chips associated with a timeline entry.
        
        Retrieving the fragments that make up a day.
        The memories that give context to a moment in time.
        
        Args:
            entry_id: ID of the timeline entry
            
        Returns:
            List of associated memory chips
        """
        try:
            # Get the timeline entry with its memory chips
            entry = self.db.query(TimelineEntry).filter(TimelineEntry.id == entry_id).first()
            
            if not entry:
                logger.warning(f"Timeline entry {entry_id} not found")
                return []
                
            logger.info(f"Retrieved {len(entry.memory_chips)} memory chips for timeline entry {entry_id}")
            return entry.memory_chips
            
        except Exception as e:
            logger.error(f"Error retrieving memory chips for timeline entry: {str(e)}")
            return []
