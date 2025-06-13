# dot.

A modern, privacy-focused period tracking application built with Next.js, React, and TypeScript. Track your menstrual cycle, predict upcoming periods, and monitor your health data—all stored locally on your device.

## Features

- 📅 **Interactive Calendar**: Visual period tracking with an intuitive calendar interface
- 📊 **Cycle Statistics**: Track cycle length, current cycle day, and days since last period
- 🔮 **Period Prediction**: Smart predictions for your next period based on historical data
- 📱 **Progressive Web App**: Install on your device for a native app experience
- 🔒 **Privacy First**: All data stored locally on your device—no cloud storage or data sharing
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS and Radix UI components
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/paulbgtr/dot.
cd dot.
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Tracking Your Period

1. **Log Today**: Use the floating action button to quickly log today's period data
2. **Calendar View**: Click on any date in the calendar to add or edit period information
3. **Flow Tracking**: Record your flow intensity (light, medium, heavy)
4. **Symptoms**: Track symptoms like cramps, mood changes, and other health indicators

### Understanding Your Data

- **Days Since Last Period**: Shows how many days have passed since your last recorded period
- **Next Period Prediction**: Estimates when your next period will start based on your cycle history
- **Current Cycle Day**: Shows which day you're currently on in your cycle

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **PWA**: next-pwa for offline functionality
- **Date Handling**: date-fns
- **Build Tool**: Turbopack for fast development

## Project Structure

```
dot./
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # Reusable UI components
├── lib/                  # Utility functions and storage
└── public/              # Static assets
```

## Data Storage

This app uses local browser storage to keep your data private and secure. Your period tracking data never leaves your device and is not sent to any servers.

### Storage Structure

- **Profile Data**: Basic settings like average cycle length
- **Period Days**: Daily flow and symptom data
- **Cycles**: Cycle start/end dates and statistics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test your changes across different screen sizes
4. Ensure accessibility standards are met

## Privacy & Security

- ✅ All data stored locally in your browser
- ✅ No user accounts or registration required
- ✅ No data collection or analytics
- ✅ No third-party data sharing
- ✅ Works offline after initial load

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/paulbgtr/dot./issues) on GitHub.

---

**Note**: This app is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult with your healthcare provider for medical concerns.
