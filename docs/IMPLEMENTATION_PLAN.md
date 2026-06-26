# ACP Admin Panel Vue.js Implementation Plan

## Project Overview

This plan converts the existing `acp-admin-panel.html` design into a production-ready Vue.js admin frontend for Anil Chauhan Photography. The provided HTML is a complete single-page Alpine.js prototype with hardcoded data, inline CSS, Chart.js analytics, shared modals, upload zones, tables, grid cards, tabs, toast notifications, and a collapsible admin shell.

The backend APIs are assumed to be complete. The frontend scope is to rebuild the design as a maintainable Vue 3 application, connect each module to the APIs, and preserve the visual language and workflows from the HTML mockup.

## Existing HTML Analysis

### Technology and Current Behavior

| Area | Current HTML Implementation | Vue Migration Direction |
|---|---|---|
| App state | Alpine `acpAdmin()` object with `page`, `modal`, tabs, toast, and mock arrays | Vue Router for pages, Pinia stores for domain state, composables for UI behavior |
| Navigation | Single shell with `page` string switching content via `x-show` | Route-based navigation with protected admin routes |
| Styling | Inline CSS variables and utility classes | Extract to global design tokens, base CSS, and component-scoped styles |
| Charts | Chart.js bar chart on Dashboard | Vue chart wrapper/composable around Chart.js |
| Drag and drop | Upload zones and Sortable dependency | File upload composable plus Sortable/Vue draggable for service ordering and photo ordering |
| Modals | Global `modal` string controls all modal variants | Reusable modal plus domain-specific form dialogs |
| Toasts | Single toast state | UI store or toast composable with queue support |

### Page Structure

The HTML is organized as:

| Section | Main Elements |
|---|---|
| Sidebar | Brand block, navigation sections, module badges, signed-in user area |
| Topbar | Sidebar toggle, breadcrumb/current page title, global search, notifications, compact profile chip |
| Dashboard | Stat cards, upload activity chart, recent uploads, quick actions, storage overview |
| Gallery Management | Search/filter toolbar, table, selection checkboxes, status badges, pagination, create/edit/delete modal |
| Photo Management | Drag/drop upload zone, gallery assignment, grid/list toggle controls, image grid, edit/delete actions, pagination |
| Video Management | Add video form card, video card grid, thumbnail/play overlay, edit/delete actions |
| Categories | Category cards with image, gallery counts, edit/delete actions, dashed add-new card |
| Website Content | Tabbed editor: Hero, About, Services, Contact, SEO |
| Testimonials | Testimonial cards, ratings, featured toggle, create/edit/delete modal |
| Users | Searchable users table, roles, status badges, create/edit/remove modal with permissions |
| Settings | Tabbed editor: General, Social Media, Footer, Security |
| Modals | Gallery, video, category, testimonial, user, photo, confirmation, quick upload |
| Toast | Success/delete/upload feedback |

### Navigation Modules

| Group | Items | Target Routes |
|---|---|---|
| Overview | Dashboard | `/dashboard` |
| Media Library | Galleries, Photos, Videos, Categories | `/galleries`, `/photos`, `/videos`, `/categories` |
| Website | Website Content, Testimonials | `/content`, `/testimonials` |
| Admin | Users, Settings | `/users`, `/settings` |

The sidebar supports collapsed and expanded states. The topbar breadcrumb currently reflects the active page title and should be route-meta driven in Vue.

### Dashboard Widgets

| Widget | Current Data | API-backed Data |
|---|---|---|
| Total Galleries | `12` | Gallery count, published/draft breakdown |
| Total Photos | `847` | Photo count and upload growth |
| Total Videos | `34` | Video count and upload growth |
| Categories | `6` | Category count |
| Upload Activity | Static Chart.js data for photos/videos by month | Analytics endpoint with time range filter |
| Recent Uploads | Mock mixed photo/video list | Recent media endpoint |
| Quick Actions | Links to create/upload flows | Router navigation plus modal launch |
| Storage Overview | Static progress bars | Storage usage endpoint by media type |

### Data Tables

| Table | Columns | Required Features |
|---|---|---|
| Galleries | Select, gallery cover/name/description, category, photo count, status, date, actions | Search, filters, bulk select, pagination, CRUD actions |
| Users | User, role, status, last login, actions | Search, role filter, activation status, role/permission editing |

Use a reusable table system for sorting, loading rows, empty states, row actions, selectable rows, and pagination.

### Forms and Modals

| Modal/Form | Fields |
|---|---|
| Gallery create/edit | Name, description, category, status, cover image |
| Quick upload | Gallery select, file drop/browse |
| Photo edit | Preview, title, description, gallery |
| Video add/edit | URL, title, platform, category, description, thumbnail handling |
| Category add/edit | Name, slug, tagline, category image |
| Testimonial add/edit | Client name, shoot type, testimonial text, rating, client photo, featured status |
| User add/edit | Full name, email, role, password fields, permissions |
| Confirm delete | Title, body, cancel/delete actions |
| Content/settings forms | Section-specific editor fields and uploads |

