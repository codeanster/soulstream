import React from 'react';
import { EmptyContainer, EmptyIcon, EmptyText } from './styles';

/**
 * EmptyState component
 * 
 * Displayed when there are no conversations.
 * A gentle invitation to begin.
 */
const EmptyState = () => (
  <EmptyContainer>
    <EmptyIcon>💬</EmptyIcon>
    <EmptyText>No conversations yet. Start chatting to create memories.</EmptyText>
  </EmptyContainer>
);

export default EmptyState;
