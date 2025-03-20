import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../../contexts/AuthContext';
import { SidebarContainer, SidebarToggle, sidebarVariants } from './styles';
import { groupConversationsByTime } from './utils';
import SidebarHeader from './SidebarHeader';
import ConversationGroup from './ConversationGroup';
import EmptyState from './EmptyState';

/**
 * ConversationsSidebar component
 * 
 * A sidebar displaying past conversations organized by time.
 * The archives of our dialogues, fragments of time.
 * Some recent, some fading into the past.
 */
const ConversationsSidebar = ({ 
  conversations = [], 
  activeConversationId = null,
  onSelectConversation = () => {} 
}) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [groupedConversations, setGroupedConversations] = useState({});
  
  // Group conversations by time
  useEffect(() => {
    if (conversations.length > 0) {
      setGroupedConversations(groupConversationsByTime(conversations));
    }
  }, [conversations]);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <SidebarToggle 
        onClick={toggleSidebar} 
        $isOpen={isOpen}
        aria-label={isOpen ? "Close conversations sidebar" : "Open conversations sidebar"}
      >
        {isOpen ? '←' : '→'}
      </SidebarToggle>
      
      <SidebarContainer
        $isOpen={isOpen}
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
      >
        <SidebarHeader />
        
        {conversations.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ConversationGroup
              title="Today"
              conversations={groupedConversations.today || []}
              activeConversationId={activeConversationId}
              onSelectConversation={onSelectConversation}
            />
            
            <ConversationGroup
              title="Yesterday"
              conversations={groupedConversations.yesterday || []}
              activeConversationId={activeConversationId}
              onSelectConversation={onSelectConversation}
            />
            
            <ConversationGroup
              title="Last 7 Days"
              conversations={groupedConversations.lastWeek || []}
              activeConversationId={activeConversationId}
              onSelectConversation={onSelectConversation}
            />
            
            <ConversationGroup
              title="Last 30 Days"
              conversations={groupedConversations.lastMonth || []}
              activeConversationId={activeConversationId}
              onSelectConversation={onSelectConversation}
            />
            
            <ConversationGroup
              title="Older"
              conversations={groupedConversations.older || []}
              activeConversationId={activeConversationId}
              onSelectConversation={onSelectConversation}
            />
          </>
        )}
      </SidebarContainer>
    </>
  );
};

ConversationsSidebar.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      timestamp: PropTypes.string.isRequired,
      title: PropTypes.string
    })
  ),
  activeConversationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectConversation: PropTypes.func
};

export default ConversationsSidebar;
