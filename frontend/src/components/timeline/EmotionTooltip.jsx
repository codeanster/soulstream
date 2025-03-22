import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled components
const TooltipContainer = styled(motion.div)`
  position: absolute;
  z-index: 10;
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: ${props => props.theme.spacing.md};
  width: 220px;
  pointer-events: none;
  transform-origin: center bottom;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${props => props.theme.colors.card};
  }
`;

const EmotionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const EmotionIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.color};
  margin-right: ${props => props.theme.spacing.sm};
`;

const EmotionName = styled.h4`
  margin: 0;
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.text};
`;

const IntensityContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const IntensityLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const IntensityBar = styled.div`
  height: 6px;
  width: 100%;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
  overflow: hidden;
`;

const IntensityFill = styled.div`
  height: 100%;
  width: ${props => `${props.value * 100}%`};
  background: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const SecondaryEmotionsContainer = styled.div`
  margin-top: ${props => props.theme.spacing.md};
`;

const SecondaryEmotionsLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SecondaryEmotionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
`;

const SecondaryEmotion = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => `${props.color}40`}; // 25% opacity
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
`;

const SecondaryEmotionDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color};
  margin-right: ${props => props.theme.spacing.xs};
`;

// Animation variants
const tooltipVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 }
};

/**
 * Map emotion names to colors
 * Each emotion has its own color palette
 */
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
 * EmotionTooltip component
 * 
 * A visual representation of emotional data.
 * Revealing the layers of feeling within a memory.
 * 
 * @param {Object} props - Component props
 * @param {string} props.emotion - Primary emotion
 * @param {number} props.intensity - Intensity of primary emotion (0-1)
 * @param {Array} props.secondaryEmotions - Array of secondary emotions with intensities
 * @param {Object} props.style - Additional styles
 */
const EmotionTooltip = ({ emotion, intensity = 0.5, secondaryEmotions = [], style }) => {
  const primaryColor = getEmotionColor(emotion);
  
  return (
    <TooltipContainer
      style={style}
      variants={tooltipVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
    >
      <EmotionHeader>
        <EmotionIcon color={primaryColor} />
        <EmotionName>{emotion}</EmotionName>
      </EmotionHeader>
      
      <IntensityContainer>
        <IntensityLabel>Intensity</IntensityLabel>
        <IntensityBar>
          <IntensityFill value={intensity} color={primaryColor} />
        </IntensityBar>
      </IntensityContainer>
      
      {secondaryEmotions && secondaryEmotions.length > 0 && (
        <SecondaryEmotionsContainer>
          <SecondaryEmotionsLabel>Secondary Emotions</SecondaryEmotionsLabel>
          <SecondaryEmotionsList>
            {secondaryEmotions.map((secondaryEmotion, index) => (
              <SecondaryEmotion 
                key={index}
                color={getEmotionColor(secondaryEmotion.name)}
              >
                <SecondaryEmotionDot color={getEmotionColor(secondaryEmotion.name)} />
                {secondaryEmotion.name}
                {secondaryEmotion.intensity && ` (${Math.round(secondaryEmotion.intensity * 100)}%)`}
              </SecondaryEmotion>
            ))}
          </SecondaryEmotionsList>
        </SecondaryEmotionsContainer>
      )}
    </TooltipContainer>
  );
};

export default EmotionTooltip;
