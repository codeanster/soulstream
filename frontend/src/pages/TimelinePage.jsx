import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TimelineNode from '../components/timeline/TimelineNode';
import HorizontalTimeline from '../components/timeline/HorizontalTimeline';
import { timelineService } from '../services/timelineService';

// Styled components
const TimelineContainer = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.md};
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.soft};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const FilterSelect = styled.select`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.textSecondary}50;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${props => props.theme.spacing.xs};
`;

const CheckboxInput = styled.input`
  margin-right: ${props => props.theme.spacing.xs};
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const FilterButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  align-self: flex-end;
  margin-top: auto;
  
  &:hover {
    background: ${props => props.theme.colors.primary}dd;
  }
`;

const ResetButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.textSecondary}50;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  align-self: flex-end;
  margin-top: auto;
  
  &:hover {
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.text};
  }
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

// These components are no longer used since we're using the TimelineNode component
// Keeping them commented out for reference in case we need to revert
/*
const TimelineNodeWrapper = styled.div`
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
*/

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
  // State
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emotionFilter, setEmotionFilter] = useState('');
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [isHorizontalLayout, setIsHorizontalLayout] = useState(false);
  const [userId, setUserId] = useState(1); // Default to user 1 for testing
  
  // Fetch timeline data
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        const response = await timelineService.getTimelineEntries(userId);
        if (response.status === 'success') {
          setTimelineData(response.days);
        } else {
          setError('Failed to fetch timeline data');
        }
      } catch (err) {
        console.error('Error fetching timeline data:', err);
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimelineData();
  }, [userId]);
  
  // Extract available emotions from the data for filter
  const emotions = useMemo(() => {
    const uniqueEmotions = new Set();
    timelineData.forEach(entry => {
      if (entry.emotion) {
        uniqueEmotions.add(entry.emotion.toLowerCase());
      }
    });
    
    const emotionOptions = [{ value: '', label: 'All emotions' }];
    Array.from(uniqueEmotions).sort().forEach(emotion => {
      emotionOptions.push({
        value: emotion,
        label: emotion.charAt(0).toUpperCase() + emotion.slice(1)
      });
    });
    
    return emotionOptions;
  }, [timelineData]);
  
  // Date range options
  const dateRanges = [
    { value: 'all', label: 'All time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' }
  ];
  
  // Apply filters
  useEffect(() => {
    if (!timelineData.length) return;
    
    let filtered = [...timelineData];
    
    // Apply emotion filter
    if (emotionFilter) {
      filtered = filtered.filter(item => 
        item.emotion && item.emotion.toLowerCase() === emotionFilter.toLowerCase()
      );
    }
    
    // Apply milestone filter
    if (showMilestonesOnly) {
      filtered = filtered.filter(item => item.milestone_flag);
    }
    
    // Apply date range filter
    if (dateRange !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateRange === 'today') {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.toDateString() === today.toDateString();
        });
      } else if (dateRange === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= weekAgo;
        });
      } else if (dateRange === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= monthAgo;
        });
      }
    }
    
    setFilteredData(filtered);
  }, [timelineData, emotionFilter, showMilestonesOnly, dateRange]);
  
  // Reset all filters
  const handleResetFilters = () => {
    setEmotionFilter('');
    setShowMilestonesOnly(false);
    setDateRange('all');
  };
  
  // Toggle layout
  const toggleLayout = () => {
    setIsHorizontalLayout(!isHorizontalLayout);
  };
  
  if (loading) {
    return (
      <TimelineContainer>
        <TimelineHeader>
          <TimelineTitle>Memory Timeline</TimelineTitle>
          <TimelineSubtitle>Loading your memories...</TimelineSubtitle>
        </TimelineHeader>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Retrieving your timeline data...</p>
        </div>
      </TimelineContainer>
    );
  }
  
  if (error) {
    return (
      <TimelineContainer>
        <TimelineHeader>
          <TimelineTitle>Memory Timeline</TimelineTitle>
          <TimelineSubtitle>Something went wrong</TimelineSubtitle>
        </TimelineHeader>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </TimelineContainer>
    );
  }
  
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
      
      <FilterBar>
        <FilterGroup>
          <FilterLabel htmlFor="emotion-filter">Emotion</FilterLabel>
          <FilterSelect 
            id="emotion-filter"
            value={emotionFilter}
            onChange={(e) => setEmotionFilter(e.target.value)}
          >
            {emotions.map(emotion => (
              <option key={emotion.value} value={emotion.value}>
                {emotion.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel htmlFor="date-range">Time Period</FilterLabel>
          <FilterSelect 
            id="date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            {dateRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Options</FilterLabel>
          <FilterCheckbox>
            <CheckboxInput 
              type="checkbox" 
              id="milestones-only" 
              checked={showMilestonesOnly}
              onChange={() => setShowMilestonesOnly(!showMilestonesOnly)}
            />
            <CheckboxLabel htmlFor="milestones-only">
              Milestones only
            </CheckboxLabel>
          </FilterCheckbox>
          
          <FilterCheckbox>
            <CheckboxInput 
              type="checkbox" 
              id="horizontal-layout" 
              checked={isHorizontalLayout}
              onChange={toggleLayout}
            />
            <CheckboxLabel htmlFor="horizontal-layout">
              Horizontal layout
            </CheckboxLabel>
          </FilterCheckbox>
        </FilterGroup>
        
        <ResetButton onClick={handleResetFilters}>
          Reset Filters
        </ResetButton>
      </FilterBar>
      
      {isHorizontalLayout ? (
        <HorizontalTimeline entries={filteredData.length > 0 ? filteredData : timelineData} />
      ) : (
        <TimelineStream>
          {(filteredData.length > 0 ? filteredData : timelineData).map((entry) => (
            <TimelineNode 
              key={entry.id} 
              entry={entry}
            />
          ))}
        </TimelineStream>
      )}
    </TimelineContainer>
  );
}

export default TimelinePage;