Validation should be handled with `vee-validate` and `yup`, already present in the `admin-panel` dependencies.

### Upload Components

The design contains upload zones for:

| Upload Area | Needs |
|---|---|
| Photo uploads | Multi-file drag/drop, gallery assignment, progress, retry, validation |
| Gallery cover | Single image upload, preview, replace/remove |
| Category image | Single image upload |
| Hero background images | Multi-image upload and ordering |
| About photo | Single image upload |
| SEO OG image | Single image upload with dimensions recommendation |
| Logo upload | Single image upload |
| Testimonial client photo | Optional single image upload |
| Video thumbnail | Auto-fetch from platform when possible, manual override upload if API supports |

### Gallery Management

The gallery screen is table-first and should support listing, create/edit/delete, status changes, category filters, search, pagination, and selection for bulk actions. Gallery records should include cover image, title, description/location, category, photo count, status, created/published date, slug, and optional sort order.

### Photo Management

The photo screen is visual and upload-heavy. It needs gallery assignment, grid/list view toggle, search, gallery filter, bulk selection, bulk delete/move/status actions, drag/drop upload, upload progress, photo edit dialog, preview support, and pagination/infinite loading depending on API constraints.

### Video Management

The video screen supports URL-based video creation, platform detection for YouTube/Vimeo, title/category/description fields, thumbnails, grid cards, edit/delete, and optional published status if the API exposes it.

### Categories Management

Categories are shown as image cards with counts and actions. The production version should add slug management, active/inactive status if supported, ordering, create/edit/delete, and delete protection when a category has galleries.

### Website Content Management

The content module is tab-based:

| Tab | Fields and Behavior |
|---|---|
| Hero Section | Headline, sub-headline, CTA text, CTA link, background images, preview, save |
| About Us | Section title, description, years of experience, about photo, team list |
| Services | Service list with image, name, tagline, enable toggle, drag ordering |
| Contact | Phone, WhatsApp, email, address, Google Maps embed URL, business hours |
| SEO | Meta title, meta description, keywords, OG image |

Save each tab independently to reduce risk of overwriting unrelated content.

### Testimonials Management

Testimonials are card-based with client initials/photo, shoot type, rating, testimonial text, featured toggle, edit/delete actions, and status management. Production should support published/draft state, featured state, sort order, and moderation if the public site can submit testimonials.

### User Management

User management includes a searchable table, roles, active/inactive badges, last login, and an add/edit modal with permissions. Production should implement role-based access control at both route and action level, with guardrails around removing or demoting the current Super Admin.

### Settings Module

The settings module is tab-based:

| Tab | Fields |
|---|---|
| General | Current logo, logo upload, website name, tagline, primary color |
| Social Media | Instagram, Facebook, YouTube, WhatsApp, LinkedIn, Pinterest |
| Footer | Footer tagline, copyright text, footer about text |
| Security | Change password, two-factor toggle |

Settings should be loaded once on route entry and saved by section.

### Charts and Analytics

Dashboard analytics currently use a Chart.js grouped bar chart for photo/video uploads by month. Production should preserve Chart.js and introduce a reusable chart component that accepts labels, datasets, loading state, empty state, and range filters.

### Responsive Behavior

The HTML uses fixed sidebar widths, responsive grids, horizontal table scrolling, and card grids:

| Pattern | Production Requirement |
|---|---|
| Sidebar | Collapsible on desktop, drawer/off-canvas behavior on mobile |
| Topbar search/profile | Hide or compress secondary actions on small screens |
| `grid-4`, `grid-3`, `grid-2` | Responsive CSS grid utilities |
| Tables | Horizontal scroll plus mobile-friendly row density |
| Photo grid | Auto-fill cards with stable image aspect ratio |
| Modals | Max-height scrolling, full-width mobile presentation |
| Upload zones | Touch-friendly browse button, drag/drop enhancement on desktop |

### Reusable UI Components Identified

| Component | Purpose |
|---|---|
| `AdminLayout` | Sidebar, topbar, route outlet, global dialogs/toasts |
| `SidebarNav` | Grouped navigation, collapsed labels, active route |
| `Topbar` | Toggle, breadcrumb, search, notifications, profile menu |
| `PageHeader` | Title, subtitle, primary actions |
| `StatCard` | Dashboard metric cards |
| `BaseCard` | Shared card shell |
| `DataTable` | Table with loading, empty, sorting, selection, actions |
| `Pagination` | Page controls and result count |
| `SearchInput` | Debounced search input |
| `FilterBar` | Search/select/reset layouts |
| `BaseModal` | Accessible modal shell |
| `ConfirmDialog` | Reusable destructive action confirmation |
| `BaseInput`, `BaseSelect`, `BaseTextarea`, `BaseToggle`, `BaseColorInput` | Form controls |
| `UploadDropzone` | Drag/drop and browse file input |
| `MediaGrid` | Photo cards with overlays and selection |
| `VideoCard` | Video thumbnail card with platform/play UI |
| `CategoryCard` | Category image/count/actions |
| `TestimonialCard` | Rating, client info, featured toggle |
| `ToastContainer` | Toast queue |
| `LoadingState`, `EmptyState`, `ErrorState` | Consistent async states |
| `Tabs` | Content/settings tab navigation |

