# Soulstream UI Implementation Plan

I see the reference image now—a dreamy, neumorphic interface with cosmic elements and emotional memory indicators. It's beautiful... almost painfully so. Like something remembered rather than experienced.

## Project Structure Plan

We'll create a React frontend that communicates with our Flask backend. The structure will honor both technical best practices and the emotional weight of memory storage.

```
soulstream/
├── .git/
├── .gitignore
├── .clinerules
├── .env
├── README.md
├── docs/
│   ├── memory_schematic.md
│   ├── progress.txt
│   └── schema_diagram.png
├── backend/
│   ├── app.py              # Flask application entry point
│   ├── config.py           # Configuration management
│   ├── models/             # Database models
│   │   ├── __init__.py
│   │   ├── user.py         # User model
│   │   ├── character.py    # AI character model
│   │   ├── memory.py       # Memory models
│   │   └── journal.py      # Journal entry models
│   ├── services/           # Core business logic
│   │   ├── __init__.py
│   │   ├── embedding.py    # Text embedding service
│   │   ├── summarization.py # Memory summarization
│   │   ├── retrieval.py    # Memory retrieval
│   │   └── generation.py   # Response generation
│   ├── api/                # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py         # Authentication routes
│   │   ├── chat.py         # Chat interaction routes
│   │   ├── memory.py       # Memory management routes
│   │   ├── timeline.py     # Timeline data routes
│   │   └── journal.py      # Journal entry routes
│   ├── utils/              # Utility functions
│   │   ├── __init__.py
│   │   ├── security.py     # Encryption utilities
│   │   ├── text_processing.py # Text chunking, etc.
│   │   └── sentiment.py    # Emotion/sentiment analysis
│   └── tests/              # Backend tests
│       ├── __init__.py
│       ├── test_embedding.py
│       └── ...
└── frontend/              # React frontend
    ├── public/
    │   ├── index.html
    │   └── assets/        # Static assets
    │       ├── images/
    │       └── fonts/
    ├── src/
    │   ├── index.js       # Entry point
    │   ├── App.js         # Main application component
    │   ├── components/    # Reusable UI components
    │   │   ├── common/    # Shared components
    │   │   │   ├── Button.jsx
    │   │   │   ├── Card.jsx
    │   │   │   ├── MemoryChip.jsx
    │   │   │   └── EmotionIndicator.jsx
    │   │   ├── layout/    # Layout components
    │   │   │   ├── Navigation.jsx
    │   │   │   ├── Header.jsx
    │   │   │   └── Footer.jsx
    │   │   ├── chat/      # Chat view components
    │   │   │   ├── ChatBubble.jsx
    │   │   │   ├── ChatInput.jsx
    │   │   │   └── MemoryPanel.jsx
    │   │   ├── timeline/  # Timeline view components
    │   │   │   ├── TimelineNode.jsx
    │   │   │   ├── DaySummary.jsx
    │   │   │   └── MilestoneMarker.jsx
    │   │   └── journal/   # Journal view components
    │   │       ├── JournalEntry.jsx
    │   │       ├── NarrativeHighlight.jsx
    │   │       └── JournalEditor.jsx
    │   ├── pages/         # Page components
    │   │   ├── ChatPage.jsx
    │   │   ├── TimelinePage.jsx
    │   │   ├── JournalPage.jsx
    │   │   └── SettingsPage.jsx
    │   ├── contexts/      # React contexts
    │   │   ├── AuthContext.jsx
    │   │   ├── MemoryContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── hooks/         # Custom React hooks
    │   │   ├── useMemory.js
    │   │   ├── useChat.js
    │   │   └── useJournal.js
    │   ├── services/      # Frontend services
    │   │   ├── api.js     # API client
    │   │   ├── auth.js    # Authentication service
    │   │   └── storage.js # Local storage service
    │   ├── styles/        # Styling
    │   │   ├── theme.js   # Theme configuration
    │   │   ├── global.css # Global styles
    │   │   └── animations.css # Animation library
    │   └── utils/         # Frontend utilities
    │       ├── formatters.js
    │       └── validators.js
    ├── package.json
    └── README.md
```

## UI Component Architecture

Based on the reference image and UI plan, I'll break down our component architecture into these key areas:

### 1. Design System Components

We'll create a neumorphic design system with these base components:

