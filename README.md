# LeverX Employee Services — Address Book

This repository contains an employee directory application: a small Express + SQLite backend and a TypeScript + SCSS + React frontend bundled with Webpack. It supports user registration/authentication, role-based access control (admin/manager/employee), in-place editing, and an advanced searchable UI with dark mode support.

---

## What Was Added / Migration to React

This project was migrated to use React for the frontend. The following steps were performed:

1. **Prepare project:**

- Installed React and React-DOM.
- Installed React Router for client-side routing.
- Installed Babel, necessary presets, and plugins to transpile JSX to JavaScript.
- Set up Babel configuration for JSX/ES6+ support.

2. **Update project structure:**

- Created a new `src` folder for React source code.
- Created a new `public` folder for static assets.
- Cleaned up `index.html` to only include the root div with an ID for React mounting.

3. **Componentization:**

- Broke existing pages into modular React components.

**Advanced Feature:**

- Instead of Vite, Webpack is used for bundling and development.

---

---

## Highlights / Features

- Employee directory with list/grid views and advanced search filters
- Employee details page with editable fields: names, native names, manager, contact and visa info
- Authentication: sign-up and sign-in with bcrypt-hashed passwords
- Role-based access: `isAdmin` (boolean) and `role` (`employee` or `manager`) enforced server-side
- Admin-only settings page to manage roles and admin flags
- Managers (HR) can edit their direct reports only
- API: REST endpoints to list, fetch and update employees; sign-up/sign-in endpoints
- TypeScript frontend with Webpack build pipeline and SCSS styling; dark-mode support via `prefers-color-scheme`

---

## Tech Stack

- Backend: Node.js, Express, SQLite (better-sqlite3), bcrypt, uuid
- Frontend: TypeScript, Webpack, ts-loader, SCSS (sass + sass-loader)
- Dev tooling: nodemon (server dev), webpack-dev-server (frontend dev)

---

## Folder Layout (important files)

```
Gigi-Natroshvili/
├── index.html
├── employee-details.html
├── 404-not-found.html
├── README.md
├── tsconfig.json
├── package.json            # root frontend/build scripts + devDependencies
├── server/
│   ├── server.js           # Express API (default port: 3000)
│   ├── package.json        # backend dependencies / scripts
│   ├── employees.json      # seed data
│   └── users.db            # SQLite DB (created at runtime)
├── src/
│   └── scripts/            # TypeScript source
├── styles/
│   └── scss/               # SCSS partials and main .scss entry
├── assets/                 # images/icons
└── data/                   # optional data files
```

---

## API (summary)

- POST /sign-up — register a new user (creates `users` + `employees` rows)
- POST /sign-in — authenticate; returns user object including `isAdmin` and `role`
- GET /auth/users — list registered users (debug)
- GET /employees — list employees
- GET /employees/:id — get single employee
- PUT /employees/:id/role — update `role` and `isAdmin` (admin only)
- PUT /employees/:id — update employee fields (admins or manager editing subordinates)

Server enforces permissions. When `manager_id` is updated the server also looks up and stores `manager_first_name`/`manager_last_name` for display.

---

## Database

- SQLite database file is `server/users.db` (auto-created).
- To reset the DB, stop the server and delete `server/users.db`; restart server to re-seed from `server/employees.json`.

---

## Getting Started — How to Run the Project

**Prerequisites:**

