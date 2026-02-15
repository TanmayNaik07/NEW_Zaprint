# Mission: Fix Critical Errors & Enhance Print Workflow

You are an expert full-stack developer working on a Next.js (App Router) project with Supabase. Your task is to resolve critical bugs and implement a major feature enhancement for the print ordering workflow.

## Part 1: Critical Bug Fixes (High Priority)

### 1. Fix "Fetch Failed" & "Headers Timeout" Errors
Users are experiencing intermittent fetch failures and timeouts.
**Error Log:**
```
TypeError: fetch failed
Caused by: HeadersTimeoutError: Headers Timeout Error (UND_ERR_HEADERS_TIMEOUT)
```
**Action:** Optimize database queries and connection handling. Ensure proper indexing (see schema below) and implement retry logic or timeout configurations where necessary.

### 2. Fix "Maximum Call Stack Size Exceeded"
The application is crashing with a stack overflow error.
**Action:** Investigate recursive function calls or circular dependencies in data fetching/rendering, particularly in the Orders page. Ensure data passed to components is normalized and free of circular references.

---

## Part 2: Print Page Enhancement (`shops/[id]/print`)

Refactor the print configuration page to support **multiple file uploads** and **dynamic pricing**.

### Requirements:
1.  **Multiple Print Sections**:
    *   Initially show one "Upload & Configure Your Print" section.
    *   Add a "Add Another Print" button (dashed border, transparent bg, full-width clickable) to append a new configuration section.
    *   Each section allows independent file upload and configuration.

2.  **Configuration Options (Per Section)**:
    *   **Print Type**: Radio buttons for "Black & White" vs "Color".
    *   **Pages Calculation**: If PDF is uploaded, automatically count pages.
    *   **Add-ons**: Rename "Service Types" to "Add-ons". Remove B&W/Color from here.
    *   **Duplex**: Add a checkbox for "Front & Back Side Print".

3.  **Pricing & Grand Total**:
    *   Calculate cost per section: `(Pages * Copies * Print Type Rate) + Add-ons`.
    *   Display a **Grand Total** fixed at the bottom of the screen.

### implementation Details & Database Schema

**Orders Table Schema:**
```sql
create table public.orders (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  shop_id uuid not null,
  status public.order_status not null default 'pending'::order_status,
  total_amount numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  receipt_number text null,
  constraint orders_pkey primary key (id),
  constraint orders_shop_id_fkey foreign KEY (shop_id) references shops (id) on delete CASCADE,
  constraint orders_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
);

-- Indexes
create index IF not exists idx_orders_user_created on public.orders (user_id, created_at desc);
create index IF not exists idx_orders_user_id on public.orders (user_id);
create index IF not exists idx_orders_shop_id on public.orders (shop_id);
create index IF not exists idx_orders_status on public.orders (status);
create index IF not exists idx_orders_created_at on public.orders (created_at desc);
```

**Order Items Schema (Update Required):**
```sql
create table public.order_items (
  id uuid not null default gen_random_uuid (),
  order_id uuid not null,
  file_url text not null,
  file_name text not null,
  file_type text null,
  color_mode text null check (color_mode in ('bw', 'color')),
  copies integer not null default 1 check (copies >= 1),
  pages_per_sheet integer not null default 1 check (pages_per_sheet in (1, 2, 4)),
  is_duplex boolean default false, -- NEW FIELD
  created_at timestamp with time zone null default now(),
  constraint order_items_pkey primary key (id),
  constraint order_items_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE
);

create index IF not exists idx_order_items_order_id on public.order_items (order_id);
```

## Workflow
1.  **Analyze**: Review existing code for `shops/[id]/print` and `orders/page.tsx`.
2.  **Database**: Run necessary migrations for `order_items`.
3.  **Frontend**: Implement the multi-section UI and state management.
4.  **Backend**: Ensure order submission creates multiple `order_items` linked to the single parent `order`.