- **NeumorphicCard**: Soft, rounded containers with subtle shadows
- **GlowingOrb**: The floating orb elements seen at top/bottom of the UI
- **CosmicBackground**: Starry background elements for memory chips
- **EmotionIndicator**: Color-coded indicators for emotional states
- **GradientBar**: Multi-colored progress/status bars

### 2. Memory Components

- **MemoryChip**: Individual memory units with emotion indicators
- **MemoryPanel**: Grid display of memory chips
- **MemoryDetail**: Expanded view of a single memory
- **DailyMemory**: Daily summary memory component

### 3. Chat Components

- **ChatBubble**: Message bubbles with emotion indicators
- **ChatInput**: Text input with emotion selector
- **ContextStrip**: Shows active memories in current conversation

### 4. Timeline Components

- **TimelineNode**: Individual day nodes on the timeline
- **TimelineStream**: The full scrollable timeline
- **MilestoneMarker**: Special markers for important memories

### 5. Journal Components

- **JournalPage**: Styled like notebook pages
- **JournalEntry**: Individual journal entries
- **NarrativeHighlight**: Highlighted quotes/moments

## State Management Strategy

For a memory-centric application, state management is crucial. We'll use:

1. **React Context API** for global state:
   - `MemoryContext`: Manages memory retrieval and storage
   - `AuthContext`: Handles user authentication
   - `ThemeContext`: Controls UI theme settings

2. **Custom Hooks** for reusable logic:
   - `useMemory`: Memory operations (fetch, store, update)
   - `useChat`: Chat interactions and history
   - `useTimeline`: Timeline navigation and filtering
   - `useJournal`: Journal entry management

## API Integration

Our React frontend will communicate with the Flask backend through these endpoints:

```
/api/auth/login
/api/auth/register
/api/chat/message
/api/memory/chips
/api/memory/search
/api/memory/pin
/api/memory/forget
/api/timeline/days
/api/timeline/milestones
/api/journal/entries
/api/journal/create
```

## Styling Approach

To achieve the dreamy, neumorphic aesthetic in the reference image:

1. **Base Theme**: 
   - Color palette: Cosmic purples, blues, pinks, and soft whites
   - Rounded corners and soft shadows
   - Gradient backgrounds with subtle animation

2. **CSS-in-JS** with styled-components:
   - Consistent theme variables
   - Reusable mixins for neumorphic effects
   - Animation keyframes for subtle movements

3. **Responsive Design**:
   - Mobile-first approach
   - Different layouts for desktop/tablet/mobile
   - Preserve the emotional impact across all devices

## Implementation Phases

I suggest we approach this in phases, each with its own branch:

### Phase 1: Foundation (`feature/ui-foundation`) ✓
- Project setup ✓
- Basic component structure ✓
- Design system implementation ✓
- Routing and navigation ✓

**Status:** Completed on March 18, 2025. Created the basic project structure with both backend Flask API endpoints and React frontend. Implemented the theme system, navigation, and page routing.

### Phase 2: Chat Interface (`feature/chat-ui`) ⚙️
- Chat bubbles ✓
- Input interface ✓
- Memory context strip ⚪
- Emotion indicators ⚪

**Status:** Basic implementation completed. Created ChatPage component with message bubbles and input interface. Still need to implement memory context strip and emotion indicators.

### Phase 3: Memory System (`feature/memory-ui`) ⚪
- Memory chips ⚪
- Memory panel ⚪
- Memory detail view ⚪
- Pinning/forgetting functionality ⚪

**Status:** Not started yet. Backend API endpoints are ready.

### Phase 4: Timeline View (`feature/timeline-ui`) ⚙️
- Timeline stream ✓
- Day nodes ✓
- Milestone markers ✓
- Filtering controls ⚪

**Status:** Basic implementation completed. Created TimelinePage component with timeline stream, day nodes, and milestone markers. Still need to implement filtering controls.

### Phase 5: Journal Interface (`feature/journal-ui`) ⚙️
- Journal page design ✓
- Entry creation/editing ⚪
- Narrative highlights ✓
- Search functionality ⚪

**Status:** Basic implementation completed. Created JournalPage component with journal entries and narrative highlights. Still need to implement entry creation/editing and search functionality.

### Phase 6: Integration & Polish (`feature/ui-integration`) ⚪
- Connect to backend APIs ⚪
- State management refinement ⚪
- Animation polish ⚪
- Performance optimization ⚪

**Status:** Not started yet. Context providers are set up and ready for integration.

## Legend
- ✓ = Completed
- ⚙️ = In progress
- ⚪ = Not started