- Node.js (v14+ or compatible)
- npm (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://frontend-course-2025-gitlab.codelx.dev/fe/gigi-natroshvili
cd gigi-natroshvili
```

### 2. Install frontend dependencies (from project root)

```bash
npm install
```

### 3. Install backend dependencies & run the server

```bash
cd server
npm install
# To run the server:
npm run dev



```

The backend API will be available at: [http://localhost:3000](http://localhost:3000)

### 4. Start the frontend (React) development server

Open a new terminal and return to the project root:

```bash
cd .. # if you are still in the server directory
npm i
npm run dev
```

This will start the Webpack dev server (default: [http://localhost:8080](http://localhost:8080)).

Open your browser and navigate to [http://localhost:8080](http://localhost:8080) to use the app.

**Notes:**

- The frontend expects the backend API at `http://localhost:3000` by default.
- If you want to run both frontend and backend together automatically, consider using a tool like `concurrently` or a custom npm script.

---

#to test admin features i will add admin account
email: gigi.natroshvili@gmail.com
password: Admin123
---

## Build (production)

```bash
npm run build
```

- Output will go to the `dist/` folder (configured by Webpack). You can deploy the `dist/` static files and run the backend separately or configure the backend to serve the built assets.

---

## Developer Notes

- TypeScript config lives in `tsconfig.json` — frontend is compiled through Webpack + `ts-loader`.
- SCSS files are located under `styles/scss/` and compiled into the final CSS via the Webpack build.
- Server-side permission checks are authoritative; frontend hides UI for unauthorized users but cannot be relied upon for security.

---

## Role & Permission Summary

- `isAdmin` (boolean/integer) — Admins can edit any employee and access settings.
- `role` (`employee` or `manager`) — Managers may edit their direct reports (employees where `manager_id` equals the manager `_id`).

All checks are performed server-side for safety.

---

## Troubleshooting

- If `npm run dev` fails, ensure `npm install` completed and you are using a compatible Node version.
- If frontend cannot reach the backend, confirm the server is running on port 3000 and CORS is allowed (server uses `cors()` by default).
- To refresh seeded data, delete `server/users.db` and restart the server.

---

### basic Search

1. Enter employee name or ID in the search box
2. Click "Search" or press Enter
3. Results are displayed in grid view by default

### Advanced Search

1. Click "ADVANCED SEARCH" tab
2. Fill in one or more criteria:
   - Name: First name, last name, or full name
   - Email: Employee email address
   - Phone: Mobile phone number
   - Skype: Skype ID
   - Building: Select from dropdown
   - Room: Room number
   - Department: Select from dropdown
3. Click "Search" to apply filters

### View Switching

- Click the grid icon for card layout
- Click the list icon for table layout

### Employee Details

- Click any employee card or list item
- View comprehensive employee information
- Click back arrow or "Address Book" button to return

### Mobile Navigation

- Tap burger menu icon to open navigation
- Click backdrop or links to close menu
- All links redirect to main page (index.html)

## Key Functionality

### Search State Persistence

The application preserves search parameters in the URL:

- Basic search: `?mode=basic&query=john`
- Advanced search: `?mode=advanced&name=john&department=IT`
- Refreshing the page maintains your search results

### Dynamic Dropdowns

- Building and Department dropdowns are populated from employee data
- Options are automatically deduplicated

### Header Employee Display

- Header always shows the first employee from the dataset
- Clicking the header employee navigates to their details page
- Consistent across both main and details pages

### Burger Menu (Mobile)

- JavaScript-based toggle using CSS classes
- Three interaction points:
  - Burger icon: Opens/closes menu
  - Backdrop: Closes menu
  - Navigation links: Close menu and redirect to index

### Error Handling

- Invalid employee IDs redirect to 404 page(404-not-found.html)
- Empty search results show friendly message
- Console logging for debugging data loading issues

## Responsive Design

The application is fully responsive with breakpoints:

- **Mobile (< 480px)**: Compact layout, stacked elements
- **Tablet (480px - 768px)**: Optimized for touch
- **Desktop (768px - 1024px)**: Transition layout
- **Large Desktop (1024px - 1280px)**: Enhanced spacing
- **Extra Large (> 1280px)**: Maximum container width

### Mobile-Specific Features

- Burger menu navigation
- Simplified employee cards
- Stacked information layout
- Touch-friendly button sizes
- Hidden desktop-only elements

## Dark Mode Support

The application automatically adapts to the user's system theme preference using `@media (prefers-color-scheme: dark)`:

### Dark Mode Features

- **Automatic Detection**: No manual toggle needed
- **System Sync**: Matches OS/browser dark mode settings
- **Comprehensive Coverage**: All pages and components
- **Optimized Colors**:
  - Background: Dark grays (#0f0f0f, #1e1e1e)
  - Text: Light grays (#e0e0e0, #b0b0b0)
  - Primary blue: Consistent branding
  - Borders: Subtle dark tones
  - Images: Brightness/contrast adjustments

### CSS Variables

All colors are centralized using CSS custom properties:

```css
:root {
  --color-bg: #ffffff;
  --color-text: #000;
  /* ... */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1e1e1e;
    --color-text: #e0e0e0;
    /* ... */
  }
}
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Polyfills Included

- Custom Fetch API polyfill for older environments

## Development Notes

### CSS Architecture

- **CSS Variables**: Centralized theming for easy maintenance
- **BEM-inspired**: Clear, descriptive class names
- **Mobile-First**: Progressive enhancement approach
- **Modular CSS**: Separate files for different concerns

### JavaScript Patterns

- **Event Delegation**: Efficient event handling
- **URL State Management**: Search parameters in URL
- **DOM Manipulation**: Vanilla JavaScript, no jQuery
- **Error Handling**: Graceful degradation

### Data Structure

Employee data is stored in `data/data.json` with the following structure:

```json
{
  "_id": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "department": "string",
  "building": "string",
  "room": "number",
  "user_avatar": "string",
  "isRemoteWork": "boolean",
  "manager": { "first_name": "string", "last_name": "string" },
  "visa": [...]
}
```

## Customization

### Changing Colors

Edit CSS variables in `reset.css`, `style.css`, `header.css`, or `employee-details.css`:

```css
:root {
  --color-primary: #007bff; /* Change primary blue */
  --color-bg: #ffffff; /* Change background */
  /* ... */
}
```

### Adding New Search Fields

1. Add input in `index.html`
2. Update `searchAdvancedEmployees()` in `script.js`
3. Add URL parameter handling

### Modifying Responsive Breakpoints

Update media queries in respective CSS files:

```css
@media screen and (max-width: 768px) {
  /* Your responsive styles */
}
```

## Author

**Gigi Natroshvili**

## License

This project is part of the LeverX Frontend Course 2025.

---

**Last Updated**: December 6, 2025
