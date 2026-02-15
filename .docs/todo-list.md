# Feature Implementation Prompt

Usage: correct way to use this prompt is to dump this file content into the Composer agent (or equivalent) to start the implementation.

---

# Zaprint: Phases 2 Feature Implementation

## Context
**App**: Zaprint (Next.js 14, Tailwind, Supabase)
**Goal**: Enhance user onboarding, order management, and shop discovery.

## Requirements Checklist
- [ ] **Onboarding Refactor**: Move detailed profile collection (Phone, Address) to a post-signup flow.
- [ ] **Data Structure**: Break down address into `Area`, `Town`, `City`, `State`, `Pincode`.
- [ ] **Order Receipt**: Generate a digital receipt for order claiming.
- [ ] **Location Filtering**: Filter shops based on user's location (City/Pincode).
- [ ] **Realtime Updates**: Instant order status reflection using Supabase Realtime.

---

## Detailed Implementation Instructions

### 1. Refactor Onboarding & Profile Schema
**Objective**: Streamline signup by only asking for auth credentials initially, then capturing shipping/contact details in a dedicated onboarding step.

**Steps**:
1.  **Database Schema**:
    -   Modify `public.profiles` table:
        -   Remove/Deprecate strict reliance on a single `address` text column.
        -   Add structured columns: `phone_number` (text), `flat_no` (text), `area` (text), `town` (text), `city` (text), `state` (text), `pincode` (text).
    -   Update `handle_new_user` trigger if necessary to handle nulls for these fields initially.
2.  **Signup Form (`components/auth/signup-form.tsx`)**:
    -   Remove `Phone` and `Address` inputs.
    -   Keep only `Name`, `Email`, `Password`.
    -   After signup/login, redirect users. existing logic might redirect to `/dashboard`, change this to check for profile completeness.
3.  **Onboarding Page (`app/onboarding/page.tsx`)**:
    - listen when the user registers for the first time and then logs into the dashbaord for the fiorst time at that time that onboarding form will be prompt and once the user fills it, its content would be saved in the database and the user can continue with his work.
    -   Form Fields: Phone (validate 10 digits), Flat/House No, Area, Town, City, State, Pincode.
    -   On Submit: Update `profiles` table row for `auth.uid()`.
    -   Redirect to `/dashboard` on success.

4.  **Middleware / Layout Protection**:
    -   Ensure that accessing `/dashboard/*` requires the profile to be "complete" (i.e., phone and pincode exist). If not, redirect to `/onboarding`.

### 2. Order Receipt System
**Objective**: Users need a proof of purchase/order to show at the shop.

**Steps**:
1.  **Component (`components/orders/order-receipt.tsx`)**:
    -   Design a receipt card showing:
        -   Order ID (Truncated or full UUID)
        -   Shop Name & Location
        -   List of Files/Items (Copies, Color mode)
        -   Total Amount Paid
        -   Current Status
        -   QR Code (Optional, for easy scanning by shop owner)
2.  **Pages**:
    -   **Post-Order**: Display this receipt immediately after successful payment.
    -   **Order History**: Add a "View Receipt" button to each order item in `/dashboard/orders`.

### 3. Location-Based Shop Filtering
**Objective**: Users should primarily see shops that are relevant to them.

**Steps**:
1.  **Shop Data**:
    -   Ensure `public.shops` table has address fields comparable to the user's profile (e.g., `city`, `pincode`). If `location` is just a text string, consider adding a `pincode` or `city` column to `shops` for reliable filtering.
2.  **Filtering Logic**:
    -   In the "Find Shop" or "Dashboard" view:
    -   Fetch the current user's `city` or `pincode` from `profiles`.
    -   Query `shops` filtering by this city/pincode.
    -   *Fallback*: If no shops found in user's location, show "No shops found in [City]. Showing all shops:" and list others.

### 4. Realtime Order Status
**Objective**: No manual refreshes. When a shop owner updates status (e.g., to 'PRINTING'), the user sees it instantly.

**Steps**:
1.  **Supabase Setup**:
    -   Ensure `orders` table is in the Realtime publication.
2.  **Frontend Subscription**:
    -   In `app/dashboard/orders/page.tsx` (or the relevant component):
    -   Create a `useEffect` to subscribe to `orders` changes.
    -   Filter: `user_id=eq.${currentUser.id}`.
    -   Event: `UPDATE`.
    -   Action: On update, refresh the data (re-fetch or update local state) and trigger a Toast notification ("Your order #123 is now [STATUS]").

---
