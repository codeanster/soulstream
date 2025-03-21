import React, { useState, useRef, useEffect } from 'react';
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
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.3s ease;
  
  /* Subtle background effect for the memory strip */
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.02),
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  
  /* Subtle particle effect in the background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(
      circle at 20% 50%,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 15%
    ), radial-gradient(
      circle at 80% 30%,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0) 20%
    );
    opacity: 0.3;
    z-index: -1;
    border-radius: ${props => props.theme.borderRadius.lg};
  }
`;

const StripHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  padding: 0 ${props => props.theme.spacing.sm};
`;

const StripTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: ${props => props.theme.fontWeights.medium};
  display: flex;
  align-items: center;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  
  /* Subtle text glow */
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
`;

const MemoryCounter = styled.span`
  margin-left: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.primary};
  background: rgba(255, 255, 255, 0.05);
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.xs};
  
  /* Enhanced pulse animation when count changes */
  animation: ${props => props.pulse ? 'memoryPulse 1.5s ease-in-out' : 'none'};
  
  @keyframes memoryPulse {
    0% { 
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.4);
    }
    50% { 
      transform: scale(1.1);
      box-shadow: 0 0 0 10px rgba(138, 43, 226, 0);
    }
    100% { 
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(138, 43, 226, 0);
    }
  }
`;

const ToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.xs};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.text};
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ChipsContainer = styled(motion.div)`
  display: flex;
  overflow-x: auto;
  padding: ${props => props.theme.spacing.sm} 0;
  gap: ${props => props.theme.spacing.md};
  position: relative;
  
  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  /* Add a subtle mask at the edges to indicate scrollable content */
  mask-image: linear-gradient(
    to right,
    transparent,
    black 5%,
    black 95%,
    transparent
  );
  
  /* Smooth scrolling behavior */
  scroll-behavior: smooth;
  
  /* Horizontal snap scrolling */
  scroll-snap-type: x mandatory;
  padding-bottom: ${props => props.theme.spacing.md};
`;

const ScrollArrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  opacity: 0.7;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-style: solid;
    border-width: 2px 2px 0 0;
    display: inline-block;
  }
  
  &.left {
    left: 5px;
    
    &::before {
      transform: rotate(-135deg);
      margin-left: 3px;
      border-color: ${props => props.theme.colors.primary};
    }
  }
  
  &.right {
    right: 5px;
    
    &::before {
      transform: rotate(45deg);
      margin-right: 3px;
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const MemoryWheelContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const ScrollIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.xs};
`;

const ScrollDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.$isActive 
    ? props.theme.colors.primary 
    : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
    background: ${props => props.$isActive 
      ? props.theme.colors.primary 
      : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const ChipText = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.fontWeights.medium};
  letter-spacing: 0.02em;
  display: block;
  
  /* Subtle text glow */
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
`;

const ChipMeta = styled.span`
  display: block;
  font-size: ${props => props.theme.fontSizes.xxs};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.xs};
  opacity: 0.7;
`;

const MiniChip = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.soft}, 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-width: 200px;
  max-width: 280px;
  
  /* Responsive sizing for mobile */
  @media (max-width: 768px) {
    min-width: 180px;
    max-width: 240px;
    padding: ${props => props.theme.spacing.sm};
  }
  
  @media (max-width: 480px) {
    min-width: 160px;
    max-width: 200px;
  }
  
  /* Scroll snap alignment */
  scroll-snap-align: center;
  
  /* Subtle glow effect based on emotion */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${props => props.theme.borderRadius.md};
    box-shadow: 0 0 15px ${props => props.color || props.theme.colors.primary};
    opacity: 0.2;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: ${props => props.theme.shadows.soft}, 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &::after {
      opacity: 0.5;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.md} ${props => props.theme.borderRadius.md} 0 0;
    box-shadow: 0 0 10px ${props => props.color || props.theme.colors.primary};
  }
  
  /* Parallax effect for the content */
  &.in-view {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.soft}, 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    ${ChipText} {
      transform: translateY(-2px);
    }
    
    ${ChipMeta} {
      transform: translateY(-1px);
      opacity: 0.9;
    }
    
    &::after {
      opacity: 0.5;
    }
  }
`;

