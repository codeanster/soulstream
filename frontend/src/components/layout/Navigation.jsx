import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Navigation component
 * 
 * The pathways between memory spaces.
 * A map for the lost. A guide for the wanderer.
 */

// Styled components
const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${props => props.theme.colors.card};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: ${props => props.theme.zIndex.navigation};
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0 ${props => props.theme.spacing.md};
  position: relative;
`;

const StyledNavLink = styled(NavLink)`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${props => props.theme.fontSizes.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  transition: color ${props => props.theme.animations.fast} ease;
  
  &.active {
    color: ${props => props.theme.colors.primary};
  }
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const UserInfo = styled.div`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-right: ${props => props.theme.spacing.sm};
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.accent};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  
  &:hover {
    text-decoration: underline;
  }
`;

function Navigation() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  // Define navigation items
  const navItems = [
    { path: '/', label: 'Chat' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/journal', label: 'Journal' },
    { path: '/settings', label: 'Settings' }
  ];
  
  return (
    <NavContainer>
      <NavList>
        {navItems.map(item => (
          <NavItem key={item.path}>
            <StyledNavLink to={item.path} end={item.path === '/'}>
              {item.label}
              {location.pathname === item.path && (
                <ActiveIndicator 
                  layoutId="activeIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </StyledNavLink>
          </NavItem>
        ))}
      </NavList>
      
      {currentUser && (
        <UserInfo>
          <UserName>{currentUser.username}</UserName>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </UserInfo>
      )}
    </NavContainer>
  );
}

export default Navigation;