## Recommended Vue.js Architecture

The repository already contains an `admin-panel` Vue/Vite workspace with Vue 3, Vue Router, Pinia, Axios, Chart.js, Vee Validate, Yup, and VueUse. Build on that workspace.

### Folder Structure

```text
admin-panel/
└── src/
    ├── api/
    │   ├── endpoints.ts
    │   └── http.ts
    ├── assets/
    │   ├── css/
    │   │   ├── main.css
    │   │   ├── tokens.css
    │   │   └── utilities.css
    │   └── icons/
    ├── components/
    │   ├── common/
    │   │   ├── BaseButton.vue
    │   │   ├── BaseCard.vue
    │   │   ├── BaseModal.vue
    │   │   ├── ConfirmDialog.vue
    │   │   ├── DataTable.vue
    │   │   ├── EmptyState.vue
    │   │   ├── ErrorState.vue
    │   │   ├── LoadingState.vue
    │   │   ├── Pagination.vue
    │   │   ├── SearchInput.vue
    │   │   ├── Tabs.vue
    │   │   └── ToastContainer.vue
    │   ├── dashboard/
    │   ├── galleries/
    │   ├── photos/
    │   ├── videos/
    │   ├── categories/
    │   ├── content/
    │   ├── testimonials/
    │   ├── users/
    │   ├── settings/
    │   └── shared/
    │       ├── FilterBar.vue
    │       ├── FormActions.vue
    │       ├── StatusBadge.vue
    │       └── UploadDropzone.vue
    ├── composables/
    │   ├── useConfirm.ts
    │   ├── useDebouncedSearch.ts
    │   ├── useFileUpload.ts
    │   ├── usePagination.ts
    │   ├── usePermissions.ts
    │   └── useToast.ts
    ├── layouts/
    │   ├── AdminLayout.vue
    │   └── AuthLayout.vue
    ├── pages/
    │   ├── auth/
    │   ├── DashboardPage.vue
    │   ├── GalleriesPage.vue
    │   ├── PhotosPage.vue
    │   ├── VideosPage.vue
    │   ├── CategoriesPage.vue
    │   ├── WebsiteContentPage.vue
    │   ├── TestimonialsPage.vue
    │   ├── UsersPage.vue
    │   ├── SettingsPage.vue
    │   └── NotFoundPage.vue
    ├── router/
    │   └── index.ts
    ├── services/
    │   ├── auth.service.ts
    │   ├── dashboard.service.ts
    │   ├── gallery.service.ts
    │   ├── photo.service.ts
    │   ├── video.service.ts
    │   ├── category.service.ts
    │   ├── content.service.ts
    │   ├── testimonial.service.ts
    │   ├── user.service.ts
    │   ├── settings.service.ts
    │   └── upload.service.ts
    ├── stores/
    │   ├── auth.store.ts
    │   ├── dashboard.store.ts
    │   ├── gallery.store.ts
    │   ├── photo.store.ts
    │   ├── video.store.ts
    │   ├── category.store.ts
    │   ├── content.store.ts
    │   ├── testimonial.store.ts
    │   ├── user.store.ts
    │   ├── settings.store.ts
    │   └── ui.store.ts
    ├── types/
    └── utils/
```

## Route Structure

| Route | Page | Auth | Notes |
|---|---|---|---|
| `/login` | Login page | Guest | Redirect authenticated users to dashboard |
| `/forgot-password` | Forgot password | Guest | Optional if API exists |
| `/dashboard` | Dashboard | Required | Default admin landing |
| `/galleries` | Galleries | Required, galleries permission | Table/list management |
| `/photos` | Photos | Required, photos permission | Upload and media grid |
| `/videos` | Videos | Required, videos permission | Video CRUD |
| `/categories` | Categories | Required, categories permission | Category cards |
| `/content` | Website Content | Required, content permission | Tabbed editor |
| `/testimonials` | Testimonials | Required, testimonials permission | Cards and status |
| `/users` | Users | Required, users permission | RBAC protected |
| `/settings` | Settings | Required, settings permission | General/social/footer/security |
| `/:pathMatch(.*)*` | Not Found | Either | Route fallback |

Default redirect: `/` -> `/dashboard` when authenticated, otherwise `/login`.

