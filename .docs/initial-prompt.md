# Zaprint: Remote Printing Infrastructure & Web Application Specification

## 1. System Overview
Zaprint is a hybrid remote printing ecosystem comprising two primary interfaces:
1.  **Web Client (User-Facing):** Enables end-users to discover print shops, upload documents, configure print specifications (e.g., layout, color profile), and process payments.
2.  **Desktop Agent (Vendor-Facing):** An automated background service for print shop owners that polls/receives print jobs and executes them on local hardware.

**Current Focus:** This engagement focuses exclusively on the **Web Client** development.

## 2. Architecture & Data Consistency
*   **Unified Backend:** The system relies on **Supabase** as the single source of truth for both Web and Desktop clients.
*   **Data Integrity:** Strict adherence to database schemas is required to ensure seamless synchronization between the web order placement and desktop fulfillment agents.

## 3. Functional Requirements & User Experience
The application flow is designed to minimize friction from login to print collection.

### 3.1 Dashboard & Analytics
*   Upon authentication (AuthZ via Supabase), the user is directed to the main **Dashboard**.
*   **Key Metrics:** Display value-driven metrics (e.g., "Time Saved," "Total Pages Printed").
*   **Recent Activity:** A quick-access list of the most recent orders.

### 3.2 Vendor Discovery Module
*   Users can browse or search for nearby print shops.
*   **Shop Card UI:** Each available vendor must be vetted and displayed with critical metadata:
    *   Operational Status (Open/Closed/Busy)
    *   Pricing Tiers (B&W vs. Color per page)
    *   Location/Address
    *   Visual Assets (Shop images)

### 3.3 File Upload & Configuration Engine
*   **Navigation:** Selecting a shop initiates the upload workflow.
*   **Configuration:** Users must be able to specify:
    *   Color Profile (Grayscale/CMYK)
    *   Layout (N-up printing, e.g., 4 slides per page)
    *   Copies & Paper Size
*   **Checkout:** Integration with a payment gateway. Upon success, generate a digital receipt and transition the order state to `PENDING`.

### 3.4 Order Fulfillment & Real-time Updates
*   **Data Persistence:** Uploaded files and metadata are stored in Supabase Storage and Database respectively.
*   **Vendor Sync:** The Desktop Agent synchronizes with this data to initiate printing.
*   **Notification Loop:** The Web Client must listen for status updates (e.g., `PRINTING` -> `COMPLETED`) and trigger user notifications for pickup.

### 3.5 Order Management ("My Orders")
*   Implement a dedicated "My Orders" view in the sidebar.
*   **Active Orders:** Real-time tracking of current jobs.
*   **History:** Archival view of past transactions with re-order capabilities (optional but recommended).

## 4. Technical Guidelines
*   **Codebase Consistency:** Adhere strictly to the existing architectural patterns.
*   **Styling Constraints:** **DO NOT** modify the global theme, color palette, or landing page (`app/page.tsx`). All new components must inherit existing design tokens.
*   **Schema Design:** Design and implement necessary Supabase tables/schemas to support the workflows described above (Orders, Users, Shops, Files).

---
*Note: This specification assumes a senior-level understanding of React/Next.js functional components, hooks, and state management.*