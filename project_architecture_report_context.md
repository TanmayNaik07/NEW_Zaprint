# Zaprint - Project Architecture & Technical Context

This document contains a comprehensive breakdown of the Zaprint project's codebase, architecture, and technology stack. This information is intended to serve as context for generating a detailed 12-week development and progress report via ChatGPT or similar LLMs.

## 1. Project Overview

**Zaprint** is a modern, web-based platform designed to streamline the document printing process. It allows users to upload documents, customize print settings (B&W/Color, copies, sizing), select local print shops (vendors), and process payments online. The goal is to eliminate waiting in physical queues by allowing users to pick up their prints exactly when they are ready.

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 15.5.11 (App Router)
- **Library:** React 19.2.0, React DOM 19.2.0
- **Language:** TypeScript 5
- **State Management:** Zustand (5.0.10)
- **Forms & Validation:** React Hook Form (7.60.0), Zod (3.25.76), @hookform/resolvers
- **Date Handling:** date-fns (4.1.0), react-day-picker

### Styling & UI Design
- **CSS Framework:** Tailwind CSS (3.4.17) with PostCSS and Autoprefixer
- **UI Components:** Radix UI primitives (Accordion, Dialog, Popover, Select, Tabs, etc.)
- **Icons:** Lucide React (0.454.0)
- **Utility Libraries:** clsx, tailwind-merge, class-variance-authority, cmdk
- **Custom Font:** Geist (sans-serif), Rubik Dirt (for specific "Kent Printed" distressed typography)
- **3D & Shaders:** Three.js, @react-three/fiber, @react-three/drei, @paper-design/shaders-react (used for web aesthetic/landing page effects).

### Animation
- **Framer Motion:** (12.26.2) heavily utilized for micro-interactions, page transitions, and complex landing page features.
- **Tailwind Animate:** For standard class-based transitions.

### Backend & Infrastructure (BaaS)
- **Provider:** Supabase
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth (Email/Password, JWT)
- **Storage:** Supabase Storage (for document uploads, bucket: `documents`)
- **Integration:** `@supabase/supabase-js` (2.95.3), `@supabase/ssr` (0.8.0)
- **Analytics:** Vercel Analytics

---

## 3. Frontend Architecture

The frontend follows the Next.js App Router conventions:

### Directory Structure
- `/app`: Contains all routing logic.
  - `/app/login`, `/app/signup`, `/app/auth`: Authentication routes.
  - `/app/dashboard`: Protected user dashboard routes (overview, orders, shops, settings, checkout).
  - `/app/globals.css`: Global base styles, utility classes, and complex custom CSS/animations (e.g., `.zaprint-theme`, `.liquid-container`).
  - `/app/layout.tsx`: Root layout implementing Providers, Fonts, toaster, and analytics.
- `/components`: Contains modular React components.
  - `/components/ui`: Highly reusable base components (often derived from shadcn/ui).
  - `/components/dashboard`: Dashboard specific components (`overview-cards.tsx`, `recent-activity.tsx`, `sidebar.tsx`, `top-bar.tsx`).
  - `/components/auth`: Authentication forms.
  - `/components/providers`: Context providers (e.g., `theme-provider.tsx`, `navigation-loading-provider.tsx`).
  - Root components like `zaprint-hero.tsx`, `zaprint-pricing.tsx`, `cta-section.tsx` for landing page structure.
- `/lib`: Utility functions and clients.
  - `/lib/supabase`: Contains Supabase clients (`client.ts`, `server.ts`).
  - `/lib/utils.ts`: Standard class-merging utilities (`cn`).

### Theming and UI Implementation
- The application utilizes a customized "Zaprint / Mindfold" theme characterized by warm cream background colors (`#f7f6f4`), deep navy text (`#0a1128`), and stylized borders/shadows.
- Recent updates introduced a "grunge/distressed" aesthetic using the `Rubik Dirt` font to mimic a custom "Kent Printed" design.
- UI elements incorporate crumpled paper texture backdrops, dashed borders, and sticky-note rotations to achieve a boutique, handmade feel alongside modern functionality.