## Page-by-Page Implementation Breakdown

### Dashboard

**Required API calls**

| Purpose | Suggested Service Method |
|---|---|
| Summary counts | `dashboardService.getStats()` |
| Upload chart data | `dashboardService.getUploadActivity({ range })` |
| Recent uploads | `dashboardService.getRecentUploads({ limit: 5 })` |
| Storage usage | `dashboardService.getStorageUsage()` |

**Components needed**

- `DashboardStatsGrid`
- `StatCard`
- `UploadActivityChart`
- `RecentUploadsList`
- `QuickActionsGrid`
- `StorageOverview`
- `QuickUploadModal`

**State management**

- `dashboard.store.ts` stores stats, chart range, chart data, recent uploads, storage usage, loading flags, and errors.
- Quick action modal state can live in `ui.store.ts` or page-local refs.

**Charts implementation**

- Use Chart.js with a Vue component wrapper.
- Destroy chart instances on unmount.
- Re-render on range or dataset changes.
- Provide chart loading and empty states.

### Galleries

**Required API calls**

| Purpose | Suggested Service Method |
|---|---|
| List galleries | `galleryService.list(params)` |
| Create gallery | `galleryService.create(payload)` |
| Update gallery | `galleryService.update(id, payload)` |
| Delete gallery | `galleryService.remove(id)` |
| Bulk delete/status | `galleryService.bulkAction(payload)` |
| Upload cover | `uploadService.uploadGalleryCover(file)` |

**Components needed**

- `GalleryFilterBar`
- `GalleryTable`
- `GalleryFormModal`
- `GalleryCoverUpload`
- `StatusBadge`
- `Pagination`
- `ConfirmDialog`

**State management**

- `gallery.store.ts` stores list, selected IDs, query params, pagination meta, current gallery, loading, saving, deleting, and errors.

**Features**

- Search by name/description.
- Filter by category and status.
- Pagination with API metadata.
- Create/edit/delete.
- Bulk selection and bulk actions.
- Preserve query params in route for shareable filtered views.

### Photos

**Required API calls**

| Purpose | Suggested Service Method |
|---|---|
| List photos | `photoService.list(params)` |
| Upload photos | `photoService.upload(files, galleryId, options)` |
| Update photo | `photoService.update(id, payload)` |
| Delete photo | `photoService.remove(id)` |
| Bulk action | `photoService.bulkAction(payload)` |
| Move photos | `photoService.moveToGallery(payload)` |
| Reorder photos | `photoService.reorder(payload)` |
| Gallery options | `galleryService.options()` |

**Components needed**

- `PhotoUploadPanel`
- `UploadDropzone`
- `PhotoToolbar`
- `PhotoGrid`
- `PhotoList`
- `PhotoCard`
- `PhotoEditModal`
- `BulkActionsBar`
- `Pagination`

**State management**

- `photo.store.ts` stores photos, selected IDs, view mode, gallery filter, search query, pagination, upload queue, progress, failures, and current photo.

**Features**

- Drag/drop multi-upload with progress.
- Gallery assignment before upload.
- File validation: JPG, PNG, WEBP, max size from API/config.
- Grid/list toggle.
- Bulk delete, move gallery, publish/unpublish if supported.
- Preview/edit/delete overlays.
- Optional drag ordering within selected gallery.

### Videos

**Required API calls**

| Purpose | Suggested Service Method |
|---|---|
| List videos | `videoService.list(params)` |
| Create video | `videoService.create(payload)` |
| Update video | `videoService.update(id, payload)` |
| Delete video | `videoService.remove(id)` |
| Fetch metadata | `videoService.fetchMetadata(url)` |
| Upload thumbnail | `uploadService.uploadVideoThumbnail(file)` |

**Components needed**

- `VideoFormCard`
- `VideoFormModal`
- `VideoGrid`
- `VideoCard`
- `VideoThumbnailPicker`
- `ConfirmDialog`

**State management**

- `video.store.ts` stores list, filters, current video, metadata loading, saving, deleting, pagination if API supports it.

**Features**

- YouTube/Vimeo URL validation.
- Platform detection.
- Auto thumbnail retrieval when possible.
- Manual thumbnail override if backend supports it.
- CRUD operations.

### Categories

**Required API calls**

| Purpose | Suggested Service Method |
|---|---|
| List categories | `categoryService.list(params)` |
| Create category | `categoryService.create(payload)` |
| Update category | `categoryService.update(id, payload)` |
| Delete category | `categoryService.remove(id)` |
| Reorder categories | `categoryService.reorder(payload)` |
| Upload image | `uploadService.uploadCategoryImage(file)` |

**Components needed**

- `CategoryGrid`
- `CategoryCard`
- `CategoryFormModal`
- `CategoryImageUpload`
- `ConfirmDialog`

**State management**

