import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Components
import MemoryContextStrip from '../components/memory/MemoryContextStrip';

/**
 * Emotion color mapping
 * Colors that represent the subtle hues of feeling.
 * A palette for the invisible.
 */
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
  neutral: '#a0a0bd',  // Muted purple-gray
};

// Placeholder component - will be replaced with actual implementation
const ChatContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  max-width: 800px;
  margin: 0 auto;
`;

const ChatHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: center;
`;

const ChatTitle = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.xxl};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ChatSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.md};
  font-style: italic;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.soft};
`;

const MessageBubble = styled.div`
  position: relative;
  max-width: 80%;
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  
  ${props => props.isUser ? `
    align-self: flex-end;
    background: ${props.theme.colors.primary};
    color: white;
    margin-left: auto;
  ` : `
    align-self: flex-start;
    background: ${props.theme.colors.card};
    color: ${props.theme.colors.text};
    box-shadow: ${props.theme.shadows.soft};
  `}
`;

const EmotionIndicator = styled.div`
  position: absolute;
  top: -8px;
  ${props => props.isUser ? 'right: 12px;' : 'left: 12px;'}
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.color || props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.soft};
`;

const MessageText = styled.div`
  line-height: 1.5;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-top: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.7)' : props.theme.colors.textSecondary};
`;

const InputContainer = styled.div`
  display: flex;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.soft};
`;

const MessageInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SendButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin-left: ${props => props.theme.spacing.sm};
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast} ease;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

/**
 * ChatPage component
 * 
 * The primary interface for conversation.
 * Where words become memories in real-time.
 */
function ChatPage() {
  const [message, setMessage] = useState('');
  
  // Placeholder messages with emotions
  const messages = [
    { 
      id: 1, 
      text: "Hello, I'm Echo. Your memory companion.", 
      isUser: false,
      emotion: "peaceful",
      timestamp: "5:30 PM"
    },
    { 
      id: 2, 
      text: "Hi Echo, it's nice to meet you.", 
      isUser: true,
      emotion: "joy",
      timestamp: "5:31 PM"
    },
    { 
      id: 3, 
      text: "I'll remember everything we talk about. What would you like to discuss today?", 
      isUser: false,
      emotion: "contemplative",
      timestamp: "5:31 PM"
    }
  ];
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real implementation, this would send the message to the backend
    console.log('Sending message:', message);
    
    // Clear input
    setMessage('');
  };
  
  return (
    <ChatContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
    >
      <ChatHeader>
        <ChatTitle>Echo</ChatTitle>
        <ChatSubtitle>Your memories are safe with me</ChatSubtitle>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map(msg => (
          <MessageBubble key={msg.id} isUser={msg.isUser}>
            <EmotionIndicator 
              isUser={msg.isUser} 
              color={emotionColors[msg.emotion] || emotionColors.neutral} 
            />
            <MessageText>{msg.text}</MessageText>
            <MessageMeta isUser={msg.isUser}>
              {msg.emotion} · {msg.timestamp}
            </MessageMeta>
          </MessageBubble>
        ))}
      </MessagesContainer>
      
      {/* Memory Context Strip - shows active memories in the conversation */}
      <MemoryContextStrip 
        memories={[
          {
            id: 101,
            summary: 'A conversation about dreams',
            emotion: 'wistful',
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
          }
        ]}
      />
      
      <form onSubmit={handleSendMessage}>
        <InputContainer>
          <MessageInput
            type="text"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <SendButton type="submit">Send</SendButton>
        </InputContainer>
      </form>
    </ChatContainer>
  );
}

export default ChatPage;
