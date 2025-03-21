import { api } from './api';

export const memoryService = {
  fetchMemories: async (filters = {}) => {
    // Calls the backend /api/memory/chips endpoint
    console.log('Fetching memories with filters:', filters);
    try {
      const response = await api.get('/api/memory/chips', filters);
      console.log('Memory API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching memories:', error);
      throw error;
    }
  },
  searchMemories: async (query) => {
    // Calls the backend /api/memory/search endpoint
    return await api.get('/api/memory/search', { query });
  },
  pinMemory: async (memoryId) => {
    // Calls the backend /api/memory/pin endpoint
    return await api.post('/api/memory/pin', { memory_id: memoryId });
  },
  forgetMemory: async (memoryId) => {
    // Calls the backend /api/memory/forget endpoint
    return await api.post('/api/memory/forget', { memory_id: memoryId });
  }
};
