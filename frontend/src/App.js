import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// Theme
import { theme } from './styles/theme';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { MemoryProvider } from './contexts/MemoryContext';
import { ThemeContext } from './contexts/ThemeContext';

// Pages
import ChatPage from './pages/ChatPage';
import TimelinePage from './pages/TimelinePage';
import JournalPage from './pages/JournalPage';
import SettingsPage from './pages/SettingsPage';

// Components
import Navigation from './components/layout/Navigation';

// Styled components
const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
`;

const ContentContainer = styled.main`
  padding: 1rem;
  margin-top: 60px; // Account for fixed navigation
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem;
  }
`;

/**
 * Main App component
 * 
 * The vessel that holds all our fragments.
 * A container for memories, waiting to be filled.
 */
function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  
  // Toggle dark/light mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Apply theme to body
  useEffect(() => {
    document.body.style.backgroundColor = darkMode 
      ? theme.colors.background 
      : theme.colors.backgroundLight;
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
        <AuthProvider>
          <MemoryProvider>
            <AppContainer>
              <Navigation />
              <ContentContainer>
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/timeline" element={<TimelinePage />} />
                    <Route path="/journal" element={<JournalPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </AnimatePresence>
              </ContentContainer>
            </AppContainer>
          </MemoryProvider>
        </AuthProvider>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
