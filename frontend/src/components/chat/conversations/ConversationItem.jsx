import React from 'react';
import PropTypes from 'prop-types';
import { 
  ConversationItemContainer, 
  ConversationTitle, 
  ConversationDate, 
  LastMessage 
} from './styles';
import { formatDate, formatConversationTitle } from './utils';

/**
 * ConversationItem component
 * 
 * A single conversation in the sidebar.
 * Each one a doorway to a different set of memories.
 */
const ConversationItem = ({ 
  conversation, 
  isActive, 
  onClick 
}) => {
  const { id, title, timestamp, last_message } = conversation;
  
  return (
    <ConversationItemContainer 
      $isActive={isActive}
      onClick={() => onClick(id)}
    >
      <ConversationTitle $isActive={isActive}>
        {title || `Conversation at ${formatDate(timestamp)}`}
      </ConversationTitle>
      <ConversationDate>{formatDate(timestamp)}</ConversationDate>
      {last_message && (
        <LastMessage>
          {last_message}
        </LastMessage>
      )}
    </ConversationItemContainer>
  );
};

ConversationItem.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    timestamp: PropTypes.string.isRequired,
    title: PropTypes.string,
    last_message: PropTypes.string
  }).isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

ConversationItem.defaultProps = {
  isActive: false
};

export default ConversationItem;