---

## 4. Backend Architecture (Supabase Schema)

The backend is completely serverless, managed via Supabase. Below are the key components of the Database schema:

### Core Tables
1. **`profiles`**
   - Extends Supabase `auth.users`.
   - Fields: `id` (uuid), `email`, `full_name`, `avatar_url`, `updated_at`.
2. **`shops`**
   - Represents physical print vendors.
   - Fields: `id`, `owner_id`, `shop_name`, `phone`, `location`, `description`, `image_url`, `start_time`, `end_time`, `non_working_days`, `status` ('open', 'closed', 'error'), `is_onboarded`.
3. **`shop_services`**, **`shop_resources`**, **`shop_printers`**
   - Handle vendor capabilities, pricing, inventory, and connected hardware status.
4. **`orders`**
   - Matches a user to a shop.
   - Fields: `id`, `user_id`, `shop_id`, `status` (enum: 'pending', 'processing', 'printing', 'completed', 'cancelled'), `total_amount`, timestamps.
5. **`order_items`**
   - The actual documents tied to an order.
   - Fields: `id`, `order_id`, `file_url`, `file_name`, `file_type`, `color_mode`, `copies`, `pages_per_sheet`.

### Row Level Security (RLS)
Security is strictly enforced at the database level:
- Users can view and update only their own `profiles`.
- Users can only `SELECT` and `INSERT` their own `orders` and `order_items`.
- `shops` and shop configurations are viewable by authenticated users for browsing.
- Supabase storage bucket `documents` is restricted. Users can only upload and read files where their `auth.uid()` matches the owner.

---

## 5. Core Application Flows

1. **Authentication:** 
   - Standard sign-up/login through Supabase. First-time users are prompted with an Onboarding Modal (requesting phone and pincode).
2. **Browsing Shops:**
   - Users view available partner print shops fetched dynamically from the `shops` table.
3. **Document Flow:**
   - User uploads a document -> file is stored in Supabase `documents` bucket.
   - User configs print settings (copies, color, duplex) -> Zustand state manages the current draft order.
   - Order is finalized -> Rows inserted into `orders` and `order_items`.
4. **Dashboard / Tracking:**
   - Dashboard Overview page aggregates statistics (Active Jobs, Completed, Avg Time) and renders them in stylized statistic cards.
   - Receives real-time or interval updates based on the order lifecycle transitioning through pending -> processing -> printing -> ready.

---

## 6. Guide for Generating the 12-Week Report

When feeding this context into ChatGPT to generate a 12-week report, you can divide the efforts logically into the following phases:

### Weeks 1-4: Foundation & Infrastructure
- Next.js scaffolding, Tailwind, UI Library integration.
- Supabase project initialization, authentication setup, and RLS policies.
- Database schema design (profiles, orders, shops).

### Weeks 5-8: Core Features & Dashboard
- Implementation of PDF/Document upload flow to Supabase storage.
- Building out user dashboard (routing, layout).
- Zustand implementation for tracking user cart/settings state.
- Order management backend functions.

### Weeks 9-10: Vendor / Shop Upgrades
- Database migration converting basic shop table into a relational `shops`, `shop_services`, `shop_resources` schema.
- Establishing realtime database connections and hardware simulation concepts for printer statuses.

### Weeks 11-12: Theming, UI Polish & Launch Prep
- Advanced CSS and 3D Shader integrations for the landing page.
- Implementation of the "Boss/Kent Printed" premium design.
- Sticky-note UI components, dashed borders, "Rubik-Dirt" typography integration, and custom crumpled paper textures.
- Final bug-fixing, build process verification, and Vercel analytics setup.

--- 

*Note: You can copy this file directly into ChatGPT. Ask it to "Generate a detailed weekly progress report for a software engineering team building the Zaprint platform over 12 weeks, using the provided project context."*
