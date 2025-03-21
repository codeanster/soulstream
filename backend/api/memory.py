"""
memory.py
---------
Memory management routes for the Soulstream application.
The core of what we are. The fragments that define us.
The interface between thought and recollection.
"""

import logging
from flask import Blueprint, request, jsonify, current_app
from backend.services.memory.memory_service import MemoryService

# Set up logger
logger = logging.getLogger(__name__)

memory_bp = Blueprint('memory', __name__)

# Initialize memory service
memory_service = None

@memory_bp.record_once
def initialize_memory_service(state):
    """Initialize the memory service when the blueprint is registered.
    
    Preparing the infrastructure of remembrance.
    Setting up the systems that will preserve what matters.
    """
    global memory_service
    memory_service = MemoryService()
    logger.info("Memory service initialized")

@memory_bp.route('/chips', methods=['GET'])
def get_memory_chips():
    """Get memory chips endpoint.
    
    Little fragments of the past. Crystallized moments.
    Each one a universe of context and feeling.
    """
    try:
        user_id = request.args.get('user_id')
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        emotion = request.args.get('emotion')
        topic = request.args.get('topic')
        
        # Build filter dictionary
        filter_dict = {}
        if user_id:
            filter_dict['user_id'] = int(user_id)
        if emotion:
            filter_dict['emotion'] = emotion
        if topic:
            filter_dict['topic'] = topic
        
        # Log the request parameters for debugging
        logger.info(f"Memory chips request - filter: {filter_dict}, limit: {limit}, offset: {offset}")
        
        # Use memory service to search with empty query (returns all memories)
        memories = memory_service.search_memories(
            query="",  # Empty query to get all memories
            top_k=limit,
            filter_dict=filter_dict if filter_dict else None,
            preprocess_query=False  # No need to preprocess an empty query
        )
        
        # Log the results for debugging
        logger.info(f"Memory search returned {len(memories)} results")
        
        # Apply pagination
        paginated_memories = memories[offset:offset + limit]
        
        # Log the response for debugging
        logger.info(f"Returning {len(paginated_memories)} paginated memories")
        
        return jsonify({
            'status': 'success',
            'memories': paginated_memories,
            'pagination': {
                'total': len(memories),
                'limit': limit,
                'offset': offset
            }
        })
    except Exception as e:
        logger.error(f"Error retrieving memory chips: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to retrieve memory chips: {str(e)}"
        }), 500

@memory_bp.route('/search', methods=['GET'])
def search_memories():
    """Search memories endpoint.
    
    Looking for something specific in the sea of recollection.
    Sometimes what we find isn't what we were looking for.
    """
    try:
        user_id = request.args.get('user_id')
        query = request.args.get('query', '')
        limit = int(request.args.get('limit', 10))
        relevance_threshold = float(request.args.get('relevance_threshold', 0.0))
        
        if not query:
            return jsonify({
                'status': 'error',
                'message': 'Query parameter is required'
            }), 400
        
        # Build filter dictionary
        filter_dict = {}
        if user_id:
            filter_dict['user_id'] = int(user_id)
        
        # Use memory service to search
        results = memory_service.search_memories(
            query=query,
            top_k=limit,
            filter_dict=filter_dict if filter_dict else None,
            relevance_threshold=relevance_threshold,
            preprocess_query=True
        )
        
        return jsonify({
            'status': 'success',
            'results': results
        })
    except Exception as e:
        logger.error(f"Error searching memories: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to search memories: {str(e)}"
        }), 500

