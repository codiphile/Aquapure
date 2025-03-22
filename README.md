# AquaPure

AquaPure is a community-driven water conservation platform that allows users to report water-related issues such as leakages, pollution, and stagnant water. The platform aims to create awareness and facilitate quick resolution of water conservation issues.

![AquaPure Screenshot](https://placehold.co/600x400?text=AquaPure+Screenshot&font=montserrat)

## Features

- 📍 Location-based reporting with Google Maps integration
- 📱 Responsive design for desktop and mobile devices
- 📷 Image upload for better issue documentation
- 🤖 AI-powered analysis of water issues
- 👥 User authentication and profile management
- 🏆 Reward system for active community members

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Google Maps API key
- Gemini API key (for AI analysis)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/aquapure.git
   cd aquapure
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` with your API keys:

   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
4. Create an API key with appropriate restrictions:
   - For development, add `http://localhost:3000` as an HTTP referrer
   - For production, add your domain

## Project Structure

```
src/
├── app/               # Next.js app router pages
├── components/        # Reusable UI components
├── contexts/          # React context providers
├── lib/               # Utility functions and helpers
├── utils/             # Database and API utilities
│   ├── ai/            # AI analysis utilities
│   ├── db/            # Database connections and schema
│   └── validators/    # Data validation
├── public/            # Static assets
└── styles/            # Global styles
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-rendered applications
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Google Maps API](https://developers.google.com/maps) - Location mapping
- [Gemini API](https://ai.google.dev/docs/gemini_api) - AI analysis of water issues
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Maps and Google AI for their powerful APIs
- All contributors and community members

---

Made with 💧 by Your Team
