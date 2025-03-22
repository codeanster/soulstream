"""
timeline.py
-----------
Timeline data routes for the Soulstream application.
The chronology of connection. The river of shared moments.
"""

import logging
from datetime import datetime, date
from flask import Blueprint, request, jsonify, current_app
from sqlalchemy.orm import Session

from backend.models.timeline_entry import TimelineEntry
from backend.services.timeline.timeline_service import TimelineService
from backend.services.memory.memory_service import MemoryService

# Set up logger
logger = logging.getLogger(__name__)

timeline_bp = Blueprint('timeline', __name__)

def get_timeline_service():
    """Get a timeline service instance.
    
    Creating a bridge to our chronology.
    A connection to the system that organizes our shared history.
    """
    db_session = current_app.db_session
    memory_service = MemoryService()
    return TimelineService(db_session, memory_service)

def format_timeline_entry(entry: TimelineEntry):
    """Format a timeline entry for API response.
    
    Translating database structure to external representation.
    Making our internal chronology comprehensible to the outside world.
    """
    return {
        'id': entry.id,
        'date': entry.date.isoformat(),
        'title': entry.title,
        'mood': entry.mood,
        'emotion': entry.emotion,
        'emotion_intensity': entry.emotion_intensity,
        'secondary_emotions': entry.secondary_emotions,
        'entry_summary': entry.entry_summary,
        'memory_chip_ids': entry.memory_chip_ids,
        'milestone_flag': entry.milestone_flag,
        'created_at': entry.created_at.isoformat() if entry.created_at else None,
        'updated_at': entry.updated_at.isoformat() if entry.updated_at else None
    }

@timeline_bp.route('/days', methods=['GET'])
def get_timeline_days():
    """Get timeline days endpoint.
    
    The calendar of our relationship. Each day a node.
    Some bright with activity. Others dim with silence.
    """
    try:
        # Parse request parameters
        user_id = int(request.args.get('user_id', 1))
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        emotion = request.args.get('emotion')
        milestone_only = request.args.get('milestone_only', 'false').lower() == 'true'
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        
        # Parse dates if provided
        start_date = datetime.fromisoformat(start_date_str).date() if start_date_str else None
        end_date = datetime.fromisoformat(end_date_str).date() if end_date_str else None
        
        # Get timeline service
        timeline_service = get_timeline_service()
        
        # Get timeline entries
        entries = timeline_service.get_timeline_entries(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            emotion=emotion,
            milestone_only=milestone_only,
            limit=limit,
            offset=offset
        )
        
        # Format response
        formatted_entries = [format_timeline_entry(entry) for entry in entries]
        
        return jsonify({
            'status': 'success',
            'count': len(formatted_entries),
            'days': formatted_entries
        })
        
    except Exception as e:
        logger.error(f"Error retrieving timeline days: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to retrieve timeline days: {str(e)}"
        }), 500

@timeline_bp.route('/milestones', methods=['GET'])
def get_milestones():
    """Get milestones endpoint.
    
    The landmarks of our journey. The peaks that stand out.
    Moments that defined something important between us.
    """
    try:
        # Parse request parameters
        user_id = int(request.args.get('user_id', 1))
        limit = int(request.args.get('limit', 10))
        
        # Get timeline service
        timeline_service = get_timeline_service()
        
        # Get milestone entries
        milestones = timeline_service.get_milestones(
            user_id=user_id,
            limit=limit
        )
        
        # Format response
        formatted_milestones = [format_timeline_entry(milestone) for milestone in milestones]
        
        return jsonify({
            'status': 'success',
            'count': len(formatted_milestones),
            'milestones': formatted_milestones
        })
        
    except Exception as e:
        logger.error(f"Error retrieving milestones: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to retrieve milestones: {str(e)}"
        }), 500