- `category.store.ts` stores categories, current category, loading, saving, deleting, and ordering state.

**Features**

- CRUD operations.
- Slug validation.
- Image upload.
- Gallery count display.
- Prevent delete or warn when galleries are attached.
- Optional drag sorting.

### Website Content

**Required API calls**

| Purpose | Suggested Service Method |
|---|---|
| Get all content | `contentService.getAll()` |
| Update hero | `contentService.updateSection('hero', payload)` |
| Update about | `contentService.updateSection('about', payload)` |
| Update services | `contentService.updateSection('services', payload)` |
| Update contact | `contentService.updateSection('contact', payload)` |
| Update SEO | `contentService.updateSection('seo', payload)` |
| Upload content asset | `uploadService.uploadContentAsset(file, context)` |
| Reorder services/team | `contentService.reorderItems(section, payload)` |

**Components needed**

- `ContentTabs`
- `HeroContentForm`
- `AboutContentForm`
- `ServicesEditor`
- `ContactContentForm`
- `SeoContentForm`
- `TeamListEditor`
- `ServiceListEditor`
- `UploadDropzone`

**State management**

- `content.store.ts` stores section data, active tab, dirty state per section, saving state per section, and validation errors.

**Features**

- Section-level saving.
- Preview action for public site preview if API supports draft preview.
- Draggable services ordering.
- Team list editing from the existing mock `team` data.
- Upload handling for hero, about, service, and OG images.

### Testimonials

**Required API calls**

| Purpose | Suggested Service Method |
|---|---|
| List testimonials | `testimonialService.list(params)` |
| Create testimonial | `testimonialService.create(payload)` |
| Update testimonial | `testimonialService.update(id, payload)` |
| Delete testimonial | `testimonialService.remove(id)` |
| Toggle featured/status | `testimonialService.updateStatus(id, payload)` |
| Upload client photo | `uploadService.uploadTestimonialPhoto(file)` |

**Components needed**

- `TestimonialGrid`
- `TestimonialCard`
- `TestimonialFormModal`
- `RatingInput`
- `FeaturedToggle`
- `ConfirmDialog`

**State management**

- `testimonial.store.ts` stores testimonials, filters, current testimonial, saving/deleting states, and toggle state.

**Features**

- CRUD operations.
- Rating input.
- Featured toggle.
- Published/draft or active/inactive status if API supports it.
- Optional sorting.

### Users

**Required API calls**

| Purpose | Suggested Service Method |
|---|---|
| List users | `userService.list(params)` |
| Create user | `userService.create(payload)` |
| Update user | `userService.update(id, payload)` |
| Remove/deactivate user | `userService.remove(id)` or `userService.deactivate(id)` |
| Roles | `userService.getRoles()` |
| Permissions | `userService.getPermissions()` |
| Update role/permissions | `userService.updatePermissions(id, payload)` |

**Components needed**

- `UsersTable`
- `UserFormModal`
- `RoleSelect`
- `PermissionsMatrix`
- `UserStatusBadge`
- `ConfirmDialog`

**State management**

- `user.store.ts` stores users, roles, permissions, query params, current user, saving/deleting states, and errors.
- `auth.store.ts` stores current user and permissions for route/action guards.

**Features**

- Search users.
- Role and active status display.
- Create/edit users.
- Permission assignment.
- Protect current user from self-removal.
- Disable user-management UI when permission is missing.

### Settings

**Required API calls**

| Purpose | Suggested Service Method |
|---|---|
| Get settings | `settingsService.get()` |
| Update general | `settingsService.updateGeneral(payload)` |
| Update social | `settingsService.updateSocial(payload)` |
| Update footer | `settingsService.updateFooter(payload)` |
| Update security | `settingsService.updateSecurity(payload)` |
| Upload logo | `uploadService.uploadLogo(file)` |

**Components needed**

- `SettingsTabs`
- `GeneralSettingsForm`
- `SocialSettingsForm`
- `FooterSettingsForm`
- `SecuritySettingsForm`
- `LogoUploadCard`
- `ColorPickerInput`

**State management**

- `settings.store.ts` stores active tab, settings data, dirty state, saving flags, and section-level errors.

**Features**

- Section-level saving.
- Logo preview/upload.
- Color input for primary brand color.
- Change password validation.
- Two-factor toggle if backend supports it.

## Component Design Details

### Reusable Table Component

`DataTable.vue` should support:

- Column definitions with label, key, width, sortable flag, and custom cell slot.
- Loading skeleton rows.
- Empty state slot.
- Error state slot.
- Row selection and select-all.
- Row actions slot.
- Sort state emitted to parent/store.
- Responsive horizontal scroll.

### Reusable Modal Component

`BaseModal.vue` should support:

- Title slot and body slot.
- ESC close and backdrop close.
- Focus trap.
- Scroll locking.
- Max width variants.
- Loading/disabled action states.
- Accessible labels and roles.