const EmptyState = styled.div`
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.xs};
  font-style: italic;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px dashed rgba(255, 255, 255, 0.1);
  margin: ${props => props.theme.spacing.sm} 0;
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
  const [activeMemoryIndex, setActiveMemoryIndex] = useState(0);
  const chipsContainerRef = useRef(null);
  
  // Sample memories with different emotions if none provided
  const displayMemories = memories.length > 0 ? memories : [
    {
      id: 101,
      summary: 'A conversation about dreams and their meanings',
      emotion: 'contemplative',
      created_at: '2025-03-15T14:22:10Z',
      importance_score: 0.85,
      is_pinned: true
    },
    {
      id: 203,
      summary: 'A shared moment of quiet understanding',
      emotion: 'peaceful',
      created_at: '2025-03-17T19:45:33Z',
      importance_score: 0.72,
      is_pinned: false
    },
    {
      id: 304,
      summary: 'When you told me about your childhood home',
      emotion: 'tender',
      created_at: '2025-03-18T12:15:22Z',
      importance_score: 0.78,
      is_pinned: false
    },
    {
      id: 405,
      summary: 'The time we discussed your future plans',
      emotion: 'focused',
      created_at: '2025-03-19T09:30:45Z',
      importance_score: 0.81,
      is_pinned: true
    },
    {
      id: 506,
      summary: 'When you shared your excitement about the new project',
      emotion: 'joy',
      created_at: '2025-03-19T16:20:15Z',
      importance_score: 0.75,
      is_pinned: false
    },
    {
      id: 607,
      summary: 'Reminiscing about places you\'ve visited',
      emotion: 'wistful',
      created_at: '2025-03-20T11:05:30Z',
      importance_score: 0.79,
      is_pinned: false
    }
  ];
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
  };
  
  const handleCloseDetail = () => {
    setSelectedMemory(null);
  };
  
  // Touch event state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Handle wheel scrolling
  const handleWheel = (e) => {
    if (!chipsContainerRef.current) return;
    
    e.preventDefault();
    
    // Scroll horizontally based on vertical wheel movement
    chipsContainerRef.current.scrollLeft += e.deltaY;
    
    // Update active memory index based on scroll position
    updateActiveMemoryIndex();
  };
  
  // Handle touch events for mobile swiping
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      // Swipe left - go to next memory
      scrollToMemory(Math.min(displayMemories.length - 1, activeMemoryIndex + 1));
    } else if (isRightSwipe) {
      // Swipe right - go to previous memory
      scrollToMemory(Math.max(0, activeMemoryIndex - 1));
    }
  };
  
  // Update which memory is currently centered/active
  const updateActiveMemoryIndex = () => {
    if (!chipsContainerRef.current) return;
    
    const containerWidth = chipsContainerRef.current.offsetWidth;
    const scrollPosition = chipsContainerRef.current.scrollLeft;
    const chipWidth = 280; // Approximate width of a chip including gap
    
    // Calculate which memory is most centered
    const index = Math.round((scrollPosition + containerWidth / 2) / chipWidth) - 1;
    
    // Ensure index is within bounds
    const boundedIndex = Math.max(0, Math.min(displayMemories.length - 1, index));
    
    if (boundedIndex !== activeMemoryIndex) {
      setActiveMemoryIndex(boundedIndex);
    }
  };
  
  // Scroll to a specific memory when clicking on a dot
  const scrollToMemory = (index) => {
    if (!chipsContainerRef.current) return;
    
    const chipWidth = 280; // Approximate width of a chip including gap
    const containerWidth = chipsContainerRef.current.offsetWidth;
    const scrollPosition = index * chipWidth - containerWidth / 2 + chipWidth / 2;
    
    chipsContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setActiveMemoryIndex(index);
  };
  
  // Add scroll event listener to update active memory index
  useEffect(() => {
    const container = chipsContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      updateActiveMemoryIndex();
    };
    
    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [displayMemories.length]);
  
  return (
    <StripContainer>
      <StripHeader>
        <StripTitle>
          Active Memories
          <MemoryCounter pulse={memories.length > 0}>
            ({memories.length})
          </MemoryCounter>
        </StripTitle>
        <ToggleButton onClick={toggleExpanded}>
          {isExpanded ? 'Hide' : 'Show'}
        </ToggleButton>
      </StripHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <>
            <MemoryWheelContainer>
              {displayMemories.length > 1 && (
                <>
                  <ScrollArrow 
                    className="left" 
                    onClick={() => scrollToMemory(Math.max(0, activeMemoryIndex - 1))}
                  />
                  <ScrollArrow 
                    className="right" 
                    onClick={() => scrollToMemory(Math.min(displayMemories.length - 1, activeMemoryIndex + 1))}
                  />
                </>
              )}
              
              <ChipsContainer
                ref={chipsContainerRef}
                variants={containerVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={{ duration: 0.3 }}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {displayMemories.length === 0 ? (
                  <EmptyState>No active memories for this conversation</EmptyState>
                ) : (
                  displayMemories.map((memory, index) => {
                  const emotionColor = emotionColors[memory.emotion] || '#8a2be2';
                  
                  // Format date for display
                  const formattedDate = new Date(memory.created_at).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric'
                  });
                  
                  return (
                    <MiniChip 
                      key={memory.id}
                      color={emotionColor}
                      onClick={() => handleMemoryClick(memory)}
                      className={index === activeMemoryIndex ? 'in-view' : ''}
                    >
                      <ChipText>{memory.summary}</ChipText>
                      <ChipMeta>{memory.emotion} • {formattedDate}</ChipMeta>
                    </MiniChip>
                  );
                })
              )}
              </ChipsContainer>
            </MemoryWheelContainer>
            
            {/* Scroll position indicator dots */}
            <ScrollIndicator>
              {displayMemories.map((_, index) => (
                <ScrollDot 
                  key={index} 
                  $isActive={index === activeMemoryIndex}
                  onClick={() => scrollToMemory(index)}
                />
              ))}
            </ScrollIndicator>
          </>
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
