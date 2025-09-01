# Game Score Tracker

A modern, responsive web application for tracking scores in card games like 5 Cards, Secret 7, and custom variants. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Multi-Game Support**: Track scores for various card games including 5 Cards, Secret 7, and custom variants
- **Player Management**: Add 2-8 players with customizable elimination scores
- **Real-time Scoring**: Live score updates with player elimination tracking
- **Game History**: View complete game history with round-by-round breakdowns
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with shadcn/ui components
- **Error Handling**: Robust error boundaries for production reliability
- **SEO Optimized**: Complete metadata and Open Graph tags for social sharing

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **State Management**: Zustand for game state
- **Icons**: Lucide React
- **Notifications**: Sonner for toast notifications
- **Build Tool**: Turbopack for fast development and builds

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd game-score-tracker
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Game Rules Supported

### 5 Cards
- Players start with 5 cards
- Score points based on card combinations
- First player to reach elimination score is out
- Last player standing wins

### Secret 7
- Strategic card game with hidden objectives
- Points accumulated over multiple rounds
- Elimination-based gameplay

### Custom Variants
- Configurable elimination scores
- Flexible player count (2-8 players)
- Adaptable to house rules

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── GameSetup.tsx     # Game configuration
│   ├── GameDashboard.tsx # Main game interface
│   ├── GameHistory.tsx   # Game history view
│   ├── PlayerCard.tsx    # Player score display
│   ├── ScoreEntryModal.tsx # Score input modal
│   └── ErrorBoundary.tsx # Error handling
├── lib/                  # Utilities
│   └── utils.ts          # Helper functions
└── store/                # State management
    └── gameStore.ts      # Zustand store
```

## Development

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured with Next.js recommended rules
- **Prettier**: Code formatting (via editor integration)
- **Error Boundaries**: Production-ready error handling

### Performance

- **Static Generation**: Pages pre-rendered at build time
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component for optimized loading
- **Bundle Analysis**: Optimized bundle size (158kB First Load JS)

## Deployment

The application is optimized for deployment on:

- **Vercel** (recommended): Zero-config deployment
- **Netlify**: Static site hosting
- **Docker**: Containerized deployment
- **Traditional hosting**: Static export support

### Environment Variables

For production deployment, set:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js and modern web technologies.
