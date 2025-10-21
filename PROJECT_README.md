# GYMBROS - Fitness Tracking & Social Competition Platform

A modern fitness tracking application built with React, TypeScript, and Supabase that enables users to log workouts, monitor progression, and compete with friends through group challenges and leaderboards.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login with email verification
- **Exercise Logging**: Track workouts with detailed information (weight, sets, reps, notes)
- **Group Management**: Create groups, invite members, and track collective progress
- **Competitive Leaderboards**: Compare stats with friends and view group rankings
- **Progress Analytics**: View personal statistics and track fitness journey
- **Real-time Updates**: Live updates using Supabase Realtime

### User Roles
- **Registered User**: Log exercises, join groups, view statistics
- **Group Admin**: Manage group settings, invite/remove members, delete groups

## Tech Stack

### Frontend
- **React 18+** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **date-fns** - Date manipulation
- **Recharts** - Data visualization

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Authentication
  - Real-time subscriptions
  - Storage (profile pictures, group images)
  - Edge Functions (notifications, calculations)

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── forms/            # Form components
├── pages/
│   ├── auth/             # Authentication pages
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── dashboard/        # Dashboard page
│   ├── exercises/        # Exercise management
│   ├── groups/           # Group management
│   └── profile/          # User profile
├── store/
│   ├── slices/           # Redux slices
│   │   ├── authSlice.ts
│   │   ├── exercisesSlice.ts
│   │   └── groupsSlice.ts
│   └── store.ts          # Redux store configuration
├── services/
│   └── supabase.ts       # Supabase client configuration
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── styles/               # Global styles
│   └── index.css
└── assets/               # Static assets

```

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm 9+
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   cd gymbros-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**

   Run the following SQL in your Supabase SQL editor to create the necessary tables:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     email TEXT UNIQUE NOT NULL,
     name TEXT NOT NULL,
     profile_picture_url TEXT,
     weight_unit_preference TEXT CHECK (weight_unit_preference IN ('kg', 'lbs')) DEFAULT 'kg',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Exercises table
   CREATE TABLE exercises (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     date DATE NOT NULL,
     exercise_name TEXT NOT NULL,
     type TEXT CHECK (type IN ('machine', 'free')) NOT NULL,
     weight DECIMAL NOT NULL,
     weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')) NOT NULL,
     sets INTEGER NOT NULL,
     reps JSONB NOT NULL,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Groups table
   CREATE TABLE groups (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     goal TEXT NOT NULL,
     cover_image_url TEXT,
     created_by UUID REFERENCES users(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Group members table
   CREATE TABLE group_members (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
     joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(group_id, user_id)
   );

   -- Group invitations table
   CREATE TABLE group_invitations (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
     email TEXT NOT NULL,
     status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
   ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
   ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
   ALTER TABLE group_invitations ENABLE ROW LEVEL SECURITY;

   -- Create policies (examples - adjust based on your requirements)
   CREATE POLICY "Users can view their own profile"
     ON users FOR SELECT
     USING (auth.uid() = id);

   CREATE POLICY "Users can update their own profile"
     ON users FOR UPDATE
     USING (auth.uid() = id);

   CREATE POLICY "Users can view their own exercises"
     ON exercises FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own exercises"
     ON exercises FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own exercises"
     ON exercises FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own exercises"
     ON exercises FOR DELETE
     USING (auth.uid() = user_id);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Design System

### Color Palette
- **Primary**: #F8F4F0 (Warm white/Cream)
- **Secondary**: #201F24 (Dark charcoal)
- **Accent**: #277C78 (Teal/Turquoise)
- **Success**: #10B981 (Green)
- **Error**: #EF4444 (Red)
- **Warning**: #F59E0B (Orange)

### Typography
- **Font Family**: Public Sans
- **Weights**: Bold (700), Regular (400)
- **Sizes**: 12px, 14px, 16px, 22px, 34px

### Spacing Scale
4px, 8px, 12px, 16px, 24px, 32px, 48px

## Key Features Implementation

### Authentication Flow
1. User registers with email and password
2. Email verification sent
3. User logs in after verification
4. Session managed via Supabase Auth
5. Auto-logout after 30 days of inactivity

### Exercise Logging
- Date picker for workout date
- Exercise name input (text or dropdown)
- Type selection (machine/free weights)
- Weight and unit input
- Sets and reps tracking
- Optional notes
- Auto-save draft functionality

### Group Features
- Create groups with name and goal
- Invite members via email
- View group statistics and leaderboards
- Admin controls for group management
- Real-time activity feed

### Statistics & Leaderboards
- Total weight lifted
- Most reps completed
- Consistency streaks
- Sortable leaderboard tables
- Time period filters
- Export functionality

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variables
4. Deploy

### Backend (Supabase)
Already hosted on Supabase platform. Configure via Supabase dashboard.

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
Please read the contributing guidelines before submitting pull requests.

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please create an issue in the GitHub repository.
