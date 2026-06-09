# Anil Chauhan Photography - Admin Panel

A professional Vue 3 + TypeScript admin panel for managing photography studio content, galleries, videos, testimonials, and more.

## Technology Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **State Management**: Pinia 2
- **Routing**: Vue Router 4
- **HTTP Client**: Axios 1
- **Charts**: Chart.js 4
- **Form Validation**: VeeValidate 4
- **Utilities**: VueUse 10
- **Testing**: Vitest + Vue Test Utils
- **Deployment**: Vercel

## Project Structure

```
src/
├── api/              # API endpoint integrations
├── assets/
│   ├── css/         # Global styles & variables
│   └── icons/       # SVG icons
├── components/      # Reusable Vue components
├── composables/     # Custom Vue hooks
├── layouts/         # Layout components
├── pages/           # Page components (one per route)
├── router/          # Vue Router configuration
├── stores/          # Pinia store definitions
├── services/        # Business logic services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.vue          # Root component
├── main.ts          # Application entry point
└── env.d.ts         # Environment type definitions
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd admin-panel

# Install dependencies
npm install

# Create .env.local for local development
cp .env .env.local
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:5173
```

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel deploy
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Check TypeScript types
npm run type-check

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Features

- ✅ Dashboard with analytics
- ✅ Gallery management
- ✅ Photo upload & management
- ✅ Video management
- ✅ Testimonial management
- ✅ Gallery category management
- ✅ User management & permissions
- ✅ Settings management
- ✅ File upload with validation (max 5MB)
- ✅ Form validation
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Dark mode support (planned)

## Configuration

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=ACP Admin Panel
VITE_APP_LOGO=/logo.png
VITE_APP_VERSION=1.0.0

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ACCEPTED_FORMATS=jpg,jpeg,png,webp,gif,mp4,webm

# Features
VITE_ENABLE_DEVTOOLS=true
```

## API Integration

All API calls go through `src/utils/axios.ts` which handles:
- Base URL configuration
- Request/response interceptors
- Error handling & transformation
- Token injection (when auth is implemented)

API endpoints are defined in `src/utils/constants.ts`.

## Type Safety

The project uses TypeScript with strict mode enabled. All major entities have type definitions:

- `Gallery` - Gallery management
- `GalleryPhoto` - Photo management
- `Video` - Video management
- `Testimonial` - Testimonial management
- `User` - User management
- `Settings` - App settings

## State Management

Pinia stores are located in `src/stores/`:

- `useUiStore` - UI state (modals, notifications, sidebar)
- `useDashboardStore` - Dashboard data
- `useGalleryStore` - Gallery CRUD operations
- `usePhotoStore` - Photo CRUD operations
- `useVideoStore` - Video CRUD operations
- `useCategoryStore` - Category CRUD operations
- `useTestimonialStore` - Testimonial CRUD operations
- `useUserStore` - User CRUD operations
- `useSettingsStore` - Settings management

## Testing

The project uses Vitest for unit testing. Test files should be placed alongside the code with `.test.ts` or `.spec.ts` extensions.

## Error Handling

API errors are handled through `src/utils/error.handler.ts` which provides:
- Consistent error messages
- Field-level validation errors
- User-friendly error display

## Development Guidelines

1. **Component Structure**: Use Vue 3 Composition API with `<script setup>`
2. **Type Everything**: Always use TypeScript types for props, emits, and data
3. **Naming Conventions**:
   - Components: PascalCase (e.g., `GalleryCard.vue`)
   - Functions/Variables: camelCase
   - Types: PascalCase (e.g., `Gallery`)
   - Constants: UPPER_CASE
4. **Scoped Styles**: Always use `<style scoped>` or CSS modules
5. **Imports**: Use path aliases from `@` (e.g., `@/components/Button.vue`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For support or questions, please contact the development team.
