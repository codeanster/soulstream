import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * MemoryChip component
 * 
 * A fragment of remembered experience.
 * Small enough to hold, but containing worlds.
 */

const ChipContainer = styled(motion.div)`
  position: relative;
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.soft};
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.soft}, ${props => props.theme.shadows.glow};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.emotionColor || props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  }
  
  ${props => props.isPinned && `
    &::after {
      content: '📌';
      position: absolute;
      top: ${props.theme.spacing.xs};
      right: ${props.theme.spacing.xs};
      font-size: ${props.theme.fontSizes.sm};
    }
  `}
`;

const ChipSummary = styled.h3`
  font-size: ${props => props.theme.fontSizes.md};
  margin: ${props => props.theme.spacing.sm} 0;
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const ChipMetadata = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing.sm};
`;

const ChipDate = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
`;

const EmotionTag = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.color || props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
`;

const ImportanceIndicator = styled.div`
  position: absolute;
  bottom: ${props => props.theme.spacing.xs};
  right: ${props => props.theme.spacing.xs};
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    const score = props.score || 0;
    if (score > 0.7) return props.theme.colors.accent;
    if (score > 0.4) return props.theme.colors.info;
    return props.theme.colors.textSecondary;
  }};
  opacity: 0.8;
`;

// Animation variants
const chipVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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

function MemoryChip({ 
  memory, 
  onClick,
  delay = 0
}) {
  const emotionColor = emotionColors[memory.emotion] || '#8a2be2';
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <ChipContainer 
      emotionColor={emotionColor}
      isPinned={memory.is_pinned}
      onClick={() => onClick(memory)}
      variants={chipVariants}
      initial="hidden"
      animate="visible"
      transition={{ 
        duration: 0.4,
        delay: delay * 0.1
      }}
    >
      <ChipSummary>{memory.summary}</ChipSummary>
      <ChipMetadata>
        <ChipDate>{formatDate(memory.created_at)}</ChipDate>
        <EmotionTag color={emotionColor}>
          {memory.emotion}
        </EmotionTag>
      </ChipMetadata>
      <ImportanceIndicator score={memory.importance_score} />
    </ChipContainer>
  );
}

MemoryChip.propTypes = {
  memory: PropTypes.shape({
    id: PropTypes.number.isRequired,
    summary: PropTypes.string.isRequired,
    emotion: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    importance_score: PropTypes.number,
    is_pinned: PropTypes.bool
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  delay: PropTypes.number
};

export default MemoryChip;
