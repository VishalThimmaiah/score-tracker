# Game Score Tracker - Sequence Diagram

## Overview
This sequence diagram illustrates the main user flows and system interactions for the Game Score Tracking App based on the wireframes analysis.

## Main Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant GameSetup as Game Setup Screen
    participant Dashboard as Main Dashboard
    participant ScoreEntry as Score Entry Interface
    participant PlayerMgmt as Player Management
    participant GameHistory as Game History
    participant DataStore as Local Storage
    participant UI as UI Components

    Note over User, UI: 1. NEW GAME SETUP FLOW
    
    User->>GameSetup: Launch App
    GameSetup->>UI: Display setup form
    User->>GameSetup: Enter game name & type
    User->>GameSetup: Set elimination threshold (100 pts)
    User->>GameSetup: Add players (min 2, max 8)
    GameSetup->>GameSetup: Validate player count
    User->>GameSetup: Click "Start Game"
    GameSetup->>DataStore: Save game configuration
    GameSetup->>Dashboard: Navigate to dashboard
    
    Note over User, UI: 2. MAIN GAME FLOW - ROUND MANAGEMENT
    
    Dashboard->>UI: Display player scores & rankings
    Dashboard->>UI: Show progress bars with color coding
    User->>Dashboard: Click "Add Round Scores"
    Dashboard->>ScoreEntry: Open score entry modal
    
    Note over User, UI: 3. SCORE ENTRY FLOW
    
    ScoreEntry->>UI: Display player input fields
    User->>ScoreEntry: Enter score for Player 1
    ScoreEntry->>ScoreEntry: Calculate new total
    ScoreEntry->>UI: Update real-time total display
    User->>ScoreEntry: Enter score for Player 2
    ScoreEntry->>ScoreEntry: Calculate new total
    User->>ScoreEntry: Continue for all active players
    
    alt Player reaches elimination threshold
        ScoreEntry->>UI: Show elimination warning
        User->>ScoreEntry: Confirm elimination
        ScoreEntry->>DataStore: Mark player as eliminated
    end
    
    User->>ScoreEntry: Click "Save Round"
    ScoreEntry->>DataStore: Save round scores
    ScoreEntry->>Dashboard: Return to dashboard
    Dashboard->>UI: Update player rankings
    Dashboard->>UI: Refresh progress bars
    
    Note over User, UI: 4. ONGOING GAME MANAGEMENT
    
    loop Multiple Rounds
        User->>Dashboard: Monitor game progress
        User->>Dashboard: Add next round scores
        Dashboard->>ScoreEntry: Open score entry
        User->>ScoreEntry: Enter scores
        ScoreEntry->>DataStore: Save scores
        ScoreEntry->>Dashboard: Update dashboard
    end
    
    Note over User, UI: 5. SIMPLIFIED PLAYER MANAGEMENT (SETUP ONLY)
    
    Note over GameSetup, DataStore: Player management only during game setup
    Note over Dashboard, UI: Players displayed with status on dashboard
    Note over ScoreEntry, UI: Eliminated players automatically handled
    
    Note over User, UI: 6. GAME HISTORY & ANALYSIS
    
    User->>Dashboard: Access game history
    Dashboard->>GameHistory: Navigate to history screen
    GameHistory->>DataStore: Load complete game data
    GameHistory->>UI: Display round-by-round table
    
    alt View different history formats
        User->>GameHistory: Switch to chart view
        GameHistory->>UI: Display trend charts
    else
        User->>GameHistory: Switch to player view
        GameHistory->>UI: Display individual stats
    end
    
    alt Export game data
        User->>GameHistory: Click export
        GameHistory->>UI: Show export options
        User->>GameHistory: Select format (PDF/CSV/JSON)
        GameHistory->>DataStore: Generate export file
        GameHistory->>UI: Provide download/share options
    end
    
    Note over User, UI: 7. GAME COMPLETION FLOW
    
    alt Game ends naturally
        ScoreEntry->>ScoreEntry: Detect only 1 active player
        ScoreEntry->>Dashboard: Auto-complete game
        Dashboard->>DataStore: Mark game as completed
        Dashboard->>GameHistory: Navigate to final results
        GameHistory->>UI: Display winner & final rankings
    end
    
    alt Manual game end
        User->>Dashboard: Click "End Game"
        Dashboard->>UI: Show confirmation dialog
        User->>Dashboard: Confirm end game
        Dashboard->>DataStore: Mark game as completed
        Dashboard->>GameHistory: Navigate to results
    end
    
    Note over User, UI: 8. ERROR HANDLING FLOWS
    
    alt Invalid score entry
        User->>ScoreEntry: Enter invalid score
        ScoreEntry->>UI: Show error message
        User->>ScoreEntry: Correct input
        ScoreEntry->>UI: Clear error state
    end
    
    alt Data persistence failure
        ScoreEntry->>DataStore: Attempt to save scores
        DataStore-->>ScoreEntry: Save failed
        ScoreEntry->>UI: Show retry dialog
        User->>ScoreEntry: Retry save
        ScoreEntry->>DataStore: Retry save operation
    end
    
    alt Accidental navigation
        User->>ScoreEntry: Press back with unsaved data
        ScoreEntry->>UI: Show confirmation dialog
        alt Save and exit
            User->>ScoreEntry: Choose "Save & Exit"
            ScoreEntry->>DataStore: Save current data
            ScoreEntry->>Dashboard: Navigate back
        else
            User->>ScoreEntry: Choose "Discard"
            ScoreEntry->>Dashboard: Navigate back without saving
        end
    end
    
    Note over User, UI: 9. PERFORMANCE OPTIMIZATIONS
    
    alt Large game handling (20+ rounds)
        GameHistory->>DataStore: Request large dataset
        DataStore->>GameHistory: Return paginated data
        GameHistory->>UI: Display with virtual scrolling
        User->>GameHistory: Scroll to load more
        GameHistory->>DataStore: Load additional rounds
    end
    
    Note over User, UI: 10. STATE MANAGEMENT
    
    rect rgb(240, 248, 255)
        Note over DataStore: Game States: Setup → Active → Paused → Completed
        Note over DataStore: Player States: Added → Active → Warning → Eliminated
        Note over DataStore: Auto-save on every score update
        Note over DataStore: Maintain game history for analysis
    end