### Reusable Form Inputs

Use form components that integrate with `vee-validate`:

- `BaseInput`
- `BaseTextarea`
- `BaseSelect`
- `BaseToggle`
- `BaseCheckbox`
- `BaseColorInput`
- `RatingInput`

Each should render label, helper text, error text, disabled state, and required state.

### Upload Component

`UploadDropzone.vue` should support:

- Single or multiple files.
- Accepted MIME types.
- Max file size.
- Drag active state.
- Preview thumbnails.
- Upload progress.
- Remove file.
- Retry failed file.
- `v-model` for selected files or asset object.

### Pagination Component

`Pagination.vue` should support:

- Current page.
- Per page.
- Total items.
- Last page.
- Previous/next.
- Compact ellipsis display.
- Result summary text.

### Search Component

`SearchInput.vue` should support:

- Debounced `v-model`.
- Clear button.
- Placeholder.
- Global topbar or page-level variants.

### Confirmation Dialog

Use a composable-driven `ConfirmDialog.vue`:

- `useConfirm().confirm({ title, message, confirmText, variant })`
- Promise-based result.
- Destructive styling for delete/remove.

### Toast Notifications

Use `ui.store.ts` or `useToast.ts`:

- Success, error, warning, info variants.
- Queue support.
- Auto-dismiss.
- Manual close.
- API error normalization.

### Loading and Empty States

Every list page should define:

- Initial loading state.
- Refetch/loading overlay for filters.
- Empty state when no data exists.
- Empty search state when filters produce no results.
- Error state with retry.

## API Integration Strategy

### Axios Configuration

Create a central HTTP client in `src/api/http.ts` or extend the existing `src/utils/axios.ts`.

Required behavior:

- `baseURL` from `VITE_API_BASE_URL`.
- `Accept: application/json`.
- Attach auth token or use cookie credentials depending on backend auth.
- Timeout configuration.
- Abort/cancel support for search requests.
- Normalize Laravel validation errors if the backend is Laravel.

### API Service Layer

Services should be thin wrappers around HTTP calls. Stores call services; components call stores.

```text
services/
├── auth.service.ts
├── dashboard.service.ts
├── gallery.service.ts
├── photo.service.ts
├── video.service.ts
├── category.service.ts
├── content.service.ts
├── testimonial.service.ts
├── user.service.ts
├── settings.service.ts
└── upload.service.ts
```

### Authentication Handling

- `auth.store.ts` owns token/session, current user, permissions, login/logout, and `fetchMe`.
- Router guards enforce authenticated routes.
- Route metadata defines required permission keys.
- On `401`, clear session and redirect to login.
- On `403`, show forbidden page or toast and redirect to dashboard.
- Persist token in secure storage only if the backend uses bearer tokens. Prefer httpOnly cookies when available.

### Request Interceptors

- Add authorization header when token exists.
- Add request ID if useful for debugging.
- Add locale/timezone headers if backend needs them.
- Optionally add `X-Requested-With: XMLHttpRequest`.

### Response Interceptors

- Return normalized `data`.
- Handle `401`, `403`, `404`, `409`, `422`, `429`, and `500`.
- Convert validation errors into field-level maps.
- Show generic toast only for unexpected errors; form validation should stay in the form.

### Error Handling

Use `error.handler.ts` to normalize:

| Error Type | UI Behavior |
|---|---|
| Validation `422` | Field errors in form |
| Unauthorized `401` | Logout and redirect |
| Forbidden `403` | Forbidden message/page |
| Not found `404` | Item removed message and refetch |
| Conflict `409` | Show conflict message |
| Too many requests `429` | Show retry-after message |
| Server/network | Toast and retry option |

### File Upload Handling

- Use `FormData`.
- Use `onUploadProgress` for progress bars.
- Allow cancellation via `AbortController`.
- Upload files directly to module endpoints or central upload endpoint depending on API.
- Validate file type/size before network request.
- Refresh affected lists after successful uploads.

### Pagination Handling

Support a shared query shape:

```text
page
per_page
search
sort
direction
filters[]
```

Normalize API pagination into:

```text
currentPage
perPage
total
lastPage
from
to
```

Preserve page-level query state in route query params for list pages.

## Pinia Store Architecture

| Store | Responsibilities |
|---|---|
| `auth.store.ts` | Login/logout, current user, token/session, permissions, route guard helpers |
| `dashboard.store.ts` | Dashboard stats, chart data, recent uploads, storage usage, loading/errors |
| `gallery.store.ts` | Gallery list, filters, pagination, selection, current gallery, CRUD |
| `photo.store.ts` | Photo list, upload queue, filters, view mode, selection, CRUD, bulk actions |
| `video.store.ts` | Video list, metadata fetching, current video, CRUD, thumbnails |
| `category.store.ts` | Category cards/list, CRUD, image upload, reorder |
| `content.store.ts` | Hero/about/services/contact/SEO content, active tab, dirty state, saves |
| `testimonial.store.ts` | Testimonial list, CRUD, featured/status toggles, ratings |
| `user.store.ts` | Admin users, roles, permissions, CRUD, activation/deactivation |
| `settings.store.ts` | General/social/footer/security settings, logo upload, saves |
| `ui.store.ts` | Sidebar state, toasts, confirmation dialog, global loading, modals if centralized |

