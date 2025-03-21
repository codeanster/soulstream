import styled from 'styled-components';
import { motion } from 'framer-motion';

// Sidebar Container
export const SidebarContainer = styled(motion.div)`
  width: 280px;
  height: 100%;
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.soft}, 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: ${props => props.theme.spacing.md};
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  /* Subtle gradient overlay */
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0.01)
  );
  
  @media (max-width: 768px) {
    position: absolute;
    left: ${props => props.$isOpen ? '0' : '-300px'};
    z-index: 10;
    transition: left 0.3s ease, box-shadow 0.3s ease;
    height: 100%;
  }
  
  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    border: 2px solid transparent;
  }
`;

// Sidebar Toggle Button
export const SidebarToggle = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: ${props => props.theme.spacing.md};
    left: ${props => props.$isOpen ? '290px' : '10px'};
    z-index: 11;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
`;

// Header Components
export const SidebarHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: ${props => props.theme.spacing.sm};
  position: relative;
  
  /* Subtle glow effect on the header border */
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${props => props.theme.colors.primary}40,
      transparent
    );
  }
`;

export const SidebarTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  font-weight: ${props => props.theme.fontWeights.semibold};
  letter-spacing: 0.03em;
  
  /* Subtle text glow */
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
`;

// Time Category Components
export const TimeCategory = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  position: relative;
  
  /* Add subtle spacing between categories */
  &:not(:last-child) {
    padding-bottom: ${props => props.theme.spacing.sm};
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 10%;
      right: 10%;
      height: 1px;
      background: linear-gradient(
        to right,
        transparent,
        rgba(255, 255, 255, 0.05),
        transparent
      );
    }
  }
`;

export const CategoryTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-weight: ${props => props.theme.fontWeights.medium};
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: ${props => props.theme.fontSizes.xs};
  padding-left: ${props => props.theme.spacing.xs};
  position: relative;
  
  /* Subtle indicator before category title */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    box-shadow: 0 0 5px ${props => props.theme.colors.primary};
  }
`;

export const ConversationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

// Conversation Item Components
export const ConversationItemContainer = styled.li`
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$isActive 
    ? `linear-gradient(to right, ${props.theme.colors.primaryLight}80, ${props.theme.colors.primaryLight}40)` 
    : 'transparent'};
  border: 1px solid ${props => props.$isActive 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'transparent'};
  position: relative;
  overflow: hidden;
  
  /* Subtle hover effect */
  &:hover {
    background: ${props => props.$isActive 
      ? `linear-gradient(to right, ${props.theme.colors.primaryLight}80, ${props.theme.colors.primaryLight}40)` 
      : 'rgba(255, 255, 255, 0.03)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.$isActive 
      ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
      : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  }
  
  /* Active item glow effect */
  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: ${props.theme.colors.primary};
      box-shadow: 0 0 10px ${props.theme.colors.primary};
    }
  `}
`;

export const ConversationTitle = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.$isActive ? props.theme.fontWeights.semibold : props.theme.fontWeights.normal};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s ease;
  
  /* Subtle text glow for active items */
  text-shadow: ${props => props.$isActive ? '0 0 8px rgba(255, 255, 255, 0.1)' : 'none'};
`;

export const ConversationDate = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  
  /* Subtle dot separator */
  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 3px;
    background: ${props => props.theme.colors.textSecondary};
    border-radius: 50%;
    margin-right: ${props => props.theme.spacing.xs};
    opacity: 0.5;
  }
`;

export const LastMessage = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: ${props => props.theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
  max-width: 100%;
  font-style: italic;
`;

// Empty State Components
export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px dashed rgba(255, 255, 255, 0.1);
  margin: ${props => props.theme.spacing.md} 0;
`;

export const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textSecondary};
  opacity: 0.7;
  
  /* Subtle floating animation */
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

export const EmptyText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0;
  line-height: 1.5;
  max-width: 80%;
`;

// Animation variants
export const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};
