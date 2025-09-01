# Game Settings Screen Wireframe

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ ← ⚙️ Game Settings                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🎮 Current Game: Evening Card Game                      │
│ Status: Round 3/20 | Active Players: 4/5               │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎯 Game Rules                                       │ │
│ │                                                     │ │
│ │ Elimination Threshold: [100] points                 │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ Quick Presets: 50 | 75 | 100 | 150 | 200       │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ Game Type: [5 Cards ▼]                             │ │
│ │ • 5 Cards (Show when < 5 points)                   │ │
│ │ • Secret 7                                         │ │
│ │ • Rummy                                            │ │
│ │ • Custom Game                                      │ │
│ │                                                     │ │
│ │ ⚠️ Changes affect current game                      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔄 Game Management                                  │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🔄 Reset Current Game                           │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🗑️ Clear All Scores                             │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 💾 Save Game Template                           │ │ │ (NOT NEEDED)
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📤 Export Game Data                             │ │ │(NOT NEEDED)
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📱 App Preferences                                  │ │
│ │                                                     │ │
│ │ Theme: [🌙 Dark] [☀️ Light] [🔄 Auto]              │ │
│ │                                                     │ │
│ │ Sound Effects: [🔊 On] [🔇 Off]                    │ │(NOT NEEDED)
│ │                                                     │ │
│ │ Notifications: [🔔 Enabled] [🔕 Disabled]          │ │(NOT NEEDED)
│ │                                                     │ │
│ │ Auto-save: [✅ Every round] [⏰ Every 5 min]       │ │(WE need to save on every update on points)
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Advanced Settings Panel

```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Advanced Settings                                    │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎮 Gameplay Options                                 │ │
│ │                                                     │ │
│ │ ☑️ Allow negative scores                            │ │
│ │ ☑️ Show elimination warnings                        │ │
│ │ ☑️ Auto-sort players by score                       │ │
│ │ ☐ Hide eliminated players                           │ │
│ │ ☑️ Confirm high scores (>50 points)                 │ │
│ │                                                     │ │
│ │ Round Timer: [⏰ Off] [5 min] [10 min] [Custom]    │ │
│ │                                                     │ │
│ │ Score Entry Method:                                 │ │
│ │ ○ Modal overlay (recommended)                       │ │
│ │ ○ Full screen entry                                 │ │
│ │ ○ Inline editing                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📊 Display Options                                  │ │
│ │                                                     │ │
│ │ Progress Bar Style:                                 │ │
│ │ ○ Filled bars (current)                             │ │
│ │ ○ Gradient bars                                     │ │
│ │ ○ Segmented bars                                    │ │
│ │                                                     │ │
│ │ Color Scheme:                                       │ │
│ │ ○ Traffic light (Green→Red)                         │ │
│ │ ○ Heat map (Blue→Red)                               │ │
│ │ ○ Monochrome                                        │ │
│ │ ○ Custom colors                                     │ │
│ │                                                     │ │
│ │ ☑️ Show percentages on progress bars                │ │
│ │ ☑️ Display round numbers                            │ │
│ │ ☑️ Show player rankings                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Data Management Settings

```
┌─────────────────────────────────────────────────────────┐
│ 💾 Data & Storage                                       │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📊 Storage Usage                                    │ │
│ │                                                     │ │
│ │ Current Games: 3 games (2.1 MB)                    │ │
│ │ Game History: 47 games (15.3 MB)                   │ │
│ │ Player Data: 23 players (0.8 MB)                   │ │
│ │ Total Usage: 18.2 MB                               │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🧹 Clean Up Storage                             │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ☁️ Backup & Sync                                    │ │(NOT NEEDED)
│ │                                                     │ │
│ │ Auto Backup: [✅ Enabled] [🔄 Every game]          │ │
│ │ Last Backup: Dec 30, 2024 10:15 PM                 │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📤 Backup Now                                   │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📥 Restore from Backup                          │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ Cloud Storage: [Google Drive] [iCloud] [Dropbox]   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📤 Import/Export                                    │ │(NOT NEEDED)
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📥 Import Game Data                             │ │ │
│ │ │ Formats: JSON, CSV, XML                         │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📤 Export All Data                              │ │ │
│ │ │ Include: Games, Players, Settings               │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Reset Game Confirmation

