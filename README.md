# Wedding Management System — Developer Documentation

A full-stack photography studio management platform built for **Anil Chauhan Photography (ACP)**. The system consists of three layers: a **Laravel REST API** backend, a **Vue.js admin panel**, and a **React.js public landing page**.

---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Tech Stack](#tech-stack)
3. [Repository Structure](#repository-structure)
4. [Backend — Laravel API](#backend--laravel-api)
5. [Admin Panel — Vue.js](#admin-panel--vuejs)
6. [Landing Page — React.js](#landing-page--reactjs)
7. [Environment Configuration](#environment-configuration)
8. [Database Schema](#database-schema)
9. [API Reference](#api-reference)
10. [Authentication](#authentication)
11. [Media Handling](#media-handling)
12. [Development Setup](#development-setup)
13. [Build & Deployment](#build--deployment)

---

## Project Architecture

```
wedding-management/
├── app/                    # Laravel PHP backend (API server)
├── admin-panel/            # Vue 3 + TypeScript admin dashboard
└── react-version/          # React 19 public-facing landing page
```

The backend exposes a RESTful JSON API. Both the admin panel and the landing page are separate single-page applications (SPAs) that consume this API. The admin panel handles all content management (protected by Laravel Sanctum tokens), while the landing page renders the public-facing website for visitors.

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | Laravel 11 |
| Auth | Laravel Sanctum (token-based) |
| Media | Spatie Laravel MediaLibrary |
| Database | SQLite (default) / MySQL (configurable) |
| PHP | ^8.2 |

### Admin Panel
| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript |
| State Management | Pinia |
| Routing | Vue Router 4 |
| HTTP Client | Axios |
| Forms / Validation | VeeValidate + Yup |
| Charts | Chart.js 4 |
| Build Tool | Vite 5 |

### Landing Page
| Layer | Technology |
|---|---|
| Framework | React 19 |
| Routing | React Router DOM 7 |
| Animations | GSAP 3 |
| Carousel | Swiper 12 |
| Build Tool | Vite 8 |

---

## Repository Structure

```
wedding-management/
│
├── .env                        # Laravel environment (do not commit)
├── .env.example                # Environment template
├── composer.json               # PHP dependencies
├── routes/
│   └── api.php                 # All API route definitions
│
├── app/
│   ├── Http/Controllers/API/   # API controllers
│   │   ├── AuthController.php
│   │   ├── GalleryController.php
│   │   ├── GalleryCategoryController.php
│   │   ├── TestimonialController.php
│   │   ├── TeamMemberController.php
│   │   ├── VideoController.php
│   │   ├── ContactController.php
│   │   ├── InquiryController.php
│   │   └── WebsiteSettingsController.php
│   ├── Models/                 # Eloquent models
│   └── Services/               # Business logic layer
│
├── database/
│   └── migrations/             # Database migration files
│
├── admin-panel/                # Vue.js SPA
│   ├── src/
│   │   ├── pages/              # Route-level page components
│   │   ├── components/         # Reusable UI components
│   │   ├── stores/             # Pinia state stores
│   │   ├── services/           # API service modules
│   │   ├── router/             # Vue Router configuration
│   │   ├── types/              # TypeScript type definitions
│   │   └── utils/              # Helpers (axios, validation, formatting)
│   ├── vite.config.ts
│   └── package.json
│
└── react-version/              # React SPA (landing page)
    ├── src/
    │   ├── pages/              # HomePage, GalleryPage
    │   ├── components/         # Section components
    │   ├── hooks/              # Custom data-fetching hooks
    │   └── services/           # api.js (axios instance)
    ├── public/                 # Static assets, fonts, category images/videos
    └── package.json
```

---

## Backend — Laravel API

### Controllers Overview

| Controller | Responsibility |
|---|---|
| `AuthController` | Login, logout, fetch authenticated user (`/me`) |
| `GalleryController` | CRUD galleries, upload/delete/update gallery images |
| `GalleryCategoryController` | Manage gallery categories; public listing endpoint |
| `TestimonialController` | CRUD testimonials; public listing |
| `TeamMemberController` | CRUD team members; public listing |
| `VideoController` | Full CRUD for videos (protected) |
| `ContactController` | Read/update studio contact settings |
| `InquiryController` | Store public inquiries; protected list/view/delete |
| `WebsiteSettingsController` | Read/update hero settings; manage slider images |

### Service Layer

Business logic is separated into service classes under `app/Services/`. Controllers delegate work to services (e.g., `GalleryService`) keeping controllers thin. This is the recommended pattern for extending functionality.

### Models

| Model | Key Relations / Features |
|---|---|
| `GalleryModel` | `HasMedia` (Spatie), belongs to `GalleryCategoryModel` |
| `GalleryCategoryModel` | Has many galleries |
| `TeamMemberModel` | `HasMedia` for profile photos |
| `TestimonialModel` | Stores client name, review, rating |
| `VideoModel` | Stores video URL/embed and metadata |
| `InquiryModel` | Stores visitor contact form submissions |
| `ContactModel` | Singleton — studio contact details + website content |
| `User` | Laravel default; uses Sanctum for token generation |

---

## Admin Panel — Vue.js

### Pages & Routes

| Route | Page Component | Description |
|---|---|---|
| `/dashboard` | `DashboardPage.vue` | Overview statistics |
| `/galleries` | `GalleriesPage.vue` | Gallery list, create, edit, delete |
| `/photos` | `PhotosPage.vue` | Per-gallery photo upload and management |
| `/videos` | `VideosPage.vue` | Video entries management |
| `/categories` | `CategoriesPage.vue` | Gallery category CRUD |
| `/testimonials` | `TestimonialsPage.vue` | Client testimonial CRUD |
| `/team-members` | `TeamMembersPage.vue` | Team member CRUD |
| `/inquiries` | `InquiriesPage.vue` | View and manage contact inquiries |
| `/settings` | `SettingsPage.vue` | Studio/profile settings |
| `/settings/website` | `WebsiteSettingsPage.vue` | Hero slider, website copy |
| `/login` | `LoginPage.vue` | Auth page (guest-only route) |

### Pinia Stores

| Store | Purpose |
|---|---|
| `auth.store.ts` | JWT token, user session, `isAuthenticated`, `hasPermission()` |
| `gallery.store.ts` | Gallery list, pagination, CRUD actions |
| `category.store.ts` | Category list and mutations |
| `team-member.store.ts` | Team member state |
| `testimonial.store.ts` | Testimonial state |
| `video.store.ts` | Video state |
| `inquiry.store.ts` | Inquiry list and detail |
| `website-settings.store.ts` | Website settings state |
| `ui.store.ts` | Toast notifications, confirm dialogs, loading states |

### Router Guards

`router/index.ts` implements three navigation guards:

- **`requiresAuth`** — redirects unauthenticated users to `/login`
- **`guestOnly`** — redirects authenticated users away from `/login` to `/dashboard`
- **Permission check** — reads `to.meta.permission` and verifies against `auth.hasPermission()`

The guard also bootstraps the auth session: if a token exists in storage but no user is loaded, it calls `auth.fetchMe()` before evaluating guards.

### Axios Configuration

`utils/axios.ts` creates a configured Axios instance that:

- Sets `baseURL` from `VITE_API_BASE_URL`
- Attaches the Bearer token from Pinia auth store on every request
- Handles 401 responses by clearing the session and redirecting to login

---

## Landing Page — React.js

### Pages

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage.jsx` | Full one-page landing with all sections |
| `/gallery/:category` | `GalleryPage.jsx` | Gallery detail page filtered by category slug |

### Section Components

| Component | Data Source |
|---|---|
| `HeroCarousel` | `useWebsiteSettings` hook → hero slider images from API |
| `DescriptionSection` | `useWebsiteSettings` hook → website content copy |
| `CategorySection` | `useGalleryCategories` hook → categories from API |
| `TestimonialSection` | `useTestimonials` hook |
| `TeamSection` | `useTeamMembers` hook |
| `ContactSection` | `useContactSettings` hook |
| `Navbar` | Static |
| `Footer` | Static |
| `Preloader` | Animation (GSAP) |

### Custom Hooks

Each hook in `src/hooks/` manages fetching, loading state, and error handling for one API resource (e.g., `useGalleryCategories.js`, `useTeamMembers.js`). They return `{ data, loading, error }` tuples and are the recommended pattern for adding new data sources.

---

## Environment Configuration

### Backend (`/.env`)

```env
APP_NAME=Laravel
APP_URL=http://localhost          # Set to your domain in production

DB_CONNECTION=sqlite              # Change to mysql for production
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=wedding_management
# DB_USERNAME=root
# DB_PASSWORD=

FILESYSTEM_DISK=local             # Change to s3 for cloud storage

MAIL_MAILER=log                   # Configure smtp for production emails
MAIL_FROM_ADDRESS="hello@example.com"
```

### Admin Panel (`/admin-panel/.env`)

```env
VITE_API_BASE_URL=http://localhost/api
VITE_APP_NAME=ACP Admin
```

### Landing Page (`/react-version/.env`)

```env
VITE_API_BASE_URL=http://wedding-management.test/api
```

---

## Database Schema

### Key Tables

**`gallery_categories`** — `id`, `name`, `slug`, `created_at`, `updated_at`

**`galleries`** — `id`, `title`, `slug`, `description`, `gallery_category_id` (FK), `cover_image_id`, `created_at`, `updated_at`

**`media`** — Managed by Spatie MediaLibrary. Stores all uploaded files with conversion paths (thumb, medium).

**`team_members`** — `id`, `name`, `role`, `bio`, `order`, `created_at`, `updated_at`

**`testimonials`** — `id`, `client_name`, `review`, `rating`, `created_at`, `updated_at`

**`videos`** — `id`, `title`, `url`, `description`, `created_at`, `updated_at`

**`contacts`** — `id`, `phone`, `email`, `address`, `instagram_url`, `facebook_url`, `website_content` (JSON), `created_at`, `updated_at`

**`inquiries`** — `id`, `name`, `email`, `phone`, `message`, `created_at`, `updated_at`

**`personal_access_tokens`** — Laravel Sanctum tokens table

### Running Migrations

```bash
php artisan migrate
# or fresh with seed
php artisan migrate:fresh --seed
```

---

## API Reference

### Public Endpoints (no auth required)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/login` | Authenticate; returns `access_token` |
| `GET` | `/api/galleries` | List galleries (supports `search`, `gallery_category_id`, `page`, `per_page`) |
| `GET` | `/api/galleries/{slug}` | Get single gallery by slug |
| `GET` | `/api/gallery-categories` | List all categories |
| `GET` | `/api/team-members` | List team members |
| `GET` | `/api/team-members/{id}` | Get single team member |
| `GET` | `/api/testimonials` | List testimonials |
| `GET` | `/api/settings/website` | Get website/hero settings |
| `GET` | `/api/contact-settings` | Get contact details |
| `POST` | `/api/inquiries` | Submit a visitor inquiry |

### Protected Endpoints (Bearer token required)

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/me` | Fetch authenticated user |
| `POST` | `/api/logout` | Invalidate current token |

**Gallery Categories**
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/gallery-categories` | Create category |
| `PUT` | `/api/gallery-categories/{id}` | Update category |
| `DELETE` | `/api/gallery-categories/{id}` | Delete category |

**Galleries**
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/galleries` | Create gallery (multipart, includes `cover_image`) |
| `PUT` | `/api/galleries/{id}` | Update gallery |
| `DELETE` | `/api/galleries/{id}` | Delete gallery |
| `POST` | `/api/galleries/add-images` | Upload images to a gallery (`gallery_id` + `images[]`) |
| `GET` | `/api/gallery-images/{id}` | Get all images for a gallery |
| `PUT` | `/api/gallery-images/{mediaId}` | Update image alt text |
| `DELETE` | `/api/gallery-images/{mediaId}` | Delete a single image |

**Videos**
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/videos` | List / Create |
| `GET/PUT/DELETE` | `/api/videos/{id}` | Show / Update / Delete |

**Settings**
| Method | Endpoint | Description |
|---|---|---|
| `PUT` | `/api/settings/website` | Update hero/website settings |
| `POST` | `/api/settings/website/slider-images` | Upload slider images |
| `DELETE` | `/api/settings/website/slider-images/{mediaId}` | Delete a slider image |
| `POST` | `/api/contact-settings` | Update contact details |

**Inquiries**
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/inquiries` | List all inquiries |
| `GET` | `/api/inquiries/{id}` | View single inquiry |
| `DELETE` | `/api/inquiries/{id}` | Delete inquiry |

---

## Authentication

The system uses **Laravel Sanctum** with token-based (not cookie-based) authentication, suitable for SPAs on separate origins.

**Login flow:**
1. `POST /api/login` with `{ email, password }`
2. Server returns `{ access_token, user }`
3. Client stores token (Pinia + localStorage in admin panel)
4. All subsequent protected requests include `Authorization: Bearer <token>`

**Token invalidation:**
`POST /api/logout` deletes the current token via `currentAccessToken()->delete()`.

---

## Media Handling

Media is managed by **Spatie Laravel MediaLibrary**. Images are stored under `storage/app/public/{id}/` with automatic conversions generated:

- `thumb` — thumbnail size
- `medium` — medium display size

The `GalleryModel` and `TeamMemberModel` use the `HasMedia` interface. When uploading via the API, files are passed as `UploadedFile` objects and the service layer calls `addMedia()`.

To make media publicly accessible, ensure the storage symlink exists:

```bash
php artisan storage:link
```

---

## Development Setup

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ and npm
- SQLite (default) or MySQL

### 1. Backend

```bash
# Install dependencies
composer install

# Copy and configure environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Create storage symlink
php artisan storage:link

# Start dev server
php artisan serve
# API available at http://localhost:8000/api
```

### 2. Admin Panel

```bash
cd admin-panel

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000/api

# Start dev server
npm run dev
# Available at http://localhost:5173
```

### 3. Landing Page

```bash
cd react-version

# Install dependencies
npm install

# Configure environment
# Edit .env → VITE_API_BASE_URL=http://localhost:8000/api

# Start dev server
npm run dev
# Available at http://localhost:5174
```

---

## Build & Deployment

### Backend

```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Point your web server (Nginx/Apache) document root to `public/`.

### Admin Panel

```bash
cd admin-panel
npm run build
# Output: admin-panel/dist/
```

Deploy `dist/` to your static hosting or a sub-path on the server (e.g., `/admin`).

### Landing Page

```bash
cd react-version
npm run build
# Output: react-version/dist/
```

Deploy `dist/` to your static hosting or the server root.

### CORS Configuration

For production, update `config/cors.php` in Laravel to allow requests only from your frontend domains:

```php
'allowed_origins' => ['https://yourdomain.com', 'https://admin.yourdomain.com'],
```

### Production `.env` Checklist

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://yourdomain.com`
- `DB_CONNECTION=mysql` with proper credentials
- `FILESYSTEM_DISK=public` (or `s3` for cloud)
- Mail settings configured for real email delivery
