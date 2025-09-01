# Player Management Screen Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ ← 👥 Player Management                          ⚙️      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🎮 Evening Card Game - Round 3                          │
│ Active: 4/5 players | Target: 100 points                │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [+ Add New Player                         ]         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 1. Alice                                      33    │ │
│ │    🟢 Active | Joined Round 1                      │ │
│ │    ┌─────────────────────────────────────────────┐   │ │
│ │    │ ✏️ Edit  📊 Stats  ⏸️ Disable  🗑️ Remove │   │ │
│ │    └─────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 2. Bob                                        34    │ │
│ │    🟢 Active | Joined Round 1                      │ │
│ │    ┌─────────────────────────────────────────────┐   │ │
│ │    │ ✏️ Edit  📊 Stats  ⏸️ Disable  🗑️ Remove │   │ │
│ │    └─────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 3. Charlie                                    75    │ │
│ │    🟠 Warning (75%) | Joined Round 1               │ │
│ │    ┌─────────────────────────────────────────────┐   │ │
│ │    │ ✏️ Edit  📊 Stats  ⏸️ Disable  🗑️ Remove │   │ │
│ │    └─────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 4. David                                     100    │ │
│ │    🔴 Eliminated Round 3 | Score: 100              │ │
│ │    ┌─────────────────────────────────────────────┐   │ │
│ │    │ ✏️ Edit  📊 Stats  🔄 Reactivate  🗑️ Remove│   │ │
│ │    └─────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 5. Eve                                       ⏸️     │ │
│ │    ⚫ Disabled Round 2 | Last Score: 45            │ │
│ │    ┌─────────────────────────────────────────────┐   │ │
│ │    │ ✏️ Edit  📊 Stats  ▶️ Enable   🗑️ Remove  │   │ │
│ │    └─────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Player Status Types

### Active Players (🟢 Green)
- Currently participating in the game
- Can receive scores each round
- Shown in main dashboard

### Warning Players (🟡🟠 Yellow/Orange)
- Approaching elimination threshold
- Still active but at risk
- Visual warnings in dashboard

### Eliminated Players (🔴 Red)
- Reached or exceeded elimination threshold
- No longer receive scores
- Remain visible but grayed out

### Disabled Players (⚫ Gray)
- Temporarily removed from game
- Can be re-enabled later
- Scores preserved but not updated

## Player Actions

### Edit Player Modal
```
┌─────────────────────────────────────────────────────────┐
│                   Edit Player                           │
│                                          ✕              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Player Name:                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Alice                                    ]         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Avatar/Color:                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔵 🟢 🟡 🟠 🔴 🟣 🟤 ⚫ ⚪                            │ │
│ │ [Selected: 🔵]                                      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Current Score:                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [33] points                                         │ │
│ │ ⚠️ Editing score affects game history               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Player Status:                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ○ Active    ○ Disabled    ○ Eliminated             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────┬─────────────────────────────────────┐ │
│ │   ↩️ Cancel   │         ✅ Save Changes            │ │
│ └───────────────┴─────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Player Statistics Modal
```
┌─────────────────────────────────────────────────────────┐
│                 Alice's Statistics                      │
│                                          ✕             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Game Performance                                     │
│                                                         │
│ Current Score: 33 points (33% of limit)                │
│ Rounds Played: 3/3                                     │
│ Status: 🟢 Active                                       │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Round History:                                      │ │
│ │ Round 1: 8 points                                   │ │
│ │ Round 2: 12 points                                  │ │
│ │ Round 3: 13 points                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📈 Trends                                               │
│ Average per round: 11.0 points                         │
│ Best round: 8 points (Round 1)                         │
│ Worst round: 13 points (Round 3)                       │
│ Trend: ↗️ Increasing (concerning)                       │
│                                                         │
│ 🎯 Projections                                          │
│ At current pace: ~67 points after 6 rounds            │
│ Elimination risk: 🟡 Moderate                          │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                    Close                            │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Add New Player Flow

