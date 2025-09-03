# Complex Logic Edge Cases - Test Specifications

This document outlines the critical edge cases for the complex logic areas in the Game Score Tracker, structured for minimal but comprehensive unit testing.

## 1. Game Type Switching Logic (`setGameType`)

### Test Case 1.1: Preserve Custom Settings When Switching FROM Custom
**Setup:**
- Game type: 'custom'
- Custom settings: eliminationScore=150, gameMode='points-based', maxRounds=5
- Current settings match custom settings

**Action:** 
- Switch to '5-cards'

**Expected Result:**
- Game type becomes '5-cards'
- Current settings: gameMode='points-based', eliminationScore=100, maxRounds=undefined
- Custom settings preserved: customEliminationScore=150, customGameMode='points-based', customMaxRounds=5

### Test Case 1.2: Restore Custom Settings When Switching TO Custom
**Setup:**
- Game type: '5-cards' 
- Custom settings: customEliminationScore=200, customGameMode='rounds-based', customMaxRounds=10
- Current settings: eliminationScore=100, gameMode='points-based'

**Action:**
- Switch to 'custom'

**Expected Result:**
- Game type becomes 'custom'
- Current settings restored: eliminationScore=200, gameMode='rounds-based', maxRounds=10
- Custom settings unchanged

### Test Case 1.3: Handle Transitions Between Predefined Types
**Setup:**
- Game type: '5-cards'
- Custom settings: customEliminationScore=150, customGameMode='points-based'

**Action:**
- Switch to 'secret-7'

**Expected Result:**
- Game type becomes 'secret-7'
- Current settings: gameMode='rounds-based', maxRounds=7
- Custom settings unchanged (not affected by predefined type switches)

## 2. Winner Calculation Logic (`getWinners`)

### Test Case 2.1: All Players Eliminated in Points-Based
**Setup:**
- Game mode: 'points-based'
- Game status: 'finished'
- Players: [
  - Alice: totalScore=105, isEliminated=true
  - Bob: totalScore=110, isEliminated=true
  - Charlie: totalScore=105, isEliminated=true
]

**Action:**
- Call getWinners()

**Expected Result:**
- Returns [Alice, Charlie] (both have lowest score of 105)

### Test Case 2.2: Single Active Player in Points-Based
**Setup:**
- Game mode: 'points-based'
- Game status: 'finished'
- Players: [
  - Alice: totalScore=105, isEliminated=true
  - Bob: totalScore=80, isEliminated=false
  - Charlie: totalScore=110, isEliminated=true
]

**Action:**
- Call getWinners()

**Expected Result:**
- Returns [Bob] (only active player)

### Test Case 2.3: Tie Scenario in Rounds-Based
**Setup:**
- Game mode: 'rounds-based'
- Game status: 'finished'
- Players: [
  - Alice: totalScore=50, isEliminated=false
  - Bob: totalScore=50, isEliminated=false
  - Charlie: totalScore=60, isEliminated=false
]

**Action:**
- Call getWinners()

**Expected Result:**
- Returns [Alice, Bob] (both have lowest score of 50)

### Test Case 2.4: Game Not Finished
**Setup:**
- Game status: 'playing'
- Players with various scores

**Action:**
- Call getWinners()

**Expected Result:**
- Returns [] (empty array)

## 3. Round Score Processing (`addRoundScores`)

### Test Case 3.1: Elimination Threshold Exactly Reached
**Setup:**
- Game mode: 'points-based', eliminationScore: 100
- Player: Alice with totalScore=95, isEliminated=false

**Action:**
- Add round score: 5 (total becomes exactly 100)

**Expected Result:**
- Alice: totalScore=100, isEliminated=true
- Game continues if other active players remain

### Test Case 3.2: All Players Eliminated Simultaneously
**Setup:**
- Game mode: 'points-based', eliminationScore: 100
- Players: Alice=95, Bob=98, Charlie=97 (all active)

**Action:**
- Add round scores: [10, 5, 8] (all reach/exceed 100)

**Expected Result:**
- All players: isEliminated=true
- Game status: 'finished'
- Next picker index still valid (0-2 range)

### Test Case 3.3: Max Rounds Reached in Rounds-Based
**Setup:**
- Game mode: 'rounds-based', maxRounds: 3
- Current round: 3
- Players with various scores

**Action:**
- Add round scores (this would be round 4)

**Expected Result:**
- Current round: 4
- Game status: 'finished' (exceeded maxRounds)

### Test Case 3.4: Game State Transition
**Setup:**
- Game mode: 'points-based'
- Game status: 'playing'
- Two players: one active, one near elimination

**Action:**
- Add scores that eliminate the last active player

**Expected Result:**
- Game status changes from 'playing' to 'finished'
- Current round incremented
- Picker index updated

## 4. Next Picker Calculation (within `addRoundScores`)

### Test Case 4.1: All Players Eliminated
**Setup:**
- Game mode: 'points-based'
- Current picker index: 1
- All players become eliminated after score addition