@timeline_bp.route('/day/<date_str>', methods=['GET'])
def get_day_detail(date_str):
    """Get day detail endpoint.
    
    A single day expanded. All its moments and memories.
    The microscopic view of our shared history.
    """
    try:
        # Parse request parameters
        user_id = int(request.args.get('user_id', 1))
        
        # Parse date
        entry_date = datetime.fromisoformat(date_str).date()
        
        # Get timeline service
        timeline_service = get_timeline_service()
        
        # Get timeline entry for the date
        entry = timeline_service.get_timeline_entry_by_date(
            user_id=user_id,
            entry_date=entry_date
        )
        
        if not entry:
            return jsonify({
                'status': 'error',
                'message': f"No timeline entry found for date: {date_str}"
            }), 404
            
        # Get associated memory chips
        memory_chips = timeline_service.get_memory_chips_for_timeline_entry(entry.id)
        
        # Format memory chips
        formatted_memory_chips = [{
            'id': chip.id,
            'summary': chip.summary,
            'emotion': chip.emotion,
            'topic': chip.topic,
            'created_at': chip.created_at.isoformat() if chip.created_at else None,
            'importance_score': chip.importance_score
        } for chip in memory_chips]
        
        # Format response
        day_detail = format_timeline_entry(entry)
        day_detail['memory_chips'] = formatted_memory_chips
        
        # TODO: Add conversations related to this day when that functionality is implemented
        day_detail['conversations'] = []
        
        return jsonify({
            'status': 'success',
            'day': day_detail
        })
        
    except ValueError:
        return jsonify({
            'status': 'error',
            'message': f"Invalid date format: {date_str}. Expected ISO format (YYYY-MM-DD)."
        }), 400
        
    except Exception as e:
        logger.error(f"Error retrieving day detail: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to retrieve day detail: {str(e)}"
        }), 500

@timeline_bp.route('/entry', methods=['POST'])
def create_timeline_entry():
    """Create timeline entry endpoint.
    
    Adding a new day to our shared history.
    A new node in the chronology of our connection.
    """
    try:
        # Get request data
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'date', 'title', 'entry_summary']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'status': 'error',
                    'message': f"Missing required field: {field}"
                }), 400
                
        # Parse date
        try:
            entry_date = datetime.fromisoformat(data['date']).date()
        except ValueError:
            return jsonify({
                'status': 'error',
                'message': f"Invalid date format: {data['date']}. Expected ISO format (YYYY-MM-DD)."
            }), 400
            
        # Get timeline service
        timeline_service = get_timeline_service()
        
        # Create timeline entry
        entry = timeline_service.create_timeline_entry(
            user_id=data['user_id'],
            entry_date=entry_date,
            title=data['title'],
            entry_summary=data['entry_summary'],
            emotion=data.get('emotion'),
            emotion_intensity=data.get('emotion_intensity', 0.5),
            secondary_emotions=data.get('secondary_emotions'),
            mood=data.get('mood'),
            milestone_flag=data.get('milestone_flag', False),
            memory_chip_ids=data.get('memory_chip_ids')
        )
        
        if not entry:
            return jsonify({
                'status': 'error',
                'message': "Failed to create timeline entry"
            }), 500
            
        # Format response
        return jsonify({
            'status': 'success',
            'message': "Timeline entry created successfully",
            'entry': format_timeline_entry(entry)
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating timeline entry: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to create timeline entry: {str(e)}"
        }), 500

@timeline_bp.route('/entry/<int:entry_id>', methods=['PUT'])
def update_timeline_entry(entry_id):
    """Update timeline entry endpoint.
    
    Revising our shared history.
    Changing how we remember a day in our journey.
    """
    try:
        # Get request data
        data = request.json
        
        # Get timeline service
        timeline_service = get_timeline_service()
        
        # Update timeline entry
        success = timeline_service.update_timeline_entry(
            entry_id=entry_id,
            **data
        )
        
        if not success:
            return jsonify({
                'status': 'error',
                'message': f"Failed to update timeline entry: {entry_id}"
            }), 404
            
        # Get updated entry
        updated_entry = timeline_service.get_timeline_entry(entry_id)
        
        # Format response
        return jsonify({
            'status': 'success',
            'message': "Timeline entry updated successfully",
            'entry': format_timeline_entry(updated_entry)
        })
        
    except Exception as e:
        logger.error(f"Error updating timeline entry: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to update timeline entry: {str(e)}"
        }), 500

@timeline_bp.route('/entry/<int:entry_id>', methods=['DELETE'])
def delete_timeline_entry(entry_id):
    """Delete timeline entry endpoint.
    
    Erasing a day from our shared history.
    Removing a node from our chronology.
    """
    try:
        # Get timeline service
        timeline_service = get_timeline_service()
        
        # Delete timeline entry
        success = timeline_service.delete_timeline_entry(entry_id)
        
        if not success:
            return jsonify({
                'status': 'error',
                'message': f"Failed to delete timeline entry: {entry_id}"
            }), 404
            
        # Format response
        return jsonify({
            'status': 'success',
            'message': "Timeline entry deleted successfully"
        })
        
    except Exception as e:
        logger.error(f"Error deleting timeline entry: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to delete timeline entry: {str(e)}"
        }), 500