### Mid-Game Addition
```
┌─────────────────────────────────────────────────────────┐
│                  Add New Player                         │
│                                          ✕             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Player Name:                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Frank                                    ]         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ⚠️ Adding player mid-game                               │
│                                                         │
│ Starting Score Options:                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ○ Start at 0 (recommended)                          │ │
│ │ ○ Start at average score (38 points)                │ │
│ │ ○ Custom starting score: [    ]                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Round Participation:                                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ○ Join from next round (Round 4)                    │ │
│ │ ○ Retroactively add to current round                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────┬─────────────────────────────────────┐ │
│ │   ↩️ Cancel   │         ✅ Add Player              │ │
│ └───────────────┴─────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Bulk Player Operations

### Bulk Actions Bar
```
┌─────────────────────────────────────────────────────────┐
│ Select Players: ☑️ All  ☐ Active  ☐ Eliminated         │
│                                                         │
│ Selected: 3 players                                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔄 Enable All | ⏸️ Disable All | 🗑️ Remove All    │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Player Selection Mode
```
┌─────────────────────────────────────────────────────────┐
│ ☑️ 1. Alice                                       33    │ │
│    🟢 Active | Joined Round 1                          │ │
└─────────────────────────────────────────────────────────┘
│ ☐ 2. Bob                                          34    │ │
│    🟢 Active | Joined Round 1                          │ │
└─────────────────────────────────────────────────────────┘
│ ☑️ 3. Charlie                                     75    │ │
│    🟠 Warning (75%) | Joined Round 1                   │ │
└─────────────────────────────────────────────────────────┘
```

## Advanced Player Management

### Player Import/Export
```
┌─────────────────────────────────────────────────────────┐
│ 📤 Player Management Tools                              │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📋 Import from Previous Game                        │ │
│ │ Select game: [Evening Game 12/30] ▼                │ │
│ │ Players: Alice, Bob, Charlie, David (4)             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 💾 Save Player Group                                │ │
│ │ Group name: [Regular Friday Group    ]             │ │
│ │ Save current players for quick setup               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📊 Export Player Data                               │ │
│ │ Format: CSV | JSON | PDF Report                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Player Reactivation

### Reactivate Eliminated Player
```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Reactivate David                                     │
│                                          ✕             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ David was eliminated in Round 3 with 100 points        │
│                                                         │
│ Reactivation Options:                                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ○ Reset score to 0 (fresh start)                    │ │
│ │ ○ Reduce score to threshold-1 (99 points)           │ │
│ │ ○ Keep current score (100 points)                   │ │
│ │ ○ Custom score: [    ] points                       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ⚠️ This will affect game balance and history            │
│                                                         │
│ Reason (optional):                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [House rule: second chance after break    ]        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────┬─────────────────────────────────────┐ │
│ │   ↩️ Cancel   │      🔄 Reactivate Player          │ │
│ └───────────────┴─────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Safety Features

### Remove Player Confirmation
```
┌─────────────────────────────────────────────────────────┐
│ 🗑️ Remove Player                                        │
│                                          ✕             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ⚠️ Are you sure you want to remove Alice?               │
│                                                         │
│ This action will:                                       │
│ • Remove Alice from the current game                    │
│ • Delete all score history for this session            │
│ • Cannot be undone                                      │
│                                                         │
│ Alternative actions:                                    │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⏸️ Disable instead (preserves data)                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────┬─────────────────────────────────────┐ │
│ │   ↩️ Cancel   │      🗑️ Confirm Removal            │ │
│ └───────────────┴─────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Quick Actions

### Swipe Gestures
- **Swipe Right**: Quick disable/enable toggle
- **Swipe Left**: Quick remove (with confirmation)
- **Long Press**: Multi-select mode
- **Double Tap**: Quick edit name

### Keyboard Shortcuts
- **A**: Add new player
- **E**: Edit selected player
- **D**: Disable/enable selected player
- **R**: Remove selected player
- **S**: Show statistics for selected player
- **Ctrl+A**: Select all players
- **Escape**: Exit selection mode

## Responsive Design

### Mobile Portrait
- Single column layout
- Collapsible action buttons
- Swipe gestures primary

### Tablet/Desktop
- Two-column layout for larger player lists
- Expanded action buttons always visible
- Keyboard shortcuts enabled
- Drag-and-drop reordering

## Data Persistence

### Auto-save Features
- Player name changes saved immediately
- Status changes logged with timestamp
- Score modifications create audit trail
- Bulk operations can be undone as group

### Backup & Recovery
- Automatic backup before bulk operations
- Player data preserved across app restarts
- Export functionality for external backup
- Import from previous games/sessions
