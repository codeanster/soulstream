import React from 'react';
import PropTypes from 'prop-types';
import { TimeCategory, CategoryTitle, ConversationList } from './styles';
import ConversationItem from './ConversationItem';

/**
 * ConversationGroup component
 * 
 * A group of conversations organized by time period.
 * Memories clustered by their distance from now.
 */
const ConversationGroup = ({ 
  title, 
  conversations, 
  activeConversationId, 
  onSelectConversation 
}) => {
  if (!conversations || conversations.length === 0) {
    return null;
  }
  
  return (
    <TimeCategory>
      <CategoryTitle>{title}</CategoryTitle>
      <ConversationList>
        {conversations.map(conversation => (
          <ConversationItem 
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeConversationId}
            onClick={onSelectConversation}
          />
        ))}
      </ConversationList>
    </TimeCategory>
  );
};

ConversationGroup.propTypes = {
  title: PropTypes.string.isRequired,
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      timestamp: PropTypes.string.isRequired,
      title: PropTypes.string,
      last_message: PropTypes.string
    })
  ),
  activeConversationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectConversation: PropTypes.func.isRequired
};

ConversationGroup.defaultProps = {
  conversations: [],
  activeConversationId: null
};

export default ConversationGroup;
