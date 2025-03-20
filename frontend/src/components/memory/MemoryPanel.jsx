import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMemory } from '../../contexts/MemoryContext';

// Components
import MemoryChip from './MemoryChip';
import MemoryDetail from './MemoryDetail';

/**
 * MemoryPanel component
 * 
 * The grid of memory fragments.
 * A constellation of moments, each with its own gravity.
 */

const PanelContainer = styled(motion.div)`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const PanelTitle = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const FilterSelect = styled.select`
  background: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.textSecondary}50;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchInput = styled.input`
  background: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.textSecondary}50;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const MemoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.md};
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  margin: 0;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${props => props.theme.zIndex.modal};
  padding: ${props => props.theme.spacing.md};
`;

// Animation variants
const panelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

function MemoryPanel({ title = "Memory Fragments" }) {
  const { memories, loading, error, fetchMemories } = useMemory();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [emotionFilter, setEmotionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMemories, setFilteredMemories] = useState([]);
  
  // Fetch memories on component mount
  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);
  
  // Apply filters when memories, emotion filter, or search query changes
  useEffect(() => {
    console.log('Memories in MemoryPanel:', memories);
    
    if (!memories || !Array.isArray(memories)) {
      console.warn('No memories array available or memories is not an array');
      setFilteredMemories([]);
      return;
    }
    
    let filtered = [...memories];
    
    // Apply emotion filter
    if (emotionFilter) {
      filtered = filtered.filter(memory => 
        memory && memory.emotion === emotionFilter
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(memory => 
        memory && (
          (memory.summary && memory.summary.toLowerCase().includes(query)) || 
          (memory.topic && memory.topic.toLowerCase().includes(query))
        )
      );
    }
    
    console.log('Filtered memories:', filtered);
    setFilteredMemories(filtered);
  }, [memories, emotionFilter, searchQuery]);
  
  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
  };
  
  const handleCloseDetail = () => {
    setSelectedMemory(null);
  };
  
  // Get unique emotions for filter dropdown
  const uniqueEmotions = memories && Array.isArray(memories)
    ? [...new Set(memories
        .filter(memory => memory && memory.emotion)
        .map(memory => memory.emotion))]
    : [];
  
  console.log('Unique emotions:', uniqueEmotions);
  
  return (
    <PanelContainer
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <PanelHeader>
        <PanelTitle>{title}</PanelTitle>
        
        <FilterContainer>
          <SearchInput 
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <FilterSelect 
            value={emotionFilter}
            onChange={(e) => setEmotionFilter(e.target.value)}
          >
            <option value="">All emotions</option>
            {uniqueEmotions.map(emotion => (
              <option key={emotion} value={emotion}>
                {emotion}
              </option>
            ))}
          </FilterSelect>
        </FilterContainer>
      </PanelHeader>
      
      {loading && (
        <LoadingIndicator>
          Loading memories...
        </LoadingIndicator>
      )}
      
      {error && (
        <EmptyState>
          <EmptyStateIcon>⚠️</EmptyStateIcon>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyState>
      )}
      
      {!loading && !error && filteredMemories.length === 0 && (
        <EmptyState>
          <EmptyStateIcon>💭</EmptyStateIcon>
          <EmptyStateText>
            {memories.length === 0 
              ? "No memories found. Start a conversation to create some."
              : "No memories match your filters."}
          </EmptyStateText>
        </EmptyState>
      )}
      
      {!loading && !error && filteredMemories.length > 0 && (
        <MemoryGrid>
          {filteredMemories.map((memory, index) => (
            <MemoryChip 
              key={memory.id}
              memory={memory}
              onClick={handleMemoryClick}
              delay={index}
            />
          ))}
        </MemoryGrid>
      )}
      
      <AnimatePresence>
        {selectedMemory && (
          <ModalOverlay
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleCloseDetail}
          >
            <div onClick={e => e.stopPropagation()}>
              <MemoryDetail 
                memory={selectedMemory}
                onClose={handleCloseDetail}
              />
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PanelContainer>
  );
}

MemoryPanel.propTypes = {
  title: PropTypes.string
};

export default MemoryPanel;
