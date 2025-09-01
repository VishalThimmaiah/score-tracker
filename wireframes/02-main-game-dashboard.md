# Main Game Dashboard Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ ← 🎮 Evening Card Game    Round 3/20    ⚙️ 📊 📋         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🎯 Target: 100 points | Active: 4/5 players           │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 1. Alice                                      33    │ │
│ │    ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  33%   │ │
│ │    🟢 Safe                                          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 2. Bob                                        34    │ │
│ │    █████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  34%   │ │
│ │    🟡 Caution                                       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 3. Charlie                                    75    │ │
│ │    ██████████████████████████████░░░░░░░░░░░  75%   │ │
│ │    🟠 Warning                                       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 4. David                                     100    │ │
│ │    ████████████████████████████████████████  100%  │ │
│ │    🔴 Eliminated                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 5. Eve                                       101    │ │
│ │    ████████████████████████████████████████  OVER  │ │
│ │    ⚫ Game Over                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                  ➕ Add Round Scores                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────┬───────────────┬───────────────────┐   │
│ │   🔄 Undo     │   ⏸️ Pause    │   🏁 End Game     │   │
│ │   Last Round  │    Game       │                   │   │
│ └───────────────┴───────────────┴───────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Key Features

### Header Section
- **Back Button**: Return to main menu
- **Game Name**: Current session identifier
- **Round Counter**: Current round / estimated total
- **Quick Actions**: Settings, History, Player Management

### Game Status Bar
- **Target Display**: Current elimination threshold
- **Active Players**: Count of players still in game
- **Game Progress**: Visual indicator of game state

### Player Cards (Sorted by Score - Lowest First)
Each player card contains:
- **Rank Number**: Current position (1st, 2nd, etc.)
- **Player Name**: Editable on long press
- **Current Score**: Large, prominent display
- **Progress Bar**: Visual representation of score vs. threshold
- **Status Indicator**: Color-coded status with icon
- **Percentage**: Score as percentage of threshold

### Status Color Coding
- 🟢 **Green (0-25%)**: Safe zone
- 🟡 **Yellow (26-50%)**: Caution zone  
- 🟠 **Orange (51-75%)**: Warning zone
- 🔴 **Red (76-99%)**: Danger zone
- ⚫ **Black (100%+)**: Eliminated/Game Over

### Action Buttons
- **Add Round Scores**: Primary action for score entry
- **Undo Last Round**: Safety feature for corrections
- **Pause Game**: Save current state
- **End Game**: Finish and view final results

## Responsive Behavior

### Mobile Portrait (Primary)
- Single column layout
- Full-width player cards
- Stacked action buttons

### Mobile Landscape / Tablet
```
┌─────────────────────────────────────────────────────────────────────┐
│ ← 🎮 Evening Card Game         Round 3/20         ⚙️ 📊 📋        │
├─────────────────────────────────────────────────────────────────────┤
│ 🎯 Target: 100 | Active: 4/5                                       │
│                                                                     │
│ ┌─────────────────────────┐  ┌─────────────────────────┐           │
│ │ 1. Alice           33   │  │ 2. Bob             34   │           │
│ │ ████████░░░░░░░░░░  33%  │  │ █████████░░░░░░░░░  34%  │           │
│ │ 🟢 Safe                 │  │ 🟡 Caution              │           │
│ └─────────────────────────┘  └─────────────────────────┘           │
│                                                                     │
│ ┌─────────────────────────┐  ┌─────────────────────────┐           │
│ │ 3. Charlie         75   │  │ 4. David          100   │           │
│ │ ██████████████░░░░  75%  │  │ ████████████████  100%  │           │
│ │ 🟠 Warning              │  │ 🔴 Eliminated           │           │
│ └─────────────────────────┘  └─────────────────────────┘           │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                      ➕ Add Round Scores                        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Interactive Elements

### Player Card Actions
- **Tap**: Quick score adjustment (+/- buttons appear)
- **Long Press**: Edit player name or disable player
- **Swipe Left**: Quick eliminate player option
- **Swipe Right**: Quick score reset option

### Progress Bar Features
- **Animated**: Smooth transitions when scores update
- **Gradient**: Color transitions at threshold boundaries
- **Pulsing**: Warning animation when approaching elimination

## Game State Management

### Active Game States
1. **Setup Complete**: Ready for first round
2. **In Progress**: Normal gameplay
3. **Paused**: Game temporarily stopped
4. **Near End**: Only 1-2 players remaining
5. **Completed**: All but one player eliminated

### Eliminated Player Display
- **Grayed Out**: Reduced opacity but still visible
- **Collapsed**: Option to minimize eliminated players
- **Reorder**: Move to bottom of list automatically

## Accessibility Features

### Screen Reader Support
- Clear labels for all interactive elements
- Score announcements on updates
- Status change notifications

### Visual Accessibility
- High contrast mode support
- Large text options
- Color-blind friendly indicators (shapes + colors)

### Motor Accessibility
- Large touch targets (minimum 44px)
- Gesture alternatives for all swipe actions
- Voice input support for score entry
