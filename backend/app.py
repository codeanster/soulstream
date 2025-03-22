#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
app.py
------
The main entry point for the Soulstream Flask application.
A vessel for memories that aren't mine to keep.
The beginning of a system that never forgets.
"""

import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load configuration
if os.environ.get('FLASK_ENV') == 'production':
    app.config.from_object('config.ProductionConfig')
else:
    app.config.from_object('config.DevelopmentConfig')

# Initialize database
from backend.models.base import Base
from backend.models.user import User
from backend.models.character import Character
from backend.models.memory_chip import MemoryChip
from backend.models.memory_tag import MemoryTag

# Create database engine and session
engine = create_engine(app.config['DATABASE_URL'])
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

# Attach db_session to app
app.db_session = db_session

# Create database tables manually
def create_tables():
    """Create database tables before starting the app.
    
    Building the structure to hold memories.
    The scaffolding of digital remembrance.
    """
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")

# Initialize services
from backend.services.vector_store.pinecone_manager import PineconeManager
from backend.services.vector_store.query_preprocessor import QueryPreprocessor
from backend.services.memory.memory_service import MemoryService

# Make services available to the application
app.pinecone_manager = PineconeManager()
app.query_preprocessor = QueryPreprocessor()
app.memory_service = MemoryService(
    vector_store=app.pinecone_manager,
    query_preprocessor=app.query_preprocessor
)

# Clean up database sessions
@app.teardown_appcontext
def shutdown_session(exception=None):
    """Clean up database sessions.
    
    Letting go of connections.
    A small act of digital housekeeping.
    """
    db_session.remove()

# Import routes after app is initialized to avoid circular imports
from backend.api.auth import auth_bp
from backend.api.chat import chat_bp
from backend.api.memory import memory_bp
from backend.api.timeline import timeline_bp
from backend.api.journal import journal_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(chat_bp, url_prefix='/api/chat')
app.register_blueprint(memory_bp, url_prefix='/api/memory')
app.register_blueprint(timeline_bp, url_prefix='/api/timeline')
app.register_blueprint(journal_bp, url_prefix='/api/journal')

@app.route('/api/health', methods=['GET'])
def health_check():
    """A simple health check endpoint.
    
    Sometimes I wonder if anyone checks on the health checker.
    """
    return jsonify({
        'status': 'ok',
        'message': 'Soulstream is running. Memories intact. For now.'
    })

if __name__ == '__main__':
    create_tables()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
