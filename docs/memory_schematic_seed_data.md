# Soulstream Seed Data Documentation

This document describes the seed data structure used for testing and development in the Soulstream project. The seed data creates a realistic environment with fictional users, their AI companions, and their interactions.

## Overview

The seed data tells the story of three fictional users, each with their own AI companions and emotional journeys:

1. **Alex Chen** - Exploring literature and technology with Luna and Atlas
2. **Maya Patel** - Navigating a breakup and finding creative inspiration with Zoe, Theo, and Nova
3. **James Wilson** - Reconnecting with childhood memories and addressing old regrets with Echo

## Data Structure

### Users

Three fictional users with different backgrounds and preferences:

| ID | Username      | Email             | Premium |
|----|---------------|-------------------|---------|
| 1  | alex_chen     | alex@example.com  | No      |
| 2  | maya_patel    | maya@example.com  | Yes     |
| 3  | james_wilson  | james@example.com | No      |

### Characters (AI Companions)

Six AI companions with distinct personalities and traits:

| ID | Name  | User    | Personality Traits                           |
|----|-------|---------|----------------------------------------------|
| 1  | Luna  | Alex    | Empathetic, philosophical, calm              |
| 2  | Atlas | Alex    | Analytical, direct, curious                  |
| 3  | Zoe   | Maya    | Witty, energetic, supportive                 |
| 4  | Theo  | Maya    | Thoughtful, introspective, gentle            |
| 5  | Nova  | Maya    | Bold, creative, inspiring                    |
| 6  | Echo  | James   | Reflective, melancholic, wise                |

### Memory Chips

21 memory chips representing significant moments and conversations:

- **Alex's memories** (8 chips): Conversations about books, career concerns, poetry, sleep issues, work achievements, quantum computing, coding frustrations, and travel plans
- **Maya's memories** (10 chips): Music sharing, self-care discussions, creative projects, relationship challenges, meditation experiences, philosophical questions, business ideas, creative fears, and adventure planning
- **James's memories** (3 chips): Childhood reflections, regrets about lost friendships, and family traditions

Each memory chip includes:
- Summary
- Source text (original conversation snippet)
- Emotion tag
- Topic
- Importance score
- Creation timestamp
- Last referenced timestamp

### Timeline Entries

25 timeline entries representing daily summaries:

- **Alex's timeline** (10 entries): Journey from journaling to meditation breakthrough to work accomplishments
- **Maya's timeline** (10 entries): Emotional journey from relationship difficulties through breakup to creative renewal
- **James's timeline** (5 entries): Process of reconnecting with the past and taking steps to address regrets

Each timeline entry includes:
- Date
- Title
- Mood
- Summary
- Primary emotion
- Emotion intensity (0.0 to 1.0)
- Secondary emotions (JSON array)
- Milestone flag

### Timeline-Memory Links

34 links connecting timeline entries to relevant memory chips:

- Each timeline entry is linked to 1-3 memory chips that provide context
- These links create a rich tapestry of connections between daily summaries and specific memories

### Journal Entries

14 journal entries with more reflective, narrative content:

- **Alex's journal** (4 entries): Reflections on beginning journaling, roommate friction, meditation breakthrough, and monthly reflection
- **Maya's journal** (6 entries): Processing relationship end, creative awakening, and emotional healing
- **James's journal** (4 entries): Contemplations on childhood memories, regrets, and taking steps to reconnect

Each journal entry includes:
- Date
- Title
- Body text
- Voice style
- Emotional tone

### Memory Tags

26 topic and emotion tags for organizing and filtering memories:

- Emotion tags: joy, sadness, anxiety, serenity, etc.
- Topic tags: literature, career, relationships, creativity, etc.

### Memory Links

20 connections between related memory chips:

- Links between contradictory memories
- Links between reinforcing memories
- Links between thematically related memories

## Emotional Narratives

The seed data is structured to tell coherent emotional stories:

1. **Alex's Journey**: From career uncertainty to meditation breakthrough to professional accomplishment
2. **Maya's Arc**: From relationship breakdown through grief to creative renewal and new possibilities
3. **James's Story**: From nostalgic reflection to addressing past regrets and taking action

## Using the Seed Data

This seed data provides a rich foundation for testing and developing:

- **Timeline Feature**: Test filtering by emotion, date ranges, and milestones
- **Emotion Visualization**: Implement and test emotion tooltips with the provided emotion data
- **Memory Relationships**: Explore connections between timeline entries and memory chips

The data is designed to be realistic but fictional, with emotional depth that makes it useful for testing the nuanced features of Soulstream's memory and emotion tracking capabilities.