```

## Key Interaction Patterns

### 1. Score Entry Patterns
- **Modal Overlay**: For ≤6 players (primary pattern)
- **Full Screen**: For 7+ players
- **Real-time Calculation**: Immediate total updates
- **Elimination Detection**: Automatic threshold checking

### 2. Data Flow Patterns
- **Auto-save**: Every score update persisted immediately
- **State Synchronization**: UI updates reflect data changes
- **Error Recovery**: Retry mechanisms for failed operations
- **Performance**: Lazy loading for large datasets

### 3. Navigation Patterns
- **Hub Model**: Dashboard as central navigation point
- **Modal Overlays**: For secondary actions
- **Confirmation Dialogs**: For destructive actions
- **Progressive Disclosure**: Advanced features revealed as needed

### 4. User Experience Patterns
- **Touch-First**: Large touch targets, gesture support
- **Visual Feedback**: Progress bars, color coding, animations
- **Error Prevention**: Input validation, confirmation dialogs
- **Accessibility**: Screen reader support, keyboard navigation

## Critical Success Paths

1. **Happy Path**: Setup → Play → Score → Complete → Export
2. **Error Recovery**: Invalid Input → Error → Correction → Continue
3. **Large Game**: 20+ Rounds → Performance → Virtual Scrolling
4. **Player Management**: Add/Remove/Disable → State Update → UI Refresh

## System Components

- **Game Setup Screen**: Initial configuration and player management
- **Main Dashboard**: Central hub with real-time game state
- **Score Entry Interface**: Efficient score input with validation
- **Player Management**: Dynamic player administration
- **Game History**: Comprehensive analysis and export capabilities
- **Local Storage**: Persistent data with auto-save functionality
- **UI Components**: Responsive, accessible interface elements

This sequence diagram captures the complete user journey from game setup through completion, including error handling, performance optimizations, and state management patterns defined in the wireframes.