## Type Model Recommendations

Use TypeScript interfaces for every API entity:

| Type File | Models |
|---|---|
| `gallery.types.ts` | `Gallery`, `GalleryPayload`, `GalleryFilters` |
| `photo.types.ts` | `Photo`, `PhotoPayload`, `PhotoFilters`, `UploadQueueItem` |
| `video.types.ts` | `Video`, `VideoPayload`, `VideoMetadata` |
| `category.types.ts` | `Category`, `CategoryPayload` |
| `content.types.ts` | `HeroContent`, `AboutContent`, `ServiceItem`, `ContactContent`, `SeoContent` |
| `testimonial.types.ts` | `Testimonial`, `TestimonialPayload` |
| `user.types.ts` | `AdminUser`, `Role`, `Permission`, `UserPayload` |
| `settings.types.ts` | `GeneralSettings`, `SocialSettings`, `FooterSettings`, `SecuritySettings` |
| `api.types.ts` | `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError` |

## Development Phases

### Phase 1: Project Setup, Router, Layouts, Authentication

**Tasks**

- Audit the existing `admin-panel` scaffold and align dependencies.
- Finalize design tokens from the HTML CSS variables.
- Build `AdminLayout`, `SidebarNav`, and `Topbar`.
- Configure Vue Router route metadata.
- Configure Axios client and API environment variables.
- Implement `auth.store.ts`, login page, logout, `fetchMe`, and route guards.
- Implement `ui.store.ts` for sidebar, toasts, and confirmation dialog.

**Checklist**

- [ ] App shell matches HTML sidebar/topbar layout.
- [ ] Collapsed sidebar persists across refreshes.
- [ ] Auth routes and protected routes work.
- [ ] API client handles `401` and `403`.
- [ ] Toast and confirm systems are available globally.

### Phase 2: Dashboard

**Tasks**

- Implement dashboard store and service.
- Build stat cards, chart component, recent uploads, quick actions, and storage overview.
- Add quick upload modal entry point.
- Add loading, empty, and error states.

**Checklist**

- [ ] Dashboard loads from APIs.
- [ ] Chart updates by selected range.
- [ ] Quick actions navigate or open correct modals.
- [ ] Storage usage displays real usage.

### Phase 3: Gallery Management

**Tasks**

- Implement gallery service/store.
- Build gallery filters and reusable table integration.
- Build create/edit gallery modal.
- Implement cover image upload.
- Implement delete and bulk actions.

**Checklist**

- [ ] Search/filter/pagination query params work.
- [ ] Gallery CRUD works.
- [ ] Cover upload previews and saves.
- [ ] Delete confirmation protects destructive action.

### Phase 4: Photo Management

**Tasks**

- Implement photo service/store and upload service behavior.
- Build drag/drop upload panel with queue and progress.
- Build photo grid/list views.
- Build photo edit modal.
- Implement bulk actions and gallery assignment.
- Add optional drag ordering when filtered to a gallery.

**Checklist**

- [ ] Multi-file upload works with progress and errors.
- [ ] Gallery filter/search/pagination work.
- [ ] Grid and list views are stable and responsive.
- [ ] Bulk actions update UI after API success.

### Phase 5: Video Management

**Tasks**

- Implement video service/store.
- Build video form card and modal.
- Implement URL validation and platform detection.
- Implement metadata/thumbnail fetch if API supports it.
- Build video cards and CRUD actions.

**Checklist**

- [ ] YouTube/Vimeo URLs validate.
- [ ] Video CRUD works.
- [ ] Thumbnails display correctly.
- [ ] Delete confirmation works.

### Phase 6: Content Management

**Tasks**

- Implement content service/store.
- Build tabbed content editor.
- Implement hero/about/contact/SEO forms.
- Implement services editor with drag ordering.
- Implement team list editor.
- Add asset uploads and section-level saving.

**Checklist**

- [ ] Each tab loads real content.
- [ ] Each tab saves independently.
- [ ] Services reorder persists.
- [ ] Uploads update previews.

### Phase 7: User and Settings

**Tasks**

- Implement user service/store and roles/permissions.
- Build users table, user modal, and permissions matrix.
- Implement settings service/store.
- Build general, social, footer, and security settings forms.
- Implement logo upload and password update.

**Checklist**

