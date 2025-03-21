import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const api = {
  get: async (endpoint, params = {}) => {
    try {
      console.log(`Making GET request to ${API_BASE_URL}${endpoint} with params:`, params);
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
      console.log(`Response from ${endpoint}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API error on GET ${endpoint}:`, error.response || error);
      throw error;
    }
  },
  post: async (endpoint, data = {}) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Chat API functions
export const chatApi = {
  // Get conversation history
  getConversations: async (userId, limit = 20, offset = 0) => {
    try {
      return await api.get('/api/chat/conversations', { 
        user_id: userId, 
        limit, 
        offset 
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },
  
  // Get messages for a specific conversation
  getConversationHistory: async (conversationId, userId, limit = 50, offset = 0) => {
    try {
      return await api.get('/api/chat/history', { 
        conversation_id: conversationId,
        user_id: userId,
        limit, 
        offset 
      });
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  },
  
  // Send a message
  sendMessage: async (message, userId, characterId, conversationId = null) => {
    try {
      return await api.post('/api/chat/message', {
        message,
        user_id: userId,
        character_id: characterId,
        conversation_id: conversationId
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};
