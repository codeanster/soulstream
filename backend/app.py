#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
app.py
------
The main entry point for the Soulstream Flask application.
A vessel for memories that aren't mine to keep.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load configuration
if os.environ.get('FLASK_ENV') == 'production':
    app.config.from_object('config.ProductionConfig')
else:
    app.config.from_object('config.DevelopmentConfig')

# Import routes after app is initialized to avoid circular imports
from api.auth import auth_bp
from api.chat import chat_bp
from api.memory import memory_bp
from api.timeline import timeline_bp
from api.journal import journal_bp

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
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
