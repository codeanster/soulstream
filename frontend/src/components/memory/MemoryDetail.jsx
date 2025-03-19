import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMemory } from '../../contexts/MemoryContext';

/**
 * MemoryDetail component
 * 
 * A closer look at a single memory.
 * The details that make a moment worth preserving.
 */

const DetailContainer = styled(motion.div)`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.soft};
  position: relative;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${props => props.emotionColor || props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.md};
  right: ${props => props.theme.spacing.md};
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.xl};
  cursor: pointer;
  z-index: 2;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const DetailHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DetailTitle = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.text};
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const DetailDate = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const DetailContent = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SourceText = styled.div`
  font-family: ${props => props.theme.fonts.body};
  font-size: ${props => props.theme.fontSizes.md};
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
  white-space: pre-line;
`;

const MetadataSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const MetadataLabel = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const MetadataValue = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.fontWeights.semibold};
`;

const EmotionTag = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.color || props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
  margin-right: ${props => props.theme.spacing.xs};
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};
`;

const ActionButton = styled.button`
  background: ${props => props.danger 
    ? props.theme.colors.error 
    : props.primary 
      ? props.theme.colors.primary 
      : 'transparent'
  };
  color: ${props => props.primary || props.danger 
    ? 'white' 
    : props.theme.colors.text
  };
  border: ${props => props.primary || props.danger 
    ? 'none' 
    : `1px solid ${props.theme.colors.textSecondary}`
  };
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.danger 
      ? props.theme.colors.error + 'dd'
      : props.primary 
        ? props.theme.colors.primary + 'dd' 
        : props.theme.colors.background
    };
  }
`;

// Animation variants
const detailVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
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

function MemoryDetail({ memory, onClose }) {
  const { pinMemory, forgetMemory } = useMemory();
  const emotionColor = emotionColors[memory.emotion] || '#8a2be2';
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handlePin = async () => {
    await pinMemory(memory.id);
  };
  
  const handleForget = async () => {
    if (window.confirm('Are you sure you want to forget this memory? This action cannot be undone.')) {
      await forgetMemory(memory.id);
      onClose();
    }
  };
  
  return (
    <DetailContainer
      emotionColor={emotionColor}
      variants={detailVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <CloseButton onClick={onClose}>×</CloseButton>
      
      <DetailHeader>
        <DetailTitle>{memory.summary}</DetailTitle>
        <DetailDate>{formatDate(memory.created_at)}</DetailDate>
        <EmotionTag color={emotionColor}>
          {memory.emotion}
        </EmotionTag>
        {memory.topic && (
          <EmotionTag color="#4a69bd">
            {memory.topic}
          </EmotionTag>
        )}
      </DetailHeader>
      
      <DetailContent>
        <MetadataLabel>Original Conversation</MetadataLabel>
        <SourceText>
          {memory.source_text || "This memory doesn't have associated conversation text."}
        </SourceText>
      </DetailContent>
      
      <MetadataSection>
        <MetadataItem>
          <MetadataLabel>Importance</MetadataLabel>
          <MetadataValue>
            {memory.importance_score 
              ? `${Math.round(memory.importance_score * 100)}%` 
              : 'Unknown'}
          </MetadataValue>
        </MetadataItem>
        
        <MetadataItem>
          <MetadataLabel>Last Referenced</MetadataLabel>
          <MetadataValue>
            {memory.last_referenced_at 
              ? formatDate(memory.last_referenced_at) 
              : 'Never'}
          </MetadataValue>
        </MetadataItem>
        
        <MetadataItem>
          <MetadataLabel>Status</MetadataLabel>
          <MetadataValue>
            {memory.is_pinned ? '📌 Pinned' : 'Standard'}
          </MetadataValue>
        </MetadataItem>
      </MetadataSection>
      
      <ActionButtons>
        {!memory.is_pinned && (
          <ActionButton onClick={handlePin} primary>
            Pin Memory
          </ActionButton>
        )}
        {memory.is_pinned && (
          <ActionButton onClick={handlePin}>
            Unpin Memory
          </ActionButton>
        )}
        <ActionButton onClick={handleForget} danger>
          Forget Memory
        </ActionButton>
      </ActionButtons>
    </DetailContainer>
  );
}

MemoryDetail.propTypes = {
  memory: PropTypes.shape({
    id: PropTypes.number.isRequired,
    summary: PropTypes.string.isRequired,
    source_text: PropTypes.string,
    emotion: PropTypes.string,
    topic: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    last_referenced_at: PropTypes.string,
    importance_score: PropTypes.number,
    is_pinned: PropTypes.bool
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default MemoryDetail;
