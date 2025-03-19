import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Components
import MemoryPanel from '../components/memory/MemoryPanel';

/**
 * MemoryPage component
 * 
 * The archive of our shared history.
 * A place to revisit what was, and what remains.
 */

const PageContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.md};
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const PageTitle = styled.h1`
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.xxl};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.md};
  font-style: italic;
`;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

function MemoryPage() {
  return (
    <PageContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <PageTitle>Memory Archive</PageTitle>
        <PageSubtitle>
          Fragments of our conversations, preserved in digital amber
        </PageSubtitle>
      </PageHeader>
      
      <MemoryPanel title="All Memories" />
    </PageContainer>
  );
}

export default MemoryPage;
