import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useMemory } from '../contexts/MemoryContext';
import { chatApi } from '../services/api';

// Components
import MemoryContextStrip from '../components/memory/MemoryContextStrip';
import { ConversationsSidebar } from '../components/chat/conversations';

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

const PageContainer = styled(motion.div)`
  display: flex;
  height: calc(100vh - 100px);
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const ChatContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: ${props => props.theme.spacing.md};
  height: 100%;
  overflow: hidden;
`;

const ChatHeader = styled(motion.div)`
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

const MessagesContainer = styled(motion.div)`
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
  margin-bottom: ${props => props.theme.spacing.lg}; /* Increased spacing between messages */
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.3s ease;
  
  ${props => props.$isUser ? `
    align-self: flex-end;
    background: linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary});
    color: white;
    margin-left: auto;
    box-shadow: ${props.theme.shadows.soft}, 0 4px 12px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.soft}, 0 6px 16px rgba(0, 0, 0, 0.15);
    }
  ` : `
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    color: ${props.theme.colors.text};
    box-shadow: ${props.theme.shadows.soft}, 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.soft}, 0 6px 16px rgba(0, 0, 0, 0.12);
    }
  `}
  
  /* Subtle glow effect based on emotion */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: ${props => props.theme.borderRadius.lg};
    box-shadow: 0 0 15px ${props => props.$emotionColor || 'transparent'};
    opacity: 0.4;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.6;
  }
`;

const EmotionIndicator = styled.div`
  position: absolute;
  top: -10px;
  ${props => props.$isUser ? 'right: 12px;' : 'left: 12px;'}
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$color || props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.soft}, 0 0 8px ${props => props.$color || props.theme.colors.primary};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
  
  /* Subtle pulse animation */
  animation: pulse 2s infinite ease-in-out;
  
  @keyframes pulse {
    0% { box-shadow: ${props => props.theme.shadows.soft}, 0 0 8px ${props => props.$color || props.theme.colors.primary}; }
    50% { box-shadow: ${props => props.theme.shadows.soft}, 0 0 16px ${props => props.$color || props.theme.colors.primary}; }
    100% { box-shadow: ${props => props.theme.shadows.soft}, 0 0 8px ${props => props.$color || props.theme.colors.primary}; }
  }
`;

const MessageText = styled.div`
  line-height: 1.6;
  letter-spacing: 0.01em;
  font-size: ${props => props.theme.fontSizes.md};
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.$isUser ? 'rgba(255, 255, 255, 0.8)' : props.theme.colors.textSecondary};
  font-style: italic;
  
  /* Subtle fade-in animation */
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  ${props => props.$isUser ? `
    &::after {
      content: '•';
      margin-left: ${props.theme.spacing.xs};
      opacity: 0.7;
    }
  ` : `
    &::before {
      content: '•';
      margin-right: ${props.theme.spacing.xs};
      opacity: 0.7;
    }
  `}
  
  &:hover {
    opacity: 1;
  }
