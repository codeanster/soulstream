import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
  
  // Placeholder messages
  const messages = [
    { id: 1, text: "Hello, I'm Echo. Your memory companion.", isUser: false },
    { id: 2, text: "Hi Echo, it's nice to meet you.", isUser: true },
    { id: 3, text: "I'll remember everything we talk about. What would you like to discuss today?", isUser: false }
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
            {msg.text}
          </MessageBubble>
        ))}
      </MessagesContainer>
      
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
