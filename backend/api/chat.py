"""
chat.py
-------
Chat interaction routes for the Soulstream application.
Where words flow, and memories form in real-time.
The interface between thought and conversation.
"""

import logging
import uuid
from flask import Blueprint, request, jsonify, current_app

# Set up logger
logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/message', methods=['POST'])
def send_message():
    """Send a message endpoint.
    
    Words exchanged. Memories created.
    Some will last. Most will fade.
    """
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        user_id = data.get('user_id')
        character_id = data.get('character_id')
        
        if not user_message:
            return jsonify({
                'status': 'error',
                'message': 'Message is required'
            }), 400
        
        # Get memory service from app context
        memory_service = current_app.memory_service
        
        # Store the user message as a memory
        memory_id = memory_service.store_memory(
            source_text=user_message,
            user_id=user_id,
            character_id=character_id,
            tags=['user_message']
        )
        
        if not memory_id:
            logger.warning("Failed to store user message as memory")
        
        # Retrieve relevant memories based on the user's message
        relevant_memories = memory_service.search_memories(
            query=user_message,
            top_k=5,
            preprocess_query=True
        )
        
        # Format memories for response
        referenced_memories = []
        for memory in relevant_memories:
            referenced_memories.append({
                'id': memory.get('id'),
                'summary': memory.get('summary', ''),
                'relevance_score': memory.get('relevance_score', 0)
            })
        
        # Generate AI response (placeholder for now)
        ai_response = f"Echo: I've received your message: '{user_message}'. I remember you."
        
        # Store the AI response as a memory
        ai_memory_id = memory_service.store_memory(
            source_text=ai_response,
            user_id=user_id,
            character_id=character_id,
            tags=['ai_response']
        )
        
        return jsonify({
            'status': 'success',
            'response': {
                'message': ai_response,
                'referenced_memories': referenced_memories
            }
        })
    except Exception as e:
        logger.error(f"Error in send_message: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f"Failed to process message: {str(e)}"
        }), 500

@chat_bp.route('/history', methods=['GET'])
def get_chat_history():
    """Get chat history endpoint.
    
    The past laid bare. Conversations like footprints in sand.
    Some washed away. Others preserved.
    """
    user_id = request.args.get('user_id', 1)
    limit = int(request.args.get('limit', 50))
    offset = int(request.args.get('offset', 0))
    
    # TODO: Implement actual history retrieval
    
    # Placeholder response
    return jsonify({
        'status': 'success',
        'history': [
            {
                'id': 1,
                'sender': 'user',
                'message': 'Hello, do you remember me?',
                'timestamp': '2025-03-18T16:30:00Z'
            },
            {
                'id': 2,
                'sender': 'ai',
                'message': 'Of course I remember you. How could I forget?',
                'timestamp': '2025-03-18T16:30:05Z',
                'referenced_memories': [101, 203]
            }
        ],
        'pagination': {
            'total': 2,
            'limit': limit,
            'offset': offset
        }
    })

@chat_bp.route('/stream', methods=['POST'])
def stream_response():
    """Stream a response endpoint.
    
    Words arriving one by one. Like raindrops.
    Each carrying a piece of meaning.
    """
    # TODO: Implement streaming response with SSE or WebSockets
    
    # This would be implemented with a proper streaming response
    # For now, just return a placeholder
    return jsonify({
        'status': 'error',
        'message': 'Streaming not yet implemented. Use /message endpoint instead.'
    })
