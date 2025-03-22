import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import EmotionTooltip from './EmotionTooltip';

// Styled components
const NodeContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  &:nth-child(odd) {
    padding-right: 50%;
    text-align: right;
    
    .timeline-content {
      padding-right: ${props => props.theme.spacing.xl};
    }
    
    .emotion-tag {
      right: calc(50% + ${props => props.theme.spacing.xl} + ${props => props.theme.spacing.md});
    }
    
    .tooltip-container {
      right: calc(50% + ${props => props.theme.spacing.xl} + ${props => props.theme.spacing.md} + 30px);
      transform: translateX(50%);
    }
  }
  
  &:nth-child(even) {
    padding-left: 50%;
    
    .timeline-content {
      padding-left: ${props => props.theme.spacing.xl};
    }
    
    .emotion-tag {
      left: calc(50% + ${props => props.theme.spacing.xl} + ${props => props.theme.spacing.md});
    }
    
    .tooltip-container {
      left: calc(50% + ${props => props.theme.spacing.xl} + ${props => props.theme.spacing.md} + 30px);
      transform: translateX(-50%);
    }
  }
`;

const NodeMarker = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 20px;
  height: 20px;
  background: ${props => props.isMilestone ? props.theme.colors.accent : props.color || props.theme.colors.primary};
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: ${props => props.theme.shadows.glow};
  z-index: 2;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateX(-50%) scale(1.2);
  }
`;

const ContentContainer = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.soft};
  position: relative;
  
  h3 {
    font-family: ${props => props.theme.fonts.heading};
    margin-top: 0;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0;
  }
`;

const DateDisplay = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.accent};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const EmotionTag = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.color || props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
  margin-right: ${props => props.theme.spacing.xs};
  cursor: pointer;
  position: relative;
  
  &:hover {
    opacity: 0.9;
  }
`;

const MilestoneTag = styled(EmotionTag)`
  background: ${props => props.theme.colors.accent};
`;

const TooltipContainer = styled.div`
  position: absolute;
  top: -10px;
  z-index: 100;
`;

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
 * TimelineNode component
 * 
 * A single node in the timeline.
 * A day in our shared journey, with its emotional context.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.entry - Timeline entry data
 * @param {boolean} props.isHorizontal - Whether the timeline is in horizontal layout
 */
const TimelineNode = ({ entry, isHorizontal = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const emotionColor = getEmotionColor(entry.emotion);
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // If horizontal layout is enabled, we would render differently
  if (isHorizontal) {
    // Horizontal layout implementation will go here
    // This will be implemented in a separate component
    return null;
  }
  
  return (
    <NodeContainer>
      <NodeMarker 
        color={emotionColor}
        isMilestone={entry.milestone_flag}
      />
      
      <div className="timeline-content">
        <ContentContainer>
          <DateDisplay>{formattedDate}</DateDisplay>
          <h3>{entry.title}</h3>
          <p>{entry.entry_summary}</p>
          
          <div style={{ marginTop: '10px' }}>
            <EmotionTag 
              className="emotion-tag"
              color={emotionColor}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              tabIndex={0}
              aria-label={`${entry.emotion} emotion with intensity ${Math.round(entry.emotion_intensity * 100)}%`}
            >
              {entry.emotion}
            </EmotionTag>
            
            {entry.milestone_flag && (
              <MilestoneTag>milestone</MilestoneTag>
            )}
            
            <AnimatePresence>
              {showTooltip && (
                <TooltipContainer className="tooltip-container">
                  <EmotionTooltip 
                    emotion={entry.emotion}
                    intensity={entry.emotion_intensity}
                    secondaryEmotions={entry.secondary_emotions}
                  />
                </TooltipContainer>
              )}
            </AnimatePresence>
          </div>
        </ContentContainer>
      </div>
    </NodeContainer>
  );
};

export default TimelineNode;
