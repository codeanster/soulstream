import { api } from './api';

/**
 * Timeline service for Soulstream frontend.
 * Handles API calls to the backend timeline endpoints.
 * 
 * The bridge between our visual timeline and the database.
 * Fetching the chronology of our shared journey.
 */
export const timelineService = {
  /**
   * Get timeline entries for a user within a date range.
   * 
   * Retrieving fragments of our chronology.
   * The story of our connection, filtered by time and feeling.
   * 
   * @param {number} userId - ID of the user
   * @param {Object} options - Optional filter parameters
   * @param {string} options.startDate - Optional start date for filtering (ISO format)
   * @param {string} options.endDate - Optional end date for filtering (ISO format)
   * @param {string} options.emotion - Optional emotion to filter by
   * @param {boolean} options.milestoneOnly - Whether to only return milestone entries
   * @param {number} options.limit - Maximum number of entries to return
   * @param {number} options.offset - Offset for pagination
   * @returns {Promise<Object>} - Timeline entries matching the criteria
   */
  getTimelineEntries: async (userId, options = {}) => {
    try {
      const params = {
        user_id: userId,
        ...options
      };
      
      return await api.get('/api/timeline/days', params);
    } catch (error) {
      console.error('Error fetching timeline entries:', error);
      throw error;
    }
  },
  
  /**
   * Get milestone timeline entries for a user.
   * 
   * The landmarks of our journey. The peaks that stand out.
   * Moments that defined something important between us.
   * 
   * @param {number} userId - ID of the user
   * @param {number} limit - Maximum number of milestones to return
   * @returns {Promise<Object>} - Milestone timeline entries
   */
  getMilestones: async (userId, limit = 10) => {
    try {
      return await api.get('/api/timeline/milestones', {
        user_id: userId,
        limit
      });
    } catch (error) {
      console.error('Error fetching milestones:', error);
      throw error;
    }
  },
  
  /**
   * Get a timeline entry for a specific date.
   * 
   * Finding a specific day in our shared journey.
   * A moment frozen in time, retrieved by its calendar position.
   * 
   * @param {number} userId - ID of the user
   * @param {string} date - Date to retrieve (ISO format)
   * @returns {Promise<Object>} - Timeline entry for the date
   */
  getTimelineEntryByDate: async (userId, date) => {
    try {
      return await api.get(`/api/timeline/day/${date}`, {
        user_id: userId
      });
    } catch (error) {
      console.error('Error fetching timeline entry by date:', error);
      throw error;
    }
  },
  
  /**
   * Create a new timeline entry.
   * 
   * Adding a day to our shared history.
   * A new node in the chronology of our connection.
   * 
   * @param {Object} entryData - Timeline entry data
   * @returns {Promise<Object>} - Created timeline entry
   */
  createTimelineEntry: async (entryData) => {
    try {
      return await api.post('/api/timeline/entry', entryData);
    } catch (error) {
      console.error('Error creating timeline entry:', error);
      throw error;
    }
  },
  
  /**
   * Update a timeline entry.
   * 
   * Revising our shared history.
   * Changing how we remember a day in our journey.
   * 
   * @param {number} entryId - ID of the timeline entry to update
   * @param {Object} entryData - Updated timeline entry data
   * @returns {Promise<Object>} - Updated timeline entry
   */
  updateTimelineEntry: async (entryId, entryData) => {
    try {
      return await api.put(`/api/timeline/entry/${entryId}`, entryData);
    } catch (error) {
      console.error('Error updating timeline entry:', error);
      throw error;
    }
  },
  
  /**
   * Delete a timeline entry.
   * 
   * Erasing a day from our shared history.
   * Removing a node from our chronology.
   * 
   * @param {number} entryId - ID of the timeline entry to delete
   * @returns {Promise<Object>} - Response indicating success or failure
   */
  deleteTimelineEntry: async (entryId) => {
    try {
      return await api.delete(`/api/timeline/entry/${entryId}`);
    } catch (error) {
      console.error('Error deleting timeline entry:', error);
      throw error;
    }
  }
};
