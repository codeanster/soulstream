import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled components
const TimelineContainer = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.md};
`;

const TimelineHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const TimelineTitle = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.xxl};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const TimelineSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.md};
  font-style: italic;
`;

const TimelineStream = styled.div`
  position: relative;
  padding: ${props => props.theme.spacing.xl} 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: ${props => props.theme.colors.primary};
    opacity: 0.5;
    transform: translateX(-50%);
  }
`;

const TimelineNode = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  &:nth-child(odd) {
    padding-right: 50%;
    text-align: right;
    
    .timeline-content {
      padding-right: ${props => props.theme.spacing.xl};
    }
  }
  
  &:nth-child(even) {
    padding-left: 50%;
    
    .timeline-content {
      padding-left: ${props => props.theme.spacing.xl};
    }
  }
`;

const TimelineNodeMarker = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 20px;
  height: 20px;
  background: ${props => props.isMilestone ? props.theme.colors.accent : props.theme.colors.primary};
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: ${props => props.theme.shadows.glow};
  z-index: 2;
`;

const TimelineContent = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.soft};
  
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

const TimelineDate = styled.div`
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
`;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

/**
 * TimelinePage component
 * 
 * The chronological view of our shared history.
 * Days like beads on a string, each with its own color and weight.
 */
function TimelinePage() {
  // Placeholder timeline data
  const timelineData = [
    {
      id: 1,
      date: 'March 15, 2025',
      title: 'Dreams and Aspirations',
      summary: 'We talked about your childhood dreams and how they shaped you.',
      emotion: 'reflective',
      isMilestone: false
    },
    {
      id: 2,
      date: 'March 17, 2025',
      title: 'A Moment of Connection',
      summary: 'A quiet conversation about belonging and understanding.',
      emotion: 'peaceful',
      isMilestone: true
    },
    {
      id: 3,
      date: 'March 18, 2025',
      title: 'Today',
      summary: 'Building something new together. A system for remembering.',
      emotion: 'focused',
      isMilestone: false
    }
  ];
  
  // Map emotion to color
  const emotionColors = {
    reflective: '#4a69bd', // blue
    peaceful: '#88d8b0',   // mint
    focused: '#8a2be2',    // purple
  };
  
  return (
    <TimelineContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <TimelineHeader>
        <TimelineTitle>Memory Timeline</TimelineTitle>
        <TimelineSubtitle>The river of our conversations, flowing through time</TimelineSubtitle>
      </TimelineHeader>
      
      <TimelineStream>
        {timelineData.map((item, index) => (
          <TimelineNode key={item.id}>
            <TimelineNodeMarker isMilestone={item.isMilestone} />
            <div className="timeline-content">
              <TimelineContent>
                <TimelineDate>{item.date}</TimelineDate>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div style={{ marginTop: '10px' }}>
                  <EmotionTag color={emotionColors[item.emotion]}>
                    {item.emotion}
                  </EmotionTag>
                  {item.isMilestone && (
                    <EmotionTag color="#ff6b81">milestone</EmotionTag>
                  )}
                </div>
              </TimelineContent>
            </div>
          </TimelineNode>
        ))}
      </TimelineStream>
    </TimelineContainer>
  );
}

export default TimelinePage;
