# Game Setup Screen Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    📱 Game Tracker                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎮 New Game Setup                                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Game Name                                       │   │
│  │ [Evening Card Game Session          ]           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Game Type                                       │   │
│  │ [5 Cards ▼]                                     │   │
│  │   • 5 Cards (Show < 5 points)                   │   │
│  │   • Secret 7                                    │   │
│  │   • Custom Game                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Elimination Threshold                           │   │
│  │ [100] points                                    │   │(Max points can be 100 250 or there might not be any limit. In that case then number of rounds is the limit)
│  │ Common: 50 | 100 | 150 | 200                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  👥 Players (2/8)                                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [+ Add Player Name                    ]         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 1. Alice                               [×]      │   │
│  │ 2. Bob                                 [×]      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              🚀 Start Game                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Key Features

### Game Configuration
- **Game Name**: Optional custom name for the session
- **Game Type Selector**: Dropdown with predefined game rules
- **Elimination Threshold**: Adjustable point limit (default 100)
- **Quick Presets**: Common thresholds for easy selection

### Player Management
- **Add Players**: Simple text input with Enter/Add button
- **Player List**: Shows current players with remove option
- **Player Counter**: Visual indicator of current/max players
- **Validation**: Minimum 2 players required to start

### Navigation Options
- **Start Game**: Primary action button (disabled until valid setup)
- **Load Previous**: Access to saved game sessions
- **Settings**: Access to app preferences

## UX Considerations

### Input Validation
- Game name: Optional, defaults to timestamp
- Players: Minimum 2, maximum 8 recommended
- Threshold: Positive integers only, reasonable limits (10-500)

### Accessibility
- Large touch targets (44px minimum)
- Clear visual hierarchy
- Error states with helpful messages
- Keyboard navigation support

### Data Persistence
- Auto-save player names for quick re-add
- Remember last used settings
- Quick access to recent game configurations

## Error States

### Insufficient Players
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Add at least 2 players to start the game        │
└─────────────────────────────────────────────────────┘
```

### Duplicate Player Names
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Player name "Alice" already exists               │
└─────────────────────────────────────────────────────┘
```

### Invalid Threshold
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Elimination threshold must be between 10-500     │
└─────────────────────────────────────────────────────┘