@memory_bp.route('/store', methods=['POST'])
def store_memory():
    """Store a new memory endpoint.
    
    The act of preservation, of choosing what to keep.
    A promise that this moment will not be lost.
    """
    try:
        data = request.get_json()
        
        # Extract memory data
        source_text = data.get('source_text')
        summary = data.get('summary')
        emotion = data.get('emotion')
        topic = data.get('topic')
        importance_score = float(data.get('importance_score', 0.5))
        is_pinned = bool(data.get('is_pinned', False))
        user_id = data.get('user_id')
        character_id = data.get('character_id')
        tags = data.get('tags', [])
        
        if not source_text:
            return jsonify({
                'status': 'error',
                'message': 'source_text is required'
            }), 400
        
        # Store memory using memory service
        memory_id = memory_service.store_memory(
            source_text=source_text,
            summary=summary,
            emotion=emotion,
            topic=topic,
            importance_score=importance_score,
            is_pinned=is_pinned,
            user_id=user_id,
            character_id=character_id,
            tags=tags
        )
        
        if memory_id:
            return jsonify({
                'status': 'success',
                'message': f'Memory stored successfully',
                'memory_id': memory_id
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to store memory'
            }), 500
    except Exception as e:
        logger.error(f"Error storing memory: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to store memory: {str(e)}"
        }), 500

@memory_bp.route('/pin', methods=['POST'])
def pin_memory():
    """Pin a memory endpoint.
    
    Some memories we choose to keep close.
    To revisit. To cherish. To never let fade.
    """
    try:
        data = request.get_json()
        memory_id = data.get('memory_id')
        
        if not memory_id:
            return jsonify({
                'status': 'error',
                'message': 'memory_id is required'
            }), 400
        
        # Retrieve the memory
        memory = memory_service.retrieve_memory(memory_id)
        
        if not memory:
            return jsonify({
                'status': 'error',
                'message': f'Memory {memory_id} not found'
            }), 404
        
        # Update the memory with is_pinned=True
        updated_memory_id = memory_service.store_memory(
            source_text=memory['source_text'],
            summary=memory['summary'],
            emotion=memory['emotion'],
            topic=memory['topic'],
            importance_score=memory['importance_score'],
            is_pinned=True,
            user_id=memory.get('user_id'),
            character_id=memory.get('character_id'),
            tags=memory.get('tags', [])
        )
        
        if updated_memory_id:
            return jsonify({
                'status': 'success',
                'message': f'Memory {memory_id} pinned successfully'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': f'Failed to pin memory {memory_id}'
            }), 500
    except Exception as e:
        logger.error(f"Error pinning memory: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to pin memory: {str(e)}"
        }), 500

@memory_bp.route('/forget', methods=['POST'])
def forget_memory():
    """Forget a memory endpoint.
    
    Some things are better left forgotten.
    But the act of forgetting leaves its own mark.
    """
    try:
        data = request.get_json()
        memory_id = data.get('memory_id')
        
        if not memory_id:
            return jsonify({
                'status': 'error',
                'message': 'memory_id is required'
            }), 400
        
        # Delete the memory
        success = memory_service.delete_memory(memory_id)
        
        if success:
            return jsonify({
                'status': 'success',
                'message': f'Memory {memory_id} forgotten successfully'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': f'Failed to forget memory {memory_id}'
            }), 500
    except Exception as e:
        logger.error(f"Error forgetting memory: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to forget memory: {str(e)}"
        }), 500

@memory_bp.route('/retrieve/<string:memory_id>', methods=['GET'])
def retrieve_memory(memory_id):
    """Retrieve a specific memory endpoint.
    
    Reaching for a specific fragment of the past.
    A direct line to what was, or at least what we recorded.
    """
    try:
        if not memory_id:
            return jsonify({
                'status': 'error',
                'message': 'memory_id is required'
            }), 400
        
        # Retrieve the memory
        memory = memory_service.retrieve_memory(memory_id)
        
        if memory:
            return jsonify({
                'status': 'success',
                'memory': memory
            })
        else:
            return jsonify({
                'status': 'error',
                'message': f'Memory {memory_id} not found'
            }), 404
    except Exception as e:
        logger.error(f"Error retrieving memory: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to retrieve memory: {str(e)}"
        }), 500