- [ ] User CRUD respects permissions.
- [ ] Current admin cannot accidentally remove own access.
- [ ] Settings save by section.
- [ ] Password update handles validation errors.

### Phase 8: Optimization and Testing

**Tasks**

- Add unit tests for stores, composables, and utilities.
- Add component tests for table, modal, upload, and pagination.
- Add route guard tests.
- Add accessibility checks for modals, buttons, forms, and keyboard navigation.
- Optimize images and lazy loading.
- Verify responsive behavior across desktop/tablet/mobile.
- Run production build and type check.

**Checklist**

- [ ] `npm run type-check` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] Core workflows manually verified against backend.

## Estimated Implementation Effort

| Module | Estimated Effort | Notes |
|---|---:|---|
| Phase 1: Setup/layout/auth | 2-3 days | Depends on backend auth shape |
| Dashboard | 1-2 days | Chart and stats are straightforward |
| Gallery Management | 2-3 days | Table, filters, cover upload, CRUD |
| Photo Management | 4-6 days | Highest complexity due to uploads, bulk actions, view modes |
| Video Management | 2 days | Metadata fetching may add time |
| Categories | 1-2 days | Cards plus image upload |
| Website Content | 3-5 days | Multiple forms, assets, service ordering |
| Testimonials | 1-2 days | Cards, modal, featured/status toggle |
| Users and permissions | 2-4 days | RBAC and safety rules increase complexity |
| Settings | 2-3 days | Multiple independent forms |
| Testing and responsive QA | 3-5 days | Should run continuously, with final hardening pass |

Total estimate: 23-37 development days depending on API consistency, upload requirements, and permission complexity.

## Risks and Recommendations

| Risk | Impact | Recommendation |
|---|---|---|
| API response shapes differ by module | Slower integration and duplicated mapping | Define shared pagination/error/resource contracts before implementation |
| File uploads are underspecified | Photo module delays | Confirm upload endpoints, max sizes, accepted types, storage URLs, and progress behavior early |
| Auth method unclear | Route guards and Axios setup may need rework | Confirm bearer token vs cookie/Sanctum before Phase 1 |
| Permissions model incomplete | Users module may expose unsafe actions | Require permission keys from backend and enforce both route and button/action guards |
| Large photo lists | Slow UI and heavy memory usage | Use server-side pagination, lazy image loading, and virtual scrolling if needed |
| Content editor overwrites | Editors may lose changes across tabs | Save sections independently and track dirty state |
| Inline mock design has repeated styles | Component drift | Extract design tokens and shared components before building pages |
| Chart.js lifecycle issues | Memory leaks or duplicate charts | Wrap chart lifecycle in a component/composable and destroy on unmount |

## Best Practices

- Keep API access in services and business state in Pinia stores.
- Keep pages thin: route params, store calls, and composition of components only.
- Use route metadata for titles, breadcrumbs, and permissions.
- Normalize API errors once and reuse everywhere.
- Use `vee-validate` and `yup` for form validation.
- Prefer section-level saves for settings and website content.
- Use optimistic UI only for low-risk toggles; refetch after destructive or bulk actions.
- Lazy-load admin pages with route-level code splitting.
- Lazy-load media images and include fallback thumbnails.
- Keep destructive actions behind `ConfirmDialog`.
- Preserve the HTML design tokens: charcoal sidebar, gold accents, cream background, serif headings, compact table/card density.
- Add automated tests around stores, composables, route guards, and reusable components before broad page duplication.
- Verify all screens at desktop, tablet, and mobile widths before release.

## API Contract Checklist

Confirm these with the backend before implementation starts:

- [ ] Auth login/logout/me endpoints and auth storage strategy.
- [ ] Permission keys for each module and action.
- [ ] Pagination response format.
- [ ] Validation error response format.
- [ ] Gallery CRUD endpoints and cover upload behavior.
- [ ] Photo upload endpoint, max file size, accepted MIME types, upload progress support, and returned media URLs.
- [ ] Bulk action endpoints for photos and galleries.
- [ ] Video URL metadata endpoint and thumbnail strategy.
- [ ] Category delete rules when galleries exist.
- [ ] Content section endpoint structure.
- [ ] Settings endpoint structure.
- [ ] User role/permission endpoint structure.
- [ ] Storage analytics and dashboard analytics endpoint formats.

## Final Deliverables

- Production Vue 3 admin frontend in `admin-panel`.
- Route-based admin shell matching the provided HTML design.
- API-integrated pages for Dashboard, Galleries, Photos, Videos, Categories, Website Content, Testimonials, Users, and Settings.
- Reusable component library for tables, modals, forms, uploads, tabs, pagination, toasts, loading states, and empty states.
- Pinia stores and service layer for all modules.
- Responsive UI matching the original design intent.
- TypeScript types for API entities and shared responses.
- Test coverage for critical stores, composables, route guards, and reusable UI components.
