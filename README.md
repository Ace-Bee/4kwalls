# 4kwalls

**4kwalls** is a next-generation curated wallpaper platform designed for high performance and visual immersion. Built with a Cyberpunk aesthetic in mind, it features glassmorphism effects, neon accents, and interactive WebGL backgrounds, all running at a silky smooth 60 FPS.

## ✨ Key Features

- **Cyberpunk Aesthetics**: A sleek, dark-themed UI with glassmorphism (handled via custom `glass()` utilities) and high-vibrant neon secondary colors.
- **Interactive Background**: A GPGPU particle simulation using `Three.js` and `React Three Fiber`, offering depth of field and interactive reveal animations.
- **Performance First**: 
    - **Low Graphics Mode**: Automatically reduces GPU load by disabling complex blurs and WebGL on low-end devices.
    - **Image Optimization**: Smart thumbnail caching via `wsrv.nl` and optimization for different viewports.
- **Immersive Mode**: Distraction-free wallpaper viewing experience.
- **Social & Community**: User accounts, collections, favorites, and social sharing capabilities.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 & Framer Motion
- **State Management**: TanStack Query v5
- **Backend / Auth**: Supabase (OAuth + Email/OTP)
- **Graphics**: React Three Fiber / Drei
- **Package Manager**: Bun

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun (Recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ace-Bee/4kwalls.git
   cd 4kwalls
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add the following keys:

   | Variable | Description |
   | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role (for admin tasks) |
   | `R2_ENDPOINT` | Cloudflare R2 Endpoint |
   | `R2_ACCESS_KEY_ID` | Cloudflare R2 Access Key ID |
   | `R2_SECRET_ACCESS_KEY` | Cloudflare R2 Secret Access Key |
   | `R2_PUBLIC_URL` | Cloudflare R2 Public Access URL |

4. Run the development server:
   ```bash
   bun dev
   # or
   npm run dev
   ```

   Open http://localhost:3000 with your browser to see the result.

## 📁 Project Structure

```
/app
├── (seo)/              # SEO Utilities
│   ├── robots.ts       # Robots.txt generator
│   └── sitemap.ts      # Sitemap generator
├── favorites/
│   └── page.tsx        # Favorites grid page
├── immersive/
│   └── page.tsx        # Distraction-free wallpaper viewer
├── wallpapers/
│   ├── [id]/
│   │   └── page.tsx    # Individual Wallpaper (Dynamic Route)
│   └── page.tsx        # Main random feed page
├── layout.tsx          # Root layout (JetBrains Mono, Providers)
├── page.tsx            # Landing page (redirects to wallpapers)
└── globals.css         # Tailwind & Global Styles

/components
├── common/
│   ├── AuthModal.tsx       # Unified Sign In/Up Modal
│   ├── SettingsModal.tsx   # Complex Settings
│   ├── Header.tsx          # Navbar & Auth Controls
│   ├── Notifications.tsx   # Custom Toast System
│   └── Sidebar.tsx         # Right Side Navigation
├── home/                   
│   ├── GLBackground.tsx    # Interactive WebGL Particles Background
│   └── Hero.tsx            # Landing Page Hero Section
├── immersive/
│   └── ImmersiveCard.tsx   # Reduced UI Card for Immersive Mode
├── providers/
│   ├── GraphicsProvider.tsx # Manages Low/High graphics settings
│   ├── ThemeProvider.tsx    # Manages Color Accents
│   └── QueryProvider.tsx    # React Query Client Provider
├── wallpapers/
│   ├── Card.tsx            # [Performance Critical] Wallpaper Grid Item
│   ├── DownloadButton.tsx  # Download logic
│   ├── ImageModal.tsx      # Fullscreen detailed viewer
│   ├── RefreshButton.tsx   # Floating Action Button
│   ├── ShareButton.tsx     # Social Sharing
│   ├── FavoriteButton.tsx  # Toggle with optimistic updates
│   └── WallpaperInfo.tsx   # Metadata Tooltip

/lib
├── hooks/
│   ├── auth/
│   │   ├── useAuth.ts      # Supabase Auth Wrapper (Login, Signup, OTP, Updates)
│   │   └── useFavorites.ts # Optimistic Favorites Logic
│   └── useWallpaperStats.ts # Stats Logic
├── constants.ts        # Global configuration
└── supabase.ts         # Supabase Client Definition

/utils
├── auth-actions.ts     # Server Actions for Auth
├── download.ts         # Blob handling & FileSaver logic
├── gl-helpers.ts       # WebGL Shaders & Materials
├── helpers.ts          # CSS utilities & Image Proxies
├── random.ts           # Randomization logic
└── supabase-admin.ts   # Service Role Client (Admin)

/public                 # Static Assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Ace-Bee**
- GitHub: [@Ace-Bee](https://github.com/Ace-Bee)

## 📄 License

Copyright © 2026 [Ace-Bee](https://github.com/Ace-Bee)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
