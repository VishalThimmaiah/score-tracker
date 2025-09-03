# Game Score Tracker - Test Suite Documentation

## Overview

This directory contains comprehensive test suites for the Game Score Tracker application, focusing on complex logic validation and edge case coverage to support safe refactoring of if-else statements.

## Test Structure

### Complex Logic Edge Cases (`complex-logic/`)

**File**: `complex-logic-edge-cases.test.ts`
**Status**: ✅ All 25 tests passing
**Purpose**: Comprehensive validation of complex business logic before refactoring

#### Test Coverage Areas

1. **Game Type Switching Logic (setGameType)** - 3 tests
   - Custom settings preservation when switching FROM custom
   - Custom settings restoration when switching TO custom  
   - Transitions between predefined game types

2. **Winner Calculation Logic (getWinners)** - 4 tests
   - All players eliminated in points-based games
   - Single active player scenarios
   - Tie scenarios in rounds-based games
   - Game-in-progress validation

3. **Round Score Processing (addRoundScores)** - 4 tests
   - Elimination threshold exactly reached
   - All players eliminated simultaneously
   - Max rounds reached in rounds-based games
   - Game state transitions

4. **Next Picker Calculation** - 3 tests
   - All players eliminated scenarios
   - Picker rotation with eliminated players
   - Circular wraparound logic

5. **Player Management (removePlayer)** - 3 tests
   - Removing current picker
   - Removing last player when current picker
   - Removing player before current picker

6. **Dealer Calculation Logic (calculateDealerIndex)** - 4 tests
   - Picker at index 0 (wraparound)
   - All players except picker eliminated
   - Empty player list handling
   - Single player scenarios

7. **Game Settings Validation** - 4 tests
   - Elimination score validation in points-based games
   - Max rounds validation in rounds-based games
   - Elimination score ignored in rounds-based games
   - Validation behavior when switching game modes

#### Key Testing Patterns

- **State Management**: All tests use proper Zustand store state management with `useGameStore.getState()` and fresh state retrieval after operations
- **Parameter Format**: Tests use correct `addRoundScores` format with `{ playerId: string, score: number }[]`
- **Edge Case Focus**: Tests specifically target boundary conditions, simultaneous events, and error scenarios
- **Behavioral Validation**: Tests validate actual store behavior rather than UI validation logic

## Integration Test Plan for Refactoring

### Pre-Refactoring Validation ✅

- [x] **Baseline Test Suite**: 25 comprehensive edge case tests covering all complex logic areas
- [x] **100% Test Pass Rate**: All tests passing before refactoring begins
- [x] **Edge Case Documentation**: Detailed documentation of 25+ edge cases in `COMPLEX-LOGIC-EDGE-CASES.md`

### Refactoring Safety Net

The comprehensive test suite provides:

1. **Regression Detection**: Any breaking changes during refactoring will be immediately detected
2. **Behavioral Preservation**: Tests ensure that complex business logic behavior remains unchanged
3. **Edge Case Protection**: Critical edge cases are protected against regression
4. **Confidence in Changes**: Developers can refactor with confidence knowing tests will catch issues

### Recommended Refactoring Approach

1. **Phase 1**: Strategy Pattern for Game Type Logic
   - Run tests after each game type extraction
   - Ensure `setGameType` behavior remains identical

2. **Phase 2**: Polymorphism for Winner Calculation
   - Run tests after each winner calculation refactor
   - Ensure `getWinners` behavior remains identical

3. **Phase 3**: Guard Clauses for Validation
   - Run tests after each validation refactor
   - Ensure validation logic behavior remains identical

4. **Phase 4**: Configuration-Driven Approach
   - Run tests after configuration extraction
   - Ensure all game settings behavior remains identical

### Test Execution Commands

```bash
# Run all complex logic edge case tests
pnpm vitest run src/__tests__/complex-logic/complex-logic-edge-cases.test.ts --reporter=verbose

# Run tests in watch mode during refactoring
pnpm vitest src/__tests__/complex-logic/complex-logic-edge-cases.test.ts --watch

# Run all tests
pnpm vitest run --reporter=verbose
```

## Test Development Guidelines

### Adding New Tests

1. Follow the existing test structure with proper `describe` blocks
2. Use `beforeEach(() => useGameStore.getState().resetGame())` for clean state
3. Get fresh state after each store operation: `store = useGameStore.getState()`
4. Use proper parameter formats for store methods
5. Test actual store behavior, not UI validation logic

### Test Naming Convention

- Use descriptive test names starting with "should"
- Include the specific scenario being tested
- Group related tests in logical `describe` blocks

### State Management in Tests

```typescript
// ✅ Correct pattern
let store = useGameStore.getState()
store.addPlayer('Alice')
store = useGameStore.getState() // Get fresh state
expect(store.players).toHaveLength(1)

// ❌ Incorrect pattern
const store = useGameStore.getState()
store.addPlayer('Alice')
expect(store.players).toHaveLength(1) // May use stale state
```

## Integration with CI/CD

These tests serve as a safety net for:
- Pull request validation
- Pre-deployment checks
- Refactoring confidence
- Regression prevention

The comprehensive edge case coverage ensures that complex business logic remains stable throughout the refactoring process.
