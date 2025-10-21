# Project Requirements Document

## Project Information

**Project Name:** GYMBROS  
**Version:** 1.0  
**Date:** October 20, 2025  
**Status:** Draft

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [Technical Requirements](#technical-requirements)
- [User Requirements](#user-requirements)
- [Design Requirements](#design-requirements)
- [Security Requirements](#security-requirements)
- [Performance Requirements](#performance-requirements)
- [Browser & Device Compatibility](#browser--device-compatibility)

---

## 🎯 Project Overview

### Purpose

GYMBROS is a fitness tracking and social competition platform that enables users to log their gym workouts, monitor their progression over time, and engage in friendly competition with friends through group challenges and leaderboards.

### Scope

**In Scope:**

- User registration and authentication
- Exercise logging system
- Group management and invitations
- Competitive leaderboards and statistics
- Progress tracking and analytics
- Email notifications for group invitations

**Out of Scope:**

- Workout plan generation
- Nutrition tracking
- Video exercise demonstrations
- Personal trainer marketplace
- Mobile native applications (initial release)

### Target Audience

- **Primary Audience:** Fitness enthusiasts aged 18-45 who regularly attend gyms and want to track progress
- **Secondary Audience:** Friend groups and workout partners looking for accountability and competition

### Success Metrics

- 1,000 registered users within first 3 months
- Average of 10 exercise logs per user per week
- 70% of users joining at least one group
- Average session duration of 5+ minutes
- 60% user retention rate after 30 days

---

## ⚙️ Functional Requirements

### FR-001: User Registration

**Priority:** High  
**Description:** Users must be able to create an account with email and password authentication  
**Acceptance Criteria:**

- Email validation is implemented (valid email format)
- Password must be minimum 8 characters with at least one uppercase letter, one number, and one special character
- Confirmation email is sent to verify account
- Users can log in after registration and email verification
- Display clear error messages for invalid inputs
- Password strength indicator shown during registration

### FR-002: User Authentication

**Priority:** High  
**Description:** Users must be able to securely log in and log out of their accounts  
**Acceptance Criteria:**

- Login form with email and password fields
- "Remember me" checkbox option
- "Forgot password" functionality with email reset link
- Session management with automatic logout after 30 days of inactivity
- Secure password reset process

### FR-003: User Profile

**Priority:** Medium  
**Description:** Users must be able to view and edit their profile information  
**Acceptance Criteria:**

- Display user name, email, and profile picture
- Edit profile fields: name, profile picture, weight unit preference (kg/lbs)
- Change password functionality
- Delete account option with confirmation dialog

### FR-004: Exercise Log Form

**Priority:** High  
**Description:** Users must be able to add exercise entries to the database  
**Acceptance Criteria:**

- Required fields: Date (with date picker), Exercise name (text or dropdown with common exercises), Type (machine or free weights - radio buttons), Weight (numeric), Weight unit (kg/lbs - dropdown), Sets (numeric), Reps (comma-separated or individual inputs for each set), Notes (textarea - optional)
- Form validation on submit with clear error messages
- Auto-save draft functionality to prevent data loss
- Button to add exercise log accessible from exercises table page
- Option to duplicate previous exercise entry for quick logging
- Success message displayed after successful submission

### FR-005: Exercises Logs Table Page

**Priority:** High  
**Description:** Users must be able to view their exercise log history from the database  
**Acceptance Criteria:**

- Display table with columns: Date, Exercise name, Type (machine or free), Weight, Weight unit, Sets, Reps (displayed as set breakdown, e.g., "3 sets: 10, 8, 8"), Notes
- Sortable columns (click header to sort ascending/descending)
- Filter options: date range, exercise name, exercise type
- Search functionality to find specific exercises
- Pagination or infinite scroll for large datasets
- Edit button for each entry (opens modal or inline editing)
- Delete button for each entry with confirmation dialog
- Export data option (CSV or PDF)
- Visual indicators for personal records (PRs)

### FR-006: Groups Page

**Priority:** High  
**Description:** Users must be able to view and manage their groups  
**Acceptance Criteria:**

- Display all groups the user is a member of with group name, number of members, and recent activity
- Display pending group invitations in a separate section
- Accept or reject invitation buttons for each pending invitation
- "Create New Group" button prominently displayed
- Click on group card to navigate to individual group page
- Display user's role in each group (admin/member)
- Leave group option with confirmation dialog

### FR-007: Create New Group Form

**Priority:** High  
**Description:** Users must be able to create a group and invite members  
**Acceptance Criteria:**

- Required fields: Group Name (text, max 50 characters), Goal (textarea, e.g., "Increase bench press by 20kg in 3 months"), Member emails (multi-input field or comma-separated)
- Form validation on submit (validate email formats)
- Send email notifications to invited users with accept/decline links
- Group creator automatically becomes group admin
- Success message displayed after group creation
- Option to set group privacy (public/private)
- Ability to upload group cover image (optional)

### FR-008: Group Page

**Priority:** High  
**Description:** Users must be able to view group details and member activity  
**Acceptance Criteria:**

- Display group name, goal, and member list with profile pictures
- Show all members' recent exercise logs in a combined table (sortable by date, member name)
- Filter exercises by member
- Display group statistics dashboard with key metrics:
  - Total workouts logged by group
  - Most active member this week
  - Group's total weight lifted (all-time)
  - Current member streaks
- Activity feed showing recent logs and milestones
- Group admin can edit group details and remove members
- Group admin can delete the group (with confirmation)

### FR-009: Group Statistics Page

**Priority:** High  
**Description:** Users must be able to view detailed competitive statistics for their group  
**Acceptance Criteria:**

- Date range filter (last 7 days, 30 days, 90 days, all-time, custom range)
- Exercise filter (all exercises, or select specific exercise)
- Statistics displayed:
  - **Heaviest Lifter:** Who lifted the most total weight in the selected period
  - **Most Reps Champion:** Who completed the most total reps
  - **Consistency King/Queen:** Who has the highest non-stop streak (workout days in a row, allowing up to 3 rest days without breaking streak)
- **Main Leaderboard Table** with columns:
  - Rank
  - Member name with profile picture
  - Total weight lifted
  - Total sets completed
  - Total reps completed
  - Workout days in period
- Leaderboard sorted by total weight lifted by default
- Click column headers to sort by that column (ascending/descending toggle)
- Visual badges or icons for top 3 positions
- Export leaderboard as image for sharing on social media
- Percentage change indicators compared to previous period

### FR-010: Dashboard / Home Page

**Priority:** Medium  
**Description:** Users must have a personalized dashboard showing their overview  
**Acceptance Criteria:**

- Display recent exercise logs (last 5-10 entries)
- Show personal statistics: total workouts this month, current streak, total weight lifted
- Quick action buttons: Log Exercise, View Groups
- Motivational quotes or tips
- Progress charts showing trends over time

### FR-011: Notifications

**Priority:** Medium  
**Description:** Users must receive notifications for important events  
**Acceptance Criteria:**

- Email notifications for:
  - Group invitations
  - New members joining groups
  - When someone beats your personal record in a group
  - Weekly group summary
- In-app notification center showing unread notifications
- Notification preferences page to customize which notifications to receive

---

## 🔧 Non-Functional Requirements

### NFR-001: Usability

- Interface must be intuitive requiring minimal learning curve
- Navigation should require no more than 3 clicks to reach any major feature
- Forms must provide inline validation with clear error messages
- Consistent UI patterns throughout the application
- Tooltips and help text for complex features

### NFR-002: Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigation support for all interactive elements
- Screen reader compatible with proper ARIA labels
- Minimum color contrast ratio of 4.5:1 for text
- Alt text for all images and icons
- Focus indicators clearly visible

### NFR-003: Reliability

- 99.5% uptime target
- Automatic daily database backups
- Error logging and monitoring system
- Graceful error handling with user-friendly messages
- Data recovery procedures in place

### NFR-004: Maintainability

- Well-documented code with comments
- Modular component architecture
- Consistent coding standards (ESLint/Prettier)
- Comprehensive README and setup documentation
- API documentation for all endpoints

---

## 💻 Technical Requirements

### Frontend

- **Framework:** React 18+
- **CSS Framework:** Tailwind CSS 3+ and SASS
- **Build Tools:** Vite
- **State Management:** Redux
- **Date Handling:** date-fns or Day.js
- **Charts/Visualizations:** Recharts or Chart.js
- **HTTP Client:** Fetch API
- **Routing:** React Router v6

### Backend

- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime subscriptions
- **Storage:** Supabase Storage (for profile pictures, group images)
- **Edge Functions:** Supabase Edge Functions (for email notifications, complex calculations)

### Database Schema

**Users Table:**

- id (UUID, primary key)
- email (text, unique)
- name (text)
- profile_picture_url (text)
- weight_unit_preference (enum: 'kg', 'lbs')
- created_at (timestamp)

**Exercises Table:**

- id (UUID, primary key)
- user_id (UUID, foreign key)
- date (date)
- exercise_name (text)
- type (enum: 'machine', 'free')
- weight (decimal)
- weight_unit (enum: 'kg', 'lbs')
- sets (integer)
- reps (jsonb or text - array of rep counts)
- notes (text)
- created_at (timestamp)

**Groups Table:**

- id (UUID, primary key)
- name (text)
- goal (text)
- cover_image_url (text)
- created_by (UUID, foreign key to users)
- created_at (timestamp)

**Group_Members Table:**

- id (UUID, primary key)
- group_id (UUID, foreign key)
- user_id (UUID, foreign key)
- role (enum: 'admin', 'member')
- joined_at (timestamp)

**Group_Invitations Table:**

- id (UUID, primary key)
- group_id (UUID, foreign key)
- email (text)
- status (enum: 'pending', 'accepted', 'rejected')
- created_at (timestamp)

### Hosting & Infrastructure

- **Hosting Provider:** Vercel or Netlify (frontend), Supabase (backend)
- **SSL Certificate:** Required (automatic via hosting provider)
- **CDN:** Cloudflare or hosting provider's CDN

### Version Control

- **Repository:** GitHub
- **Branching Strategy:** Git Flow (main, develop, feature branches)
- **Commit Convention:** Conventional Commits

---

## 👥 User Requirements

### User Roles

#### Registered User

- Can create and edit their profile
- Can log exercises and view their own logs
- Can join groups via invitation
- Can view group statistics and leaderboards
- Can create new groups (becomes admin of that group)

#### Group Admin

- All registered user capabilities
- Can edit group details (name, goal, cover image)
- Can remove members from the group
- Can delete the group
- Can send additional invitations

---

## 🎨 Design Requirements

### Visual Design

- **Color Scheme:**
  - Primary: RGB(248, 244, 240) - #F8F4F0 (Warm white/Cream)
  - Secondary: RGB(32, 31, 36) - #201F24 (Dark charcoal)
  - Accent: RGB(39, 124, 120) - #277C78 (Teal/Turquoise)
  - Additional colors for UI states: success (green), error (red), warning (orange)
- **Typography:**
  - Font Family: Public Sans
  - Weights: Bold (700), Regular (400)
  - Font Sizes: 12px (small text), 14px (body text), 16px (subheadings), 22px (headings), 34px (page titles)
  - Line Height: 1.5 for body text, 1.2 for headings
- **Logo:** "GB" lettermark in accent color
- **Style Guide:** Material Design principles with custom theme

### Layout Requirements

- Responsive design (mobile-first approach)
- Consistent header (navigation) and footer across all pages
- Maximum content width: 1200px (centered with auto margins)
- Minimum supported screen width: 320px
- Grid system: 12-column layout using Tailwind's grid utilities
- Consistent spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px)

### UI Components

- **Navigation:**
  - Desktop: Horizontal navbar with logo, main links, profile dropdown
  - Mobile: Hamburger menu with slide-out drawer
- **Buttons:**
  - Primary: Accent color background with white text
  - Secondary: Outline style with accent color border
  - Sizes: small, medium, large
- **Forms:**
  - Consistent input styling with border and focus states
  - Inline validation messages
  - Required field indicators
- **Tables:**
  - Striped rows for better readability
  - Hover states on rows
  - Sticky header for long tables
  - Responsive design (horizontal scroll on mobile or card view)
- **Cards:**
  - Subtle shadow for depth
  - Hover effect (slight elevation)
  - Consistent padding and border radius
- **Modals:**
  - Centered overlay with backdrop blur
  - Close button in top-right corner
  - Smooth fade-in animation

### Iconography

- Use consistent icon library (e.g., Heroicons, Lucide, or Feather)
- Icon sizes: 16px, 20px, 24px
- Use icons to enhance text, not replace it (except for common actions like delete, edit)
