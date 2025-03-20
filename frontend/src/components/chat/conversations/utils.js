/**
 * Utility functions for the conversations components
 * 
 * Time-based formatting and grouping.
 * The quiet mathematics of memory organization.
 */

/**
 * Format a date for display in conversation items
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time string (e.g., "2:30 PM")
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format a date for conversation title
 * 
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (e.g., "Mar 20")
 */
export const formatConversationTitle = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

/**
 * Group conversations by time categories
 * 
 * Organizes conversations into temporal buckets:
 * - Today
 * - Yesterday
 * - Last 7 Days
 * - Last 30 Days
 * - Older
 * 
 * @param {Array} conversations - List of conversation objects
 * @returns {Object} Grouped conversations
 */
export const groupConversationsByTime = (conversations) => {
  if (!conversations || conversations.length === 0) {
    return {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: []
    };
  }
  
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  // Initialize groups
  const groups = {
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    older: []
  };
  
  // Sort conversations by date (newest first)
  const sortedConversations = [...conversations].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  // Group conversations
  sortedConversations.forEach(conversation => {
    const conversationDate = new Date(conversation.timestamp);
    
    if (conversationDate.toDateString() === now.toDateString()) {
      groups.today.push(conversation);
    } else if (conversationDate.toDateString() === yesterday.toDateString()) {
      groups.yesterday.push(conversation);
    } else if (conversationDate > lastWeek) {
      groups.lastWeek.push(conversation);
    } else if (conversationDate > lastMonth) {
      groups.lastMonth.push(conversation);
    } else {
      groups.older.push(conversation);
    }
  });
  
  return groups;
};
