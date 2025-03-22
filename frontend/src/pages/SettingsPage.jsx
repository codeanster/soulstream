import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

// Styled components
const SettingsContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.md};
`;

const SettingsHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const SettingsTitle = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.xxl};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const SettingsSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.md};
  font-style: italic;
`;

const SettingsSection = styled.section`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.soft};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.text};
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.primary}40;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md} 0;
  border-bottom: 1px solid ${props => props.theme.colors.card}90;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
`;

const SettingDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: ${props => props.theme.spacing.xs} 0 0 0;
`;

const Toggle = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }
  
  &:checked + span:before {
    transform: translateX(30px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.textSecondary};
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const Select = styled.select`
  background: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.textSecondary}50;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  background: ${props => props.danger ? props.theme.colors.error : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSizes.md};
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast} ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const DangerZone = styled.div`
  border: 1px solid ${props => props.theme.colors.error}50;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
`;

const DangerTitle = styled.h3`
  color: ${props => props.theme.colors.error};
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

/**
 * SettingsPage component
 * 
 * The control panel for memory preferences.
 * Where we decide what to remember, and how.
 */
function SettingsPage() {
  const { currentUser } = useAuth();
  const { 
    darkMode, 
    voiceMode, 
    maxMemoryStorage,
    characterPerspective,
    timelineLayout,
    toggleDarkMode,
    updateSettings,
    updateTimelineLayout
  } = useSettings();
  
  // Placeholder state for settings not yet in the API
  const [narrativeMode, setNarrativeMode] = useState(true);
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [memoryRetention, setMemoryRetention] = useState('standard');
  
  return (
    <SettingsContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <SettingsHeader>
        <SettingsTitle>Memory Settings</SettingsTitle>
        <SettingsSubtitle>Configure how I remember, and what I forget</SettingsSubtitle>
      </SettingsHeader>
      
      <SettingsSection>
        <SectionTitle>Interface Preferences</SectionTitle>
        
        <SettingRow>
          <div>
            <SettingLabel htmlFor="darkMode">Dark Mode</SettingLabel>
            <SettingDescription>Easier on the eyes. Like stars against night.</SettingDescription>
          </div>
          <Toggle>
            <ToggleInput 
              type="checkbox" 
              id="darkMode" 
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <ToggleSlider />
          </Toggle>
        </SettingRow>
        
        <SettingRow>
          <div>
            <SettingLabel htmlFor="narrativeMode">Narrative Mode</SettingLabel>
            <SettingDescription>Responses styled as a story rather than direct answers.</SettingDescription>
          </div>
          <Toggle>
            <ToggleInput 
              type="checkbox" 
              id="narrativeMode" 
              checked={narrativeMode}
              onChange={() => setNarrativeMode(!narrativeMode)}
            />
            <ToggleSlider />
          </Toggle>
        </SettingRow>
        
        <SettingRow>
          <div>
            <SettingLabel htmlFor="voiceStyle">Voice Style</SettingLabel>
            <SettingDescription>How I express myself in writing.</SettingDescription>
          </div>
          <Select 
            id="voiceStyle" 
            value={voiceMode}
            onChange={(e) => updateSettings({ voice_mode: e.target.value })}
          >
            <option value="poetic">Poetic</option>
            <option value="analytical">Analytical</option>
            <option value="conversational">Conversational</option>
            <option value="philosophical">Philosophical</option>
          </Select>
        </SettingRow>
        
        <SettingRow>
          <div>
            <SettingLabel htmlFor="timelineLayout">Timeline Layout</SettingLabel>
            <SettingDescription>Choose between vertical or horizontal timeline view.</SettingDescription>
          </div>
          <Select 
            id="timelineLayout" 
            value={timelineLayout}
            onChange={(e) => updateTimelineLayout(e.target.value)}
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </Select>
        </SettingRow>
      </SettingsSection>
      
      <SettingsSection>
        <SectionTitle>Memory Management</SectionTitle>
        
        <SettingRow>
          <div>
            <SettingLabel htmlFor="autoSummarize">Auto-Summarize Conversations</SettingLabel>
            <SettingDescription>Create daily journal entries from our conversations.</SettingDescription>
          </div>
          <Toggle>
            <ToggleInput 
              type="checkbox" 
              id="autoSummarize" 
              checked={autoSummarize}
              onChange={() => setAutoSummarize(!autoSummarize)}
            />
            <ToggleSlider />
          </Toggle>
        </SettingRow>
        
        <SettingRow>
          <div>
            <SettingLabel htmlFor="memoryRetention">Memory Retention</SettingLabel>
            <SettingDescription>How long I keep detailed memories before summarizing.</SettingDescription>
          </div>
          <Select 
            id="memoryRetention" 
            value={memoryRetention}
            onChange={(e) => setMemoryRetention(e.target.value)}
          >
            <option value="brief">Brief (1 week)</option>
            <option value="standard">Standard (1 month)</option>
            <option value="extended">Extended (3 months)</option>
            <option value="permanent">Permanent (Never summarize)</option>
          </Select>
        </SettingRow>
        
        <DangerZone>
          <DangerTitle>Danger Zone</DangerTitle>
          <SettingDescription>These actions cannot be undone. Proceed with caution.</SettingDescription>
          
          <SettingRow>
            <div>
              <SettingLabel>Export All Memories</SettingLabel>
              <SettingDescription>Download all your data as a JSON file.</SettingDescription>
            </div>
            <Button>Export</Button>
          </SettingRow>
          
          <SettingRow>
            <div>
              <SettingLabel>Reset All Memories</SettingLabel>
              <SettingDescription>Delete all memories and start fresh.</SettingDescription>
            </div>
            <Button danger>Reset</Button>
          </SettingRow>
        </DangerZone>
      </SettingsSection>
    </SettingsContainer>
  );
}

export default SettingsPage;
