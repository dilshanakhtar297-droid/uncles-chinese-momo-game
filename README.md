# Uncle's Chinese - Momo Festival Game

A production-ready web game for the Momo Festival campaign by Uncle's Chinese restaurant.

## 🌟 Features

- ✅ Interactive Phaser 3 game with 60-second gameplay
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Firebase Phone Authentication with OTP
- ✅ Firestore real-time database
- ✅ Daily leaderboard with top 10 players
- ✅ Automatic reward generation and coupon codes
- ✅ Admin dashboard for management
- ✅ Premium Chinese restaurant theme
- ✅ Accessible UI with keyboard controls
- ✅ Touch & mouse support
- ✅ Vercel-ready deployment
- ✅ 60 FPS smooth gameplay

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Game Engine**: Phaser 3
- **Authentication**: Firebase Phone Auth
- **Database**: Firestore
- **Deployment**: Vercel
- **Toast Notifications**: React Hot Toast
- **Animations**: Confetti JS

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/dilshanakhtar297-droid/uncles-chinese-momo-game.git
cd uncles-chinese-momo-game
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Phone Authentication
3. Create a Firestore database
4. Copy your Firebase configuration
5. Create `.env.local` file:

```bash
cp .env.example .env.local
```

6. Fill in your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Game Rules

### Duration
- **60 seconds** per game

### Play Frequency
- **One play per phone number every 24 hours**

### Game Items & Points

| Item | Points | Type |
|------|--------|------|
| 🥟 Veg Momo | +10 | Good |
| 🍖 Chicken Momo | +15 | Good |
| ✨ Golden Momo | +50 | Great |
| 🍌 Burnt Momo | -10 | Bad |
| 💥 Chili Bomb | -20 | Bomb |

## 🎁 Reward Tiers

| Score Range | Reward | Type |
|------------|--------|------|
| 100-199 | 10% OFF | Discount |
| 200-299 | ₹50 OFF | Fixed |
| 300-449 | ₹100 OFF | Fixed |
| 450+ | Free 6 Piece Momos | Premium |

## 🎮 Controls

### Desktop
- **Left Arrow** / **A**: Move basket left
- **Right Arrow** / **D**: Move basket right
- **Space**: Pause/Resume
- **Mouse**: Move basket to cursor position

### Mobile
- **Touch**: Move basket to finger position

## 📱 Pages

### Public Pages
- **Home** (`/`) - Landing page with authentication
- **Game** (`/game`) - Interactive game canvas
- **Leaderboard** (`/leaderboard`) - Top 10 daily scores
- **Reward** (`/reward`) - Reward display with coupon

### Admin Pages
- **Admin Dashboard** (`/admin`) - Management panel

## 🔐 Firestore Collections

### players
```typescript
{
  name: string;
  phone: string;
  lastPlayed: Timestamp | null;
  score: number;
  coupon: string;
  reward: string;
  createdAt: Timestamp;
}
```

### leaderboard
```typescript
{
  name: string;
  score: number;
  playerId: string;
  date: Timestamp;
}
```

### coupons
```typescript
{
  couponCode: string;
  reward: string;
  redeemed: boolean;
  playerId: string;
  playerName: string;
  createdAt: Timestamp;
}
```

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Deploy Momo Festival Game"
git push origin main
```

### 2. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### 3. Configure Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.example`
3. Redeploy

## 📊 Admin Dashboard

Access at `/admin` with your configured admin password.

**Features**:
- Total players count
- Today's active players
- Coupons generated & redeemed
- Coupon management
- Mark coupons as redeemed
- Real-time leaderboard

## 🎨 Customization

### Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: '#D62828',    // Red
  secondary: '#FFD166',  // Yellow
  accent: '#FFF5E1',     // Cream
  dark: '#2B2B2B',       // Dark
}
```

### Restaurant Details

Edit `components/Footer.tsx`:
- Phone number
- Email
- Location
- Hours

### Game Settings

Edit `lib/phaser/GameScene.ts`:
- Game duration (60 seconds)
- Item spawn rate
- Physics settings
- Point values

## ✅ Performance

- ✅ Dynamic imports for Phaser
- ✅ Image optimization
- ✅ Lazy loading components
- ✅ 60 FPS gameplay
- ✅ Optimized asset loading
- ✅ No unnecessary re-renders

## ♿ Accessibility

- ✅ Keyboard controls
- ✅ Large touch targets (48px+)
- ✅ High contrast colors
- ✅ Screen reader friendly
- ✅ Mobile-first design
- ✅ Semantic HTML

## 🔒 Security

- ✅ Firebase Phone OTP verification
- ✅ Strict Firestore security rules
- ✅ User-specific data access
- ✅ Admin password protection
- ✅ Environment variable configuration

## 📁 Project Structure

```
uncles-chinese-momo-game/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── game/
│   │   └── page.tsx
│   ├── leaderboard/
│   │   └── page.tsx
│   ├── reward/
│   │   └── page.tsx
│   └── admin/
│       └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── LandingPage.tsx
│   ├── GameCanvas.tsx
│   ├── LoadingSpinner.tsx
│   ├── AlreadyPlayedModal.tsx
│   ├── RewardCard.tsx
│   ├── AuthFlow.tsx
│   └── auth/
│       ├── NameInput.tsx
│       ├── PhoneInput.tsx
│       └── OTPVerification.tsx
├── firebase/
│   └── config.ts
├── lib/
│   └── phaser/
│       └── GameScene.ts
├── types/
│   └── index.ts
├── styles/
│   └── globals.css
├── public/
│   ├── audio/
│   ├── images/
│   └── icons/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .env.example
├── .env.local
├── vercel.json
├── firebase.json
├── firestore.rules
└── README.md
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📝 License

Copyright © 2024 Uncle's Chinese. All rights reserved.

## 💬 Support

For issues or questions, please create an issue on GitHub.

## 🎯 Next Steps

1. Configure Firebase credentials
2. Update restaurant details in Footer
3. Customize colors in Tailwind config
4. Add audio files to `/public/audio/`
5. Deploy to Vercel
6. Share with your audience!

---

**Built with ❤️ for Uncle's Chinese**
