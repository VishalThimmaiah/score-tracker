# Score Entry Interface Wireframe

## Layout Structure - Modal/Overlay Design

```
┌─────────────────────────────────────────────────────────┐
│                    Round 4 Scores                       │
│                                          ✕              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Enter scores for each player this round:                │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Alice                                         33    │ │
│ │ This Round: [    5    ] ⊖ ⊕                         │ │
│ │ New Total:      38                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Bob                                           34    │ │
│ │ This Round: [   12    ] ⊖ ⊕                         │ │
│ │ New Total:      46                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Charlie                                       75    │ │
│ │ This Round: [    8    ] ⊖ ⊕                         │ │
│ │ New Total:      83                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ David                                        100    │ │
│ │ ⚫ Eliminated - No Score Entry                      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📝 Round Notes (Optional)                           │ │
│ │ [Charlie had a great hand this round...    ]        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────┬─────────────────────────────────────┐ │
│ │   ↩️ Cancel   │         ✅ Save Round              │ │
│ └───────────────┴─────────────────────────────────────┘ │
│                                                         │
│ Quick Actions:                                          │
│ [0] [5] [10] [15] [20] [25] [Clear All]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Alternative Layout - Full Screen (For Many Players)

```
┌─────────────────────────────────────────────────────────┐
│ ← Round 4 Scores                               4/5 ✓    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 1. Alice                    Current: 33             │ │
│ │    ┌─────────────────────────────────────────────┐  │ │
│ │    │ This Round: [    5    ] ⊖ ⊕ → Total: 38     │  │ │
│ │    └─────────────────────────────────────────────┘  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 2. Bob                      Current: 34             │ │
│ │    ┌─────────────────────────────────────────────┐   │ │
│ │    │ This Round: [   12    ] ⊖ ⊕ → Total: 46   │   │ │
│ │    └─────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 3. Charlie                  Current: 75             │ │
│ │    ┌─────────────────────────────────────────────┐   │ │
│ │    │ This Round: [    8    ] ⊖ ⊕ → Total: 83   │   │ │
│ │    └─────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                   ✅ Save Round                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Quick Entry: [0] [5] [10] [15] [20] [25] [Clear]       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Key Features

### Score Input Methods

#### Primary Input
- **Numeric Keypad**: Large, touch-friendly number input
- **Plus/Minus Buttons**: Fine adjustment controls
- **Direct Text Input**: For precise entry
- **Voice Input**: "Alice scored 15 points"

#### Quick Entry Buttons
- **Common Scores**: 0, 5, 10, 15, 20, 25 (customizable)
- **Clear All**: Reset all entries to 0
- **Last Round**: Copy scores from previous round
- **Batch Entry**: Apply same score to multiple players

### Real-time Calculations
- **New Total**: Instantly shows updated total score
- **Elimination Warning**: Highlights players approaching threshold
- **Progress Indicator**: Shows completion status (4/5 players entered)

### Validation & Error Handling

#### Input Validation
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Score cannot be negative                         │
│ ⚠️ Score seems unusually high (>50). Confirm?      │
│ ⚠️ This will eliminate Charlie. Continue?           │
└─────────────────────────────────────────────────────┘
```

#### Elimination Confirmation
```
┌─────────────────────────────────────────────────────┐
│ 🚨 Player Elimination Alert                        │
│                                                     │
│ Charlie's new total (108) exceeds the limit (100)  │
│                                                     │
│ ┌─────────────┬─────────────────────────────────┐   │
│ │ ↩️ Go Back  │ ✅ Confirm Elimination         │   │
│ └─────────────┴─────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Advanced Input Features

### Batch Operations
```
┌─────────────────────────────────────────────────────┐
│ 🔄 Batch Score Entry                                │
│                                                     │
│ Apply [  10  ] points to:                          │
│ ☑️ Alice    ☑️ Bob    ☐ Charlie    ☐ David        │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │              Apply to Selected                  │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Score History Context
```
┌─────────────────────────────────────────────────────┐
│ Alice - Last 3 Rounds: 8, 12, 5                    │
│ Average: 8.3 | Trend: ↓ Decreasing                 │
└─────────────────────────────────────────────────────┘
```

## Input Methods Comparison

### Method 1: Modal Overlay (Recommended for ≤6 players)
**Pros:**
- All players visible at once
- Quick comparison of scores
- Compact design
- Easy to cancel/modify

**Cons:**
- Limited space for many players
- May feel cramped on small screens

### Method 2: Full Screen (Recommended for 7+ players)
**Pros:**
- More space per player
- Better for complex score entry
- Clearer visual hierarchy
- Room for additional features

**Cons:**
- Requires scrolling for many players
- Less overview of all scores

### Method 3: Stepper Interface (Alternative)
```
┌─────────────────────────────────────────────────────┐
│ Round 4 - Player 2 of 5                            │
│                                                     │
│ ← Alice (5 pts) | Bob | Charlie → David → Eve      │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │                    Bob                          │ │
│ │                Current: 34                      │ │
│ │                                                 │ │
│ │        This Round: [   12   ]                  │ │
│ │                                                 │ │
│ │        New Total: 46                           │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌───────────────┬─────────────────────────────────┐ │
│ │ ← Previous    │              Next →            │ │
│ └───────────────┴─────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Keyboard Shortcuts & Accessibility

### Keyboard Navigation
- **Tab**: Move between input fields
- **Enter**: Confirm current input and move to next
- **Escape**: Cancel and return to dashboard
- **Ctrl+S**: Save round scores
- **Ctrl+Z**: Undo last entry

### Voice Commands
- "Alice 15" → Sets Alice's score to 15
- "Add 5 to Bob" → Adds 5 to Bob's current round score
- "Clear all" → Resets all round scores to 0
- "Save round" → Confirms and saves all entries

### Screen Reader Support
- Clear labels for all input fields
- Announcement of new totals and eliminations
- Progress indicators ("3 of 5 players entered")

## Error Prevention

### Smart Defaults
- **Auto-focus**: First player's input field
- **Tab Order**: Logical progression through players
- **Value Persistence**: Maintain entries if modal is accidentally closed

### Confirmation Patterns
- **High Scores**: Confirm unusual scores (>2x average)
- **Eliminations**: Always confirm player eliminations
- **Zero Scores**: Confirm intentional zero entries
- **Negative Impact**: Warn about scores that significantly hurt player position

## Performance Considerations

### Large Player Groups (8+ players)
- **Pagination**: Show 5-6 players per screen
- **Search/Filter**: Quick find specific players
- **Bulk Actions**: Apply same score to multiple players
- **Auto-save**: Prevent data loss during long entry sessions

### Quick Game Flow
- **One-tap Entry**: Common scores (0, 5, 10, etc.)
- **Gesture Support**: Swipe between players
- **Auto-advance**: Move to next player after entry
- **Batch Completion**: "Apply to all remaining" option
