# LeverX Employee Services - Address Book

# Homework-3 Branch Updates

This branch introduces major upgrades to the project, including backend integration, persistent session management, and merging registered users with employees. Below is a summary of the new features and setup instructions.

## What's New in Homework-3 Branch

- **Backend Migration**: Employee data is now stored in a SQLite database and served via a Node.js/Express backend (`server/server.js`).
- **REST API Endpoints**: The backend exposes endpoints for employee listing, details, sign-up, sign-in, and more.
- **User Registration & Authentication**: Users can sign up and sign in using their email. Passwords are securely hashed.
- **Session Management**: Persistent sessions are implemented using localStorage/sessionStorage. "Remember me" support added.
- **Auto-login After Sign-up**: New users are automatically logged in and redirected to the main page.
- **Merging Users with Employees**: Registered users are merged into the employee directory. Missing fields are shown as "N/A".
- **Path-based Routing**: Employee details pages use path parameters (e.g., `/employee-details.html/:id`).
- **Display Bug Fixes**: All employee/user details are rendered as strings, preventing `[object Object]` display issues.
- **Polyfill Modernization**: All `var` declarations in the fetch polyfill are replaced with `let`/`const`.
- **CSS Improvements**: Font sizes use `rem` units, and colors are centralized with CSS variables.

## How to Start the Project

### 1. Clone the Repository

```bash
git clone https://frontend-course-2025-gitlab.codelx.dev/fe/gigi-natroshvili.git
cd gigi-natroshvili

```

### 2. Install Dependencies

The backend requires Node.js and npm. Install dependencies in the `server` folder:

```bash
cd server
npm install
```

### 3. Start the Backend Server

Run the backend server (Express + SQLite):

```bash
node server.js
```

The backend will start on `http://localhost:3000` by default.

### 4. Start the Frontend (Five Server)

We recommend using the **Five Server** extension for live reloading:

- Install "Five Server" by Yannick in VS Code (Ctrl+Shift+X, search "Five Server").
- Open the project folder in VS Code.
- Right-click `index.html` and select "Open Five Server" or click "Go Live" in the status bar.

The frontend will be available at `http://localhost:5500` or `http://127.0.0.1:5500`.

### 5. Usage

- Sign up or sign in using your email.
- Browse and search employees (including registered users).
- Click any employee to view details (path-based routing).

### 6. After Pulling from Git

If you clone or pull the project, always run `npm install` in the `server` folder before starting the backend. This ensures all dependencies are installed.

### 7. Additional Notes

- Employee/user data is stored in SQLite (`users.db`).
- If you need to reset the database, delete `users.db` and restart the backend server.
- All frontend logic is in `src/scripts/` and static files in `src/`.
- Polyfills and CSS improvements ensure compatibility and accessibility.

---

A modern, responsive employee directory application built with vanilla HTML, CSS, and JavaScript. This application provides a comprehensive interface for searching, viewing, and managing employee information with support for both basic and advanced search capabilities.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Key Functionality](#key-functionality)
- [Responsive Design](#responsive-design)
- [Dark Mode Support](#dark-mode-support)
- [Browser Compatibility](#browser-compatibility)

## Features

### Core Functionality

- **Employee Directory**: Browse all employees in grid or list view
- **Basic Search**: Quick search by employee name or ID
- **Advanced Search**: Filter employees by multiple criteria (name, email, phone, Skype, building, room, department)
- **Employee Details Page**: View comprehensive employee information including:
  - General info (department, building, room, desk number, date of birth, manager)
  - Contact information (phone, email, Skype, C-number)
  - Travel information (citizenship, visa details)
- **Search State Persistence**: URL parameters maintain search state on page refresh
- **Responsive Navigation**: Mobile-friendly burger menu with JavaScript-based controls

### UI/UX Features

- **Dual View Modes**: Switch between grid and list layouts
- **Dynamic Employee Count**: Real-time display of filtered results
- **Empty State Handling**: User-friendly "no results" messages
- **Header Employee Display**: Always shows the first employee in the header
- **Click Navigation**: Navigate to employee details by clicking cards or list items
- **Back Navigation**: Arrow icon and Address Book button for easy navigation
- **Dark Mode Support**: Automatic adaptation to system theme preferences

## Project Structure

```
Gigi-Natroshvili/
├── index.html                 # Main employee directory page
├── employee-details.html      # Employee details page
├── 404-not-found.html        # Error page
├── README.md                 # Project documentation
├── assets/                   # Images and icons
│   ├── favicon-icon.png
│   └── [various icons]
├── data/
│   └── data.json            # Employee data
├── scripts/
│   ├── script.js            # Main page logic
│   ├── employee-details.js  # Details page logic
│   └── fetch-polyfill.js    # Custom fetch API polyfill
└── styles/
    ├── style.css            # Main styles
    ├── reset.css            # CSS reset
    ├── header.css           # Header styles
    ├── layout.css           # Layout container
    ├── employee-details.css # Details page styles
    └── 404-not-found.css    # Error page styles
```

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with custom properties (CSS variables)
- **Vanilla JavaScript**: No frameworks or libraries
- **Custom Fetch Polyfill**: XMLHttpRequest-based fetch implementation
- **Responsive Design**: Mobile-first approach with multiple breakpoints
- **CSS Media Queries**: Dark mode support via `prefers-color-scheme`

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code or any code editor
- Live Server extension (recommended)

### Installation & Running

1. **Clone or download the repository**

   ```bash
   git clone https://frontend-course-2025-gitlab.codelx.dev/fe/gigi-natroshvili.git
   cd gigi-natroshvili
   ```

2. **Open with VS Code**

   ```bash
   code .
   ```

3. **Install Live Server Extension**

   - Open VS Code Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "Live Server (Five Server)" by Yannick
   - Click Install
   - also we can use "live server" extension by Ritwick Dey (but i am using first extension by Yannick)

4. **Start the Development Server**

   - Right-click on `index.html`
   - Select "Open five Server"
   - Or click "Go Live" in the bottom status bar

5. **Access the Application**
   - The application will open automatically in your default browser
   - URL: `http://127.0.0.1:5500/` or `http://localhost:5500/`
   - Both URLs work identically

## Usage

### Basic Search

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

## Known Issues & Limitations

- Employee data is loaded from static JSON file
- No backend integration for CRUD operations
- Edit button is UI-only (no functionality)
- Copy link button has no implementation
- Sign out link redirects to root

## Future Enhancements

- Backend API integration
- Employee CRUD operations
- Authentication system
- Profile picture upload
- Export employee data
- Print-friendly views
- Keyboard navigation
- Accessibility improvements (ARIA labels)

## Author

**Gigi Natroshvili**

## License

This project is part of the LeverX Frontend Course 2025.

---

**Last Updated**: December 6, 2025