```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Reset Current Game                                   │
│                                          ✕             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ⚠️ Are you sure you want to reset the current game?     │
│                                                         │
│ This will:                                              │
│ • Clear all scores for all players                      │
│ • Reset round counter to 0                              │
│ • Keep player names and settings                        │
│ • Cannot be undone                                      │
│                                                         │
│ Current game progress:                                  │
│ • 3 rounds completed                                    │
│ • 5 players with scores                                 │
│ • 1 player eliminated                                   │
│                                                         │
│ Reset options:                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ○ Soft reset (keep players, clear scores)           │ │
│ │ ○ Full reset (remove all players and scores)        │ │
│ │ ○ New game (save current, start fresh)              │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────┬─────────────────────────────────────┐ │
│ │   ↩️ Cancel   │      🔄 Confirm Reset              │ │
│ └───────────────┴─────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Custom Game Rules Setup (NOT NEEDED)

```
┌─────────────────────────────────────────────────────────┐
│ 🎮 Custom Game Rules                                    │
│                                          ✕             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Rule Set Name:                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Friday Night Special              ]                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎯 Elimination Rules                                │ │
│ │                                                     │ │
│ │ Elimination Type:                                   │ │
│ │ ○ Fixed threshold (e.g., 100 points)               │ │
│ │ ○ Relative threshold (e.g., 2x average)            │ │
│ │ ○ Last player standing                              │ │
│ │ ○ Time-based (e.g., 2 hours)                       │ │
│ │                                                     │ │
│ │ Threshold: [100] points                            │ │
│ │ ☑️ Allow players to continue after elimination     │ │
│ │ ☐ Sudden death mode (one high score = out)         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔢 Scoring Rules                                    │ │
│ │                                                     │ │
│ │ Score Range: [0] to [50] points per round          │ │
│ │ ☑️ Allow negative scores                            │ │
│ │ ☐ Bonus points for low scores                       │ │
│ │ ☐ Penalty multiplier for high scores               │ │
│ │                                                     │ │
│ │ Special Rules:                                      │ │
│ │ ☐ Double points on round 10                        │ │
│ │ ☐ Immunity round (no elimination)                   │ │
│ │ ☐ Catch-up bonus for last place                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌───────────────┬─────────────────────────────────────┐ │
│ │   ↩️ Cancel   │         💾 Save Rules              │ │
│ └───────────────┴─────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Accessibility Settings (NOT NEEDED)

```
┌─────────────────────────────────────────────────────────┐
│ ♿ Accessibility Options                                │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 👁️ Visual Accessibility                             │ │
│ │                                                     │ │
│ │ Text Size: [Small] [Medium] [Large] [Extra Large]  │ │
│ │                                                     │ │
│ │ ☑️ High contrast mode                               │ │
│ │ ☑️ Color-blind friendly colors                      │ │
│ │ ☑️ Bold text for scores                             │ │
│ │ ☐ Reduce motion and animations                      │ │
│ │                                                     │ │
│ │ Progress Bar Style:                                 │ │
│ │ ○ Colors only                                       │ │
│ │ ○ Patterns + colors (recommended)                   │ │
│ │ ○ Text labels only                                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔊 Audio Accessibility                              │ │
│ │                                                     │ │
│ │ ☑️ Screen reader support                            │ │
│ │ ☑️ Audio feedback for actions                       │ │
│ │ ☑️ Score announcements                              │ │
│ │ ☐ Elimination alerts                                │ │
│ │                                                     │ │
│ │ Voice Commands: [🎤 Enabled] [🔇 Disabled]         │ │
│ │                                                     │ │
│ │ Audio Cues Volume: ▁▂▃▄▅▆▇█                       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🖱️ Motor Accessibility                              │ │
│ │                                                     │ │
│ │ Touch Target Size:                                  │ │
│ │ ○ Standard (44px)                                   │ │
│ │ ○ Large (56px)                                      │ │
│ │ ○ Extra Large (72px)                                │ │
│ │                                                     │ │
│ │ ☑️ Gesture alternatives                             │ │
│ │ ☑️ Keyboard navigation                              │ │
│ │ ☐ Sticky drag (easier swiping)                     │ │
│ │ ☑️ Confirmation for destructive actions             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Notification Settings (NOT NEEDED)

```
┌─────────────────────────────────────────────────────────┐
│ 🔔 Notification Preferences                             │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📱 Push Notifications                               │ │
│ │                                                     │ │
│ │ ☑️ Game reminders                                   │ │
│ │ ☑️ Player elimination alerts                        │ │
│ │ ☑️ Round completion                                 │ │
│ │ ☐ Daily game summary                                │ │
│ │ ☐ Weekly statistics                                 │ │
│ │                                                     │ │
│ │ Quiet Hours: [10:00 PM] to [8:00 AM]               │ │
│ │ ☑️ Respect device Do Not Disturb                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔊 In-App Alerts                                    │ │
│ │                                                     │ │
│ │ ☑️ Score entry confirmations                        │ │
│ │ ☑️ Elimination warnings                             │ │
│ │ ☑️ Game milestone celebrations                       │ │
│ │ ☐ Round timer alerts                                │ │
│ │                                                     │ │
│ │ Alert Style:                                        │ │
│ │ ○ Banner (top of screen)                            │ │
│ │ ○ Modal (center overlay)                            │ │
│ │ ○ Toast (bottom notification)                       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📧 Email Notifications                              │ │
│ │                                                     │ │
│ │ Email: [user@example.com              ]            │ │
│ │                                                     │ │
│ │ ☐ Game completion summaries                         │ │
│ │ ☐ Weekly game statistics                            │ │
│ │ ☐ Monthly player rankings                           │ │
│ │ ☑️ Data backup confirmations                        │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Privacy & Security Settings (NOT NEEDED)

