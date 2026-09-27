# QuickFix — Home Service Platform (Frontend)

A responsive Next.js frontend for a home service marketplace, connecting customers
with verified technicians for plumbing, electrical, cleaning, and more. Consumes the
[FixItNow backend API](https://fix-it-now-bd.vercel.app).

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** shadcn (Base UI registry), Tailwind CSS v4, ReactBits (SplitText, CountUp, AnimatedContent)
- **Data:** TanStack Query, ofetch
- **Forms:** react-hook-form + Zod v4
- **Auth:** JWT (cookie-stored), Next.js `proxy.ts` for route protection
- **Rendering:** SSG/ISR for public pages, client-side data fetching for dashboards

## Features

**Public**

- Home, service browsing with search/filter/pagination, technician profiles (SSG)
- About, Contact pages

**Customer**

- Register/login, booking flow (service + date/time + address), SSLCommerz payment,
  booking & payment history, cancel booking, leave reviews, profile edit

**Technician**

- Dashboard overview (upcoming jobs, earnings, pending requests)
- Profile & weekly availability management
- Service management (create/edit/deactivate)
- Booking management (accept/decline/start/complete)

**Admin**

- Platform stats, user management (search, ban/unban), booking overview,
  category management

## Getting Started

### Prerequisites

- Node.js 20+, [Bun](https://bun.sh)
- A running instance of the FixItNow backend (or use the hosted one)

### Installation

bash
git clone <repo-url>
cd quickfix
bun install
cp .env.example .env.local

## .env.local

\`\`\`

### Development

\`\`\`bash
bun run dev
\`\`\`

### Production build

\`\`\`bash
bun run build
bun run start
\`\`\`

## Environment Variables

| Variable               | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Backend API base URL (no trailing slash or `/api`)             |
| `NEXT_PUBLIC_SITE_URL` | This app's own deployed URL (used for sitemap/robots/metadata) |

## Routes

| Route                                                         | Description                                      |
| ------------------------------------------------------------- | ------------------------------------------------ |
| `/`                                                           | Home                                             |
| `/services`                                                   | Browse & filter services                         |
| `/technicians/[id]`                                           | Technician profile + booking                     |
| `/about`, `/contact`                                          | Static pages                                     |
| `/auth/login`, `/auth/register`                               | Auth                                             |
| `/dashboard/customer`                                         | Customer dashboard (bookings, payments, profile) |
| `/dashboard/customer/bookings/[id]/pay`                       | Payment initiation                               |
| `/payment/success`, `/payment/cancel`                         | Payment outcome                                  |
| `/dashboard/technician`, `/bookings`, `/services`, `/profile` | Technician dashboard                             |
| `/dashboard/admin`, `/categories`                             | Admin dashboard                                  |

## API Integration Notes

The backend's response shape is **inconsistent per resource** — some list/detail
endpoints nest data under a resource key, others return it flat. Discovered via live
testing during development:

| Endpoint                                 | Shape                                  |
| ---------------------------------------- | -------------------------------------- |
| `GET /categories` (list)                 | `data.categories`                      |
| `GET /categories/:id`, create/update     | `data.category` (nested)               |
| `GET /technicians` (list)                | `data.technicians`                     |
| `GET /technicians/:id`                   | `data.technician` (nested)             |
| `GET /services`, `GET /services/:id`     | flat `data`                            |
| `GET /services/my-services`              | `data.services` (nested)               |
| `GET /bookings` (list)                   | flat `data`                            |
| `GET /bookings/:id`                      | `data.booking` (nested)                |
| `GET /payments`                          | flat `data`                            |
| `GET /users/me`, `PUT /users/my-profile` | `data.profile` / `data.updatedProfile` |

Prices (`price`, `totalPrice`) are returned as **strings** (Prisma `Decimal` →
JSON), always convert with `Number()` before arithmetic.

## Known Limitations

- No profile photo upload — the backend doesn't expose a field for it.
- Booking time slots are generated from the technician's weekly availability
  (hourly blocks), not a real slot-locking system — double-booking conflicts are
  only caught by the backend at booking time.
- SSLCommerz success/cancel redirect query params are read defensively (multiple
  possible names tried); confirm the exact contract against a live sandbox run if
  extending this flow.
- No silent JWT refresh — sessions expire when the access token expires and the
  user must log in again.
- `booking.service.price` is used for amount displays; the backend also exposes a
  `booking.totalPrice` snapshot which may be more accurate if service prices change
  after a booking is made.

## Deployment

Deployed on Vercel. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL` in the
Vercel project's environment variables, and ensure the backend's CORS allow-list
includes this app's deployed domain.

## Author

**Sahidul Islam**
GitHub: [@Sahidulislam05](https://github.com/Sahidulislam05)
