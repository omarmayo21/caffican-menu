# CaffiCan - Modern Luxury Café Digital Menu

A premium, elegant, and modern luxury café digital menu system built for **CaffiCan**. This application allows customers to scan QR codes at their tables to view a beautifully designed, mobile-first menu.

## 🌟 Features

### Customer Experience
- **Luxury UI/UX**: Soft beige and olive green aesthetic with elegant typography (Playfair Display & Poppins).
- **Mobile-First Menu**: Optimized for quick scanning and easy navigation on mobile devices.
- **Table Tracking**: Automatically detects the table number from the QR code (e.g., `/menu?table=5`).
- **Interactive Menu**: Category filtering, search functionality, and real-time availability badges.
- **Animations**: Smooth page transitions and glassmorphism UI elements.

### Admin Dashboard
- **Secure Management**: Protected area for managing the café's offerings.
- **Menu Control**: Add, edit, or delete categories, sections, and individual menu items.
- **Availability Toggle**: Quickly mark items as "Available" or "Sold Out".
- **QR Table System**: Generate and download unique QR codes for every table in the café.
- **Dark Mode UI**: Professional dark luxury theme for the management interface.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL (via Drizzle ORM).
- **QR Generation**: `qrcode.react`.
- **Icons**: Lucide React.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `SESSION_SECRET`: A secret string for session management.

3. Push the database schema:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Admin Credentials
- **Username**: `can`
- **Password**: `can#3011@`

## 🎨 Brand Identity
- **Primary Color**: `#8a8e62` (Luxury Olive)
- **Secondary Color**: `#faebd7` (Soft Beige)
- **Typography**: Playfair Display (Headings), Poppins (Body)
