# VerityLMS - React Migration

This project was migrated from [triallms_vue](../triallms_vue) (Vue.js) to React.js with Vite.

## Tech Stack

- **React** 18.2.0
- **Vite** 5.0.0
- **React Router DOM** 6.20.0
- **Axios** 1.13.6
- **Bulma** CSS (via CDN)

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Router & global layout
├── api.js                # Axios configuration
├── index.css             # Global styles
├── context/
│   └── AuthContext.jsx   # Authentication state management
├── components/
│   ├── Nav.jsx           # Navigation bar
│   ├── ChapterItem.jsx   # Chapter card component
│   ├── ChapterComment.jsx # Comment display
│   ├── AddComment.jsx    # Comment form
│   └── Quiz.jsx          # Quiz component
└── views/
    ├── HomeView.jsx      # Home page
    ├── LogIn.jsx         # Login page
    ├── SignUp.jsx        # Registration page
    ├── Chapter.jsx       # Chapter detail view
    ├── CMView.jsx        # Content Management
    ├── CGView.jsx        # Content Generation (placeholder)
    ├── AMView.jsx        # Assessment Management (placeholder)
    ├── AGView.jsx        # Assessment Generation (placeholder)
    ├── HWView.jsx        # Homework Management (placeholder)
    ├── CPAView.jsx       # Performance Analytics (placeholder)
    ├── Author.jsx        # Author profile
    └── dashboard/
        ├── MyAccount.jsx      # User account
        └── CreateChapter.jsx  # Create chapter form
```

## Migration Changes from Vue

### State Management
- **Vue**: Vuex store (`src/store/index.js`)
- **React**: React Context API (`src/context/AuthContext.jsx`)

### Routing
- **Vue**: Vue Router with separate router config
- **React**: React Router DOM v6, routes defined in `App.jsx`

### Component Syntax
- **Vue**: Single File Components (.vue files)
- **React**: JSX (.jsx files)

### Styling
- **Vue**: SCSS with Bulma (`@import "~bulma/bulma"`)
- **React**: Bulma loaded via CDN in `index.html`

## API Endpoints

The React app connects to the Django backend at `http://127.0.0.1:8000/api/v1/`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `token/login/` | POST | User login |
| `token/logout/` | POST | User logout |
| `users/` | POST | User registration |
| `content_management/` | GET | List chapters |
| `content_management/get_latest_chapters/` | GET | Latest chapters |
| `content_management/get_grades/` | GET | List grades |
| `content_management/get_subjects/` | GET | List subjects |
| `content_management/create_chapter/` | POST | Create chapter |
| `content_management/:slug/` | GET | Chapter detail |
| `content_management/:chapter/:lesson/get-quiz/` | GET | Get quiz |
| `content_management/:chapter/:lesson/get-comments/` | GET | Get comments |
| `activities/track_started/:chapter/:lesson/` | POST | Track started |
| `activities/mark_as_done/:chapter/:lesson/` | POST | Mark done |
| `activities/get_active_chapters/` | GET | Active chapters |
| `content_management/get_author_chapters/:id/` | GET | Author chapters |

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomeView | Landing page |
| `/content-Management` | CMView | Browse chapters |
| `/content-Management/:slug` | Chapter | Chapter detail |
| `/content-Generation` | CGView | Placeholder |
| `/assessment-Management` | AMView | Placeholder |
| `/assessment-Generation` | AGView | Placeholder |
| `/homework-Management` | HWView | Placeholder |
| `/performance-&-analytics` | CPAView | Placeholder |
| `/sign-up` | SignUp | Registration |
| `/log-in` | LogIn | Login |
| `/authors/:id` | Author | Author profile |
| `/dashboard/my-account` | MyAccount | User account |
| `/dashboard/create-chapter` | CreateChapter | Create chapter |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Comparison with Vue Project

| Feature | Vue (triallms_vue) | React (triallms_react) |
|---------|-------------------|------------------------|
| Framework | Vue 3 | React 18 |
| Build Tool | Vue CLI | Vite |
| State | Vuex | Context API |
| Router | Vue Router 4 | React Router DOM 6 |
| Styling | Bulma + SCSS | Bulma (CDN) |
| API Client | Axios | Axios |