```
┌─────────────────────────────────────────────────────────┐
│ 🔒 Privacy & Security                                   │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🛡️ Data Privacy                                     │ │
│ │                                                     │ │
│ │ ☑️ Keep data local only                             │ │
│ │ ☐ Allow anonymous usage analytics                   │ │
│ │ ☐ Share crash reports                               │ │
│ │ ☑️ Encrypt local data                               │ │
│ │                                                     │ │
│ │ Data Retention:                                     │ │
│ │ ○ Keep forever                                      │ │
│ │ ○ Delete after 1 year                              │ │
│ │ ○ Delete after 6 months                            │ │
│ │ ○ Ask before deleting                               │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔐 Security Options                                 │ │
│ │                                                     │ │
│ │ App Lock: [🔓 Disabled] [📱 Biometric] [🔢 PIN]    │ │
│ │                                                     │ │
│ │ ☑️ Auto-lock after 5 minutes                        │ │
│ │ ☑️ Require authentication for exports               │ │
│ │ ☐ Hide app content in task switcher                │ │
│ │                                                     │ │
│ │ Backup Encryption: [🔒 Enabled] [🔓 Disabled]      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🗑️ Data Management                                  │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🧹 Clear All Game Data                          │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📤 Export My Data                               │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🗑️ Delete Account & Data                        │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## About & Help Section (NOT NEEDED)

```
┌─────────────────────────────────────────────────────────┐
│ ℹ️ About & Support                                      │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📱 App Information                                  │ │
│ │                                                     │ │
│ │ Game Score Tracker                                  │ │
│ │ Version 2.1.0 (Build 2024.12.30)                   │ │
│ │ Last Updated: Dec 30, 2024                          │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🔄 Check for Updates                            │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📚 Help & Support                                   │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📖 User Guide                                   │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ ❓ Frequently Asked Questions                   │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🐛 Report a Bug                                 │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 💡 Suggest a Feature                            │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📧 Contact Support                              │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⚖️ Legal                                            │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📄 Terms of Service                             │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 🔒 Privacy Policy                               │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 📜 Open Source Licenses                         │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Quick Settings Panel (Overlay) (NOT NEEDED)

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Quick Settings                            ✕          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🎯 Threshold: [100] ⊖ ⊕                                │
│                                                         │
│ 🔊 Sound: [🔊 On] [🔇 Off]                             │
│                                                         │
│ 🌙 Theme: [☀️ Light] [🌙 Dark] [🔄 Auto]               │
│                                                         │
│ 📊 Sort: [🔢 Score] [🔤 Name] [⏰ Join Order]          │
│                                                         │
│ ⚠️ Warnings: [✅ On] [❌ Off]                           │
│                                                         │
│ 💾 Auto-save: [✅ On] [❌ Off]                          │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                   Apply Changes                     [ERROR] Failed to process stream: aborted
