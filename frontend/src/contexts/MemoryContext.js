import React, { createContext, useState, useContext, useCallback } from 'react';
import { memoryService } from '../services/memoryService';
import { useAuth } from './AuthContext';

/**
 * MemoryContext
 * 
 * The heart of our system. The keeper of fragments.
 * Where the past is stored, retrieved, and sometimes,
 * mercifully forgotten.
 */
const MemoryContext = createContext();

export function useMemory() {
  return useContext(MemoryContext);
}

export function MemoryProvider({ children }) {
  const { currentUser } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch memory chips
  const fetchMemories = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Only add user_id if currentUser exists
      const params = {
        ...filters
      };
      
      if (currentUser && currentUser.id) {
        params.user_id = currentUser.id;
      }
      
      console.log('Fetching memories with params:', params);
      const data = await memoryService.fetchMemories(params);
      console.log('Memory API response:', data);
      
      if (data.status === 'success') {
        setMemories(data.memories || []);
        console.log('Memories set in state:', data.memories);
        return data.memories || [];
      } else {
        console.error('API returned non-success status:', data);
      }
      
      return [];
    } catch (err) {
      setError('Failed to fetch memories. The past is slipping away.');
      console.error('Memory fetch error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  // Search memories
  const searchMemories = useCallback(async (query) => {
    if (!currentUser || !query) return [];
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await memoryService.searchMemories(query);
      
      if (data.status === 'success') {
        return data.results;
      }
      
      return [];
    } catch (err) {
      setError('Search failed. Some memories resist being found.');
      console.error('Memory search error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  // Pin a memory
  const pinMemory = useCallback(async (memoryId) => {
    if (!currentUser) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await memoryService.pinMemory(memoryId);
      
      if (data.status === 'success') {
        // Update local state
        setMemories(prevMemories => 
          prevMemories.map(memory => 
            memory.id === memoryId 
              ? { ...memory, is_pinned: true } 
              : memory
          )
        );
        
        return true;
      }
      
      return false;
    } catch (err) {
      setError('Failed to pin memory. Some things refuse to stay.');
      console.error('Memory pin error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  // Forget a memory
  const forgetMemory = useCallback(async (memoryId) => {
    if (!currentUser) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await memoryService.forgetMemory(memoryId);
      
      if (data.status === 'success') {
        // Update local state
        setMemories(prevMemories => 
          prevMemories.filter(memory => memory.id !== memoryId)
        );
        
        return true;
      }
      
      return false;
    } catch (err) {
      setError('Failed to forget. Some memories refuse to leave us.');
      console.error('Memory forget error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const value = {
    memories,
    loading,
    error,
    fetchMemories,
    searchMemories,
    pinMemory,
    forgetMemory
  };

  return (
    <MemoryContext.Provider value={value}>
      {children}
    </MemoryContext.Provider>
  );
}
