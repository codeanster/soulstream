import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import EmotionTooltip from './EmotionTooltip';

// Styled components
const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  padding: ${props => props.theme.spacing.xl} 0;
  overflow-x: auto;
  
  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const TimelineTrack = styled.div`
  position: relative;
  height: 2px;
  background: ${props => props.theme.colors.primary}50;
  margin: 0 ${props => props.theme.spacing.xl};
  min-width: max-content;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: ${props => props.theme.spacing.xl};
    height: 2px;
    background: ${props => props.theme.colors.primary}50;
  }
  
  &::before {
    left: -${props => props.theme.spacing.xl};
  }
  
  &::after {
    right: -${props => props.theme.spacing.xl};
  }
`;

const NodesContainer = styled.div`
  display: flex;
  position: relative;
`;

const NodeWrapper = styled.div`
  position: relative;
  padding: 0 ${props => props.theme.spacing.md};
  min-width: 200px;
  
  &:first-child {
    padding-left: 0;
  }
  
  &:last-child {
    padding-right: 0;
  }
`;

const NodeMarker = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  width: 20px;
  height: 20px;
  background: ${props => props.$isMilestone ? props.theme.colors.accent : props.color || props.theme.colors.primary};
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: ${props => props.theme.shadows.glow};
  z-index: 2;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateX(-50%) scale(1.2);
  }
`;

const ContentCard = styled(motion.div)`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.soft};
  margin-top: ${props => props.theme.spacing.xl};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${props => props.theme.colors.card};
  }
  
  h3 {
    font-family: ${props => props.theme.fonts.heading};
    margin-top: 0;
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.fontSizes.md};
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0;
    font-size: ${props => props.theme.fontSizes.sm};
    max-height: 100px;
    overflow-y: auto;
  }
`;

const DateDisplay = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.accent};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const EmotionTag = styled(motion.span)`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.color || props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
  margin-right: ${props => props.theme.spacing.xs};
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const MilestoneTag = styled(EmotionTag)`
  background: ${props => props.theme.colors.accent};
`;

const TooltipContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: ${props => props.theme.spacing.xs};
  z-index: 100;
  
  /* Ensure tooltip doesn't get cut off at screen edges */
  @media (max-width: 768px) {
    left: auto;
    right: 0;
    transform: none;
  }
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.colors.card};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.soft};
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: ${props => props.theme.colors.background};
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.prev {
    left: ${props => props.theme.spacing.sm};
  }
  
  &.next {
    right: ${props => props.theme.spacing.sm};
  }
