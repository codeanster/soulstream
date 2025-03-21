import React from 'react';
import { SidebarHeader as StyledHeader, SidebarTitle } from './styles';

/**
 * SidebarHeader component
 * 
 * The title section of the conversations sidebar.
 * A simple header, yet it frames all that follows.
 */
const SidebarHeader = () => (
  <StyledHeader>
    <SidebarTitle>Conversations</SidebarTitle>
  </StyledHeader>
);

export default SidebarHeader;