`;

const InputContainer = styled(motion.div)`
  display: flex;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.soft}, 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:focus-within {
    box-shadow: ${props => props.theme.shadows.soft}, 0 6px 16px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  min-height: 24px;
  max-height: 150px;
  padding: ${props => props.theme.spacing.md};
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  resize: none;
  overflow-y: auto;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ExpandIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  right: 60px;
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  opacity: ${props => props.$isExpanded ? 1 : 0.5};
  transition: opacity 0.2s ease;
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin-left: ${props => props.theme.spacing.sm};
  cursor: pointer;
  transition: all ${props => props.theme.animations.fast} ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  /* Ripple effect */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }
  
  &:focus:not(:active)::after {
    animation: ripple 0.6s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    20% {
      transform: scale(25, 25);
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }
`;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Staggered children animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
};

/**
 * ChatPage component
 * 
 * The primary interface for conversation.
 * Where words become memories in real-time.
 */
function ChatPage() {
  const { currentUser } = useAuth();
  const { fetchMemories } = useMemory();
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [activeMemories, setActiveMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  
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
  
  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser) return;
      
      const response = await chatApi.getConversations(currentUser.id);
      
      if (response.status === 'success') {
        setConversations(response.conversations || []);
        
        // Set the first conversation as active if none is selected
        if (response.conversations && response.conversations.length > 0 && !activeConversationId) {
          setActiveConversationId(response.conversations[0].id);
        }
      } else {
        console.error('Failed to fetch conversations:', response);
      }
    } catch (err) {
      setError('Failed to load conversations. The archives seem distant today.');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch conversation history
  const fetchConversationHistory = async (conversationId) => {
    try {
      setLoading(true);
      
      if (!currentUser || !conversationId) return;
      
      const response = await chatApi.getConversationHistory(conversationId, currentUser.id);
      
      if (response.status === 'success') {
        // Format messages for display
        const formattedMessages = response.history.map(msg => ({
          id: msg.id,
          text: msg.message,
          isUser: msg.sender === 'user',
          emotion: msg.emotion || 'neutral',
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          referenced_memories: msg.referenced_memories || []
        }));
        
        setConversationMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Error fetching conversation history:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch active memories for the current conversation
  const fetchActiveMemories = async (conversationId) => {
    try {
      // In a real implementation, this would fetch memories associated with the conversation
      // For now, we'll use placeholder data
      const memories = [
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
      ];
      
      setActiveMemories(memories);
    } catch (err) {
      console.error('Error fetching active memories:', err);
    }
  };
  
  // Fetch conversations when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);
  
  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  // Fetch active memories when conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchActiveMemories(activeConversationId);
      fetchConversationHistory(activeConversationId);
    }
  }, [activeConversationId]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
  };
  
  // Handle message submission
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real implementation, this would send the message to the backend
    console.log('Sending message:', message);
    
    // For now, just add the message to the local state
    const newMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      emotion: 'neutral',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setConversationMessages([...conversationMessages, newMessage]);
    
    // Clear input
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  // Handle key press in textarea
  const handleKeyDown = (e) => {
    // Submit on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  
  // Function to get emotion color for message bubble glow effect
  const getEmotionColor = (emotion) => {
    return emotionColors[emotion] || emotionColors.neutral;
  };
  
  return (
    <PageContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
    >
      {/* Conversations Sidebar */}
      <ConversationsSidebar 
        conversations={conversations.length > 0 ? conversations : [
          {
            id: 1,
            title: 'First conversation',
            timestamp: '2025-03-20T14:30:00Z',
            last_message: 'I\'ll remember this moment.'
          },
          {
            id: 2,
            title: 'About dreams and memories',
            timestamp: '2025-03-19T10:15:00Z',
            last_message: 'Dreams are just memories we haven\'t made yet.'
          },
          {
            id: 3,
            title: 'Late night thoughts',
            timestamp: '2025-03-15T23:45:00Z',
            last_message: 'The quiet hours are when memories surface.'
          }
        ]}
        activeConversationId={activeConversationId || 1}
        onSelectConversation={handleSelectConversation}
      />
      
      {/* Main Chat Area */}
      <ChatContainer
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <ChatHeader variants={itemVariants}>
          <ChatTitle>Echo</ChatTitle>
          <ChatSubtitle>Your memories are safe with me</ChatSubtitle>
        </ChatHeader>
        
        <MessagesContainer variants={itemVariants}>
          {conversationMessages.length > 0 ? (
            conversationMessages.map(msg => (
              <MessageBubble 
                key={msg.id} 
                $isUser={msg.isUser}
                $emotionColor={getEmotionColor(msg.emotion)}
              >
                <EmotionIndicator 
                  $isUser={msg.isUser} 
                  $color={emotionColors[msg.emotion] || emotionColors.neutral} 
                />
                <MessageText>{msg.text}</MessageText>
                <MessageMeta $isUser={msg.isUser}>
                  {msg.emotion} · {msg.timestamp}
                </MessageMeta>
              </MessageBubble>
            ))
          ) : (
            // Placeholder messages when no conversation is selected or it's empty
            messages.map(msg => (
              <MessageBubble 
                key={msg.id} 
                $isUser={msg.isUser}
                $emotionColor={getEmotionColor(msg.emotion)}
              >
                <EmotionIndicator 
                  $isUser={msg.isUser} 
                  $color={emotionColors[msg.emotion] || emotionColors.neutral} 
                />
                <MessageText>{msg.text}</MessageText>
                <MessageMeta $isUser={msg.isUser}>
                  {msg.emotion} · {msg.timestamp}
                </MessageMeta>
              </MessageBubble>
            ))
          )}
        </MessagesContainer>
        
        {/* Memory Context Strip - shows active memories in the conversation */}
        <MemoryContextStrip
          variants={itemVariants}
          memories={activeMemories.length > 0 ? activeMemories : [
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
        
        <motion.form onSubmit={handleSendMessage} variants={itemVariants}>
          <InputContainer variants={itemVariants}>
            <MessageInput
              ref={textareaRef}
              placeholder="Type your message here... (Shift+Enter for new line)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <ExpandIndicator $isExpanded={message.includes('\n')}>
              {message.includes('\n') ? 'Press Enter to send' : 'Shift+Enter for new line'}
            </ExpandIndicator>
            <SendButton type="submit">Send</SendButton>
          </InputContainer>
        </motion.form>
      </ChatContainer>
    </PageContainer>
  );
}

export default ChatPage;