**Action:**
- Calculate next picker

**Expected Result:**
- Returns valid index (0-2 range)
- Index follows circular rotation rules

### Test Case 4.2: Picker Rotation with Eliminated Players
**Setup:**
- Game mode: 'points-based'
- Players: [Active, Eliminated, Active, Eliminated]
- Current picker index: 0

**Action:**
- Calculate next picker

**Expected Result:**
- Returns index 2 (skips eliminated player at index 1)

### Test Case 4.3: Circular Wraparound
**Setup:**
- Game mode: 'points-based'
- Players: [Eliminated, Eliminated, Active]
- Current picker index: 2 (last player)

**Action:**
- Calculate next picker

**Expected Result:**
- Returns index 2 (only active player, stays same)

## 5. Player Management (`removePlayer`)

### Test Case 5.1: Remove Current Picker
**Setup:**
- Players: [Alice, Bob, Charlie]
- Current picker index: 1 (Bob)

**Action:**
- Remove Bob

**Expected Result:**
- Players: [Alice, Charlie]
- Current picker index: 1 (now points to Charlie)
- If index >= players.length, wraps to 0

### Test Case 5.2: Remove Last Player When Current Picker
**Setup:**
- Players: [Alice, Bob, Charlie]
- Current picker index: 2 (Charlie)

**Action:**
- Remove Charlie

**Expected Result:**
- Players: [Alice, Bob]
- Current picker index: 0 (wraps to beginning)

### Test Case 5.3: Remove Player Before Current Picker
**Setup:**
- Players: [Alice, Bob, Charlie]
- Current picker index: 2 (Charlie)

**Action:**
- Remove Alice (index 0)

**Expected Result:**
- Players: [Bob, Charlie]
- Current picker index: 1 (decremented to maintain Charlie as picker)

## 6. Dealer Calculation Logic (`calculateDealerIndex`)

### Test Case 6.1: Picker at Index 0
**Setup:**
- Players: [Alice, Bob, Charlie]
- Picker index: 0 (Alice)
- All players active

**Action:**
- Calculate dealer index

**Expected Result:**
- Returns index 2 (Charlie - wraps to last player)

### Test Case 6.2: All Players Except Picker Eliminated
**Setup:**
- Players: [Alice(eliminated), Bob(active), Charlie(eliminated)]
- Picker index: 1 (Bob)

**Action:**
- Calculate dealer index

**Expected Result:**
- Returns index 1 (Bob - picker becomes dealer when no other active players)

### Test Case 6.3: Empty Player List
**Setup:**
- Players: []
- Picker index: 0

**Action:**
- Calculate dealer index

**Expected Result:**
- Returns 0 (safe fallback)

### Test Case 6.4: Single Player
**Setup:**
- Players: [Alice]
- Picker index: 0

**Action:**
- Calculate dealer index

**Expected Result:**
- Returns 0 (Alice is both picker and dealer)

## 7. Game Settings Validation

### Test Case 7.1: Elimination Score Zero in Points-Based
**Setup:**
- Game mode: 'points-based'
- Elimination score input: 0

**Action:**
- Validate settings

**Expected Result:**
- isValidEliminationScore() returns false
- isValidGameSettings() returns false
- Start game button disabled

### Test Case 7.2: Max Rounds Zero in Rounds-Based
**Setup:**
- Game mode: 'rounds-based'
- Max rounds: 0

**Action:**
- Validate settings

**Expected Result:**
- isValidGameSettings() returns false
- Start game button disabled

### Test Case 7.3: Elimination Score Ignored in Rounds-Based
**Setup:**
- Game mode: 'rounds-based'
- Elimination score: 0 (should be ignored)
- Max rounds: 5

**Action:**
- Validate settings

**Expected Result:**
- isValidEliminationScore() returns true (ignored for rounds-based)
- isValidGameSettings() returns true
- Start game button enabled

### Test Case 7.4: Mode Switch Validation Update
**Setup:**
- Game mode: 'points-based'
- Elimination score: 0 (invalid)
- Settings currently invalid

**Action:**
- Switch to 'rounds-based' mode
- Set max rounds: 5

**Expected Result:**
- Validation state updates
- Settings become valid
- Start game button enabled

## Implementation Notes

### Test Structure
Each test should follow this pattern:
```typescript
describe('Complex Logic Area', () => {
  beforeEach(() => {
    // Reset store state
  })
  
  it('should handle specific edge case', () => {
    // Setup
    // Action  
    // Assert expected result
  })
})
```

### Minimal Coverage Strategy
- Focus on boundary conditions and state transitions
- Test one edge case per test function
- Use descriptive test names that match the edge case
- Avoid redundant tests that cover the same logic paths
- Prioritize tests that catch the most critical bugs

### Test Data
- Use minimal but realistic test data
- Focus on the specific edge case being tested
- Avoid complex setup that obscures the test intent
