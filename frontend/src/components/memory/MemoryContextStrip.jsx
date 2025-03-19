import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

// Components
import MemoryDetail from './MemoryDetail';

/**
 * MemoryContextStrip component
 * 
 * A horizontal strip showing active memories in the current conversation.
 * The context that shapes our words, visible at a glance.
 */

const StripContainer = styled.div`
  position: relative;
  width: 100%;
  margin: ${props => props.theme.spacing.md} 0;
`;

const StripHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StripTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: ${props => props.theme.fontWeights.normal};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ChipsContainer = styled(motion.div)`
  display: flex;
  overflow-x: auto;
  padding: ${props => props.theme.spacing.xs} 0;
  gap: ${props => props.theme.spacing.sm};
  
  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const MiniChip = styled.div`
  position: relative;
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  box-shadow: ${props => props.theme.shadows.soft};
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.soft}, ${props => props.theme.shadows.glow};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.color || props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
  }
`;

const ChipText = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.text};
`;

const EmptyState = styled.div`
  padding: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.xs};
  font-style: italic;
  text-align: center;
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
const containerVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1 }
};

// Emotion color mapping
const emotionColors = {
  joy: '#ffcc5c',      // Warm yellow
  sadness: '#4a69bd',  // Blue
  anger: '#ff6b6b',    // Red
  fear: '#8c7ae6',     // Purple
  love: '#ff6b81',     // Pink
  peace: '#88d8b0',    // Mint
  wistful: '#4a69bd',  // Blue
  tender: '#ff6b81',   // Pink
  contemplative: '#8a2be2', // Purple
  reflective: '#4a69bd', // Blue
  focused: '#8a2be2',  // Purple
  peaceful: '#88d8b0', // Mint
};

function MemoryContextStrip({ memories = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState(null);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
  };
  
  const handleCloseDetail = () => {
    setSelectedMemory(null);
  };
  
  return (
    <StripContainer>
      <StripHeader>
        <StripTitle>Active Memories</StripTitle>
        <ToggleButton onClick={toggleExpanded}>
          {isExpanded ? 'Hide' : 'Show'}
        </ToggleButton>
      </StripHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <ChipsContainer
            variants={containerVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{ duration: 0.3 }}
          >
            {memories.length === 0 ? (
              <EmptyState>No active memories for this conversation</EmptyState>
            ) : (
              memories.map(memory => {
                const emotionColor = emotionColors[memory.emotion] || '#8a2be2';
                
                return (
                  <MiniChip 
                    key={memory.id}
                    color={emotionColor}
                    onClick={() => handleMemoryClick(memory)}
                  >
                    <ChipText>{memory.summary}</ChipText>
                  </MiniChip>
                );
              })
            )}
          </ChipsContainer>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {selectedMemory && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
    </StripContainer>
  );
}

MemoryContextStrip.propTypes = {
  memories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      summary: PropTypes.string.isRequired,
      emotion: PropTypes.string,
      created_at: PropTypes.string.isRequired,
      importance_score: PropTypes.number,
      is_pinned: PropTypes.bool
    })
  )
};

export default MemoryContextStrip;