`;

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Map emotion names to colors
const emotionColors = {
  joy: '#FFD166', // yellow
  sadness: '#118AB2', // blue
  anger: '#EF476F', // red
  fear: '#7209B7', // purple
  disgust: '#6A994E', // green
  surprise: '#FF9E00', // orange
  trust: '#4CC9F0', // light blue
  anticipation: '#F72585', // pink
  reflective: '#4A69BD', // indigo
  peaceful: '#88D8B0', // mint
  focused: '#8A2BE2', // violet
  curious: '#00B4D8', // cyan
  proud: '#FF6B6B', // coral
  excited: '#FF9E00', // amber
  grateful: '#06D6A0', // teal
  content: '#9381FF', // lavender
  amused: '#FFD166', // gold
  inspired: '#F72585', // magenta
  default: '#6C757D' // gray
};

/**
 * Get color for an emotion
 * @param {string} emotion - Emotion name
 * @returns {string} - Color hex code
 */
const getEmotionColor = (emotion) => {
  return emotionColors[emotion?.toLowerCase()] || emotionColors.default;
};

/**
 * HorizontalTimeline component
 * 
 * A horizontal layout for the timeline.
 * Days flowing from left to right, like a river of memories.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.entries - Timeline entries
 */
const HorizontalTimeline = ({ entries = [] }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const containerRef = useRef(null);
  
  // Enhanced scroll handling with momentum
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let animationFrame;
    
    const handleMouseDown = (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      cancelMomentumTracking();
    };
    
    const handleMouseLeave = () => {
      if (!isDown) return;
      isDown = false;
      container.classList.remove('active');
      beginMomentumTracking();
    };
    
    const handleMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      container.classList.remove('active');
      beginMomentumTracking();
    };
    
    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed
      const newScrollLeft = scrollLeft - walk;
      container.scrollLeft = newScrollLeft;
      velocity = scrollLeft - newScrollLeft;
    };
    
    // Momentum scrolling
    const beginMomentumTracking = () => {
      cancelMomentumTracking();
      animationFrame = requestAnimationFrame(momentumLoop);
    };
    
    const cancelMomentumTracking = () => {
      cancelAnimationFrame(animationFrame);
    };
    
    const momentumLoop = () => {
      if (Math.abs(velocity) > 0.5) {
        container.scrollLeft += velocity * 0.95; // Apply friction
        velocity *= 0.95; // Reduce velocity with friction
        animationFrame = requestAnimationFrame(momentumLoop);
      }
    };
    
    // Touch events for mobile
    const handleTouchStart = (e) => {
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      isDown = true;
      cancelMomentumTracking();
    };
    
    const handleTouchMove = (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      const newScrollLeft = scrollLeft - walk;
      container.scrollLeft = newScrollLeft;
      velocity = scrollLeft - newScrollLeft;
    };
    
    const handleTouchEnd = () => {
      isDown = false;
      beginMomentumTracking();
    };
    
    // Add event listeners
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      // Remove event listeners
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      
      cancelMomentumTracking();
    };
  }, []);
  
  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 300; // Adjust as needed
      const currentScroll = containerRef.current.scrollLeft;
      
      containerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  return (
    <TimelineContainer ref={containerRef}>
      <NavigationButton 
        className="prev" 
        onClick={() => handleScroll('left')}
        aria-label="Scroll timeline left"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        ←
      </NavigationButton>
      
      <TimelineTrack>
        <NodesContainer>
          {sortedEntries.map((entry, index) => {
            const emotionColor = getEmotionColor(entry.emotion);
            const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            
            return (
              <NodeWrapper key={entry.id || index}>
                <NodeMarker 
                  color={emotionColor}
                  $isMilestone={entry.milestone_flag}
                />
                
                <ContentCard
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.3,
                    type: 'spring',
                    stiffness: 300,
                    damping: 25
                  }}
                >
                  <DateDisplay>{formattedDate}</DateDisplay>
                  <h3>{entry.title}</h3>
                  <p>{entry.entry_summary}</p>
                  
                  <div style={{ marginTop: '10px' }}>
                    <EmotionTag 
                      color={emotionColor}
                      onMouseEnter={() => setActiveTooltip(entry.id)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onFocus={() => setActiveTooltip(entry.id)}
                      onBlur={() => setActiveTooltip(null)}
                      tabIndex={0}
                      aria-label={`${entry.emotion} emotion with intensity ${Math.round(entry.emotion_intensity * 100)}%`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {entry.emotion}
                    </EmotionTag>
                    
                    {entry.milestone_flag && (
                      <MilestoneTag whileHover={{ scale: 1.05 }}>milestone</MilestoneTag>
                    )}
                    
                    <AnimatePresence>
                      {activeTooltip === entry.id && (
                        <TooltipContainer>
                          <EmotionTooltip 
                            emotion={entry.emotion}
                            intensity={entry.emotion_intensity}
                            secondaryEmotions={entry.secondary_emotions}
                          />
                        </TooltipContainer>
                      )}
                    </AnimatePresence>
                  </div>
                </ContentCard>
              </NodeWrapper>
            );
          })}
        </NodesContainer>
      </TimelineTrack>
      
      <NavigationButton 
        className="next" 
        onClick={() => handleScroll('right')}
        aria-label="Scroll timeline right"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        →
      </NavigationButton>
    </TimelineContainer>
  );
};

export default HorizontalTimeline;
