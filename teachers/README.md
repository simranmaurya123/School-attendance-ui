# Teacher Dashboard - Frontend Only

This is a frontend-only teacher dashboard application built with HTML, CSS, and JavaScript.

## Files Structure

- `teacher-dashboard.html` - Main dashboard page
- `index.html` - Landing page
- `index-modular.html` - Modular version of dashboard
- `assets/` - CSS styles and images
- `js/` - JavaScript functionality
- `layouts/` - HTML layout components
- `data/` - JSON data files

## How to Run

Since this is a frontend-only application, you can run it in several ways:

### Method 1: Direct File Opening
- Simply open `teacher-dashboard.html` in your web browser
- Note: Some features requiring file loading may not work due to CORS restrictions

### Method 2: Using Python HTTP Server
```bash
cd teachers
python -m http.server 8000
```
Then open http://localhost:8000/teacher-dashboard.html

### Method 3: Using Node.js HTTP Server
```bash
cd teachers
npx http-server -p 8000
```
Then open http://localhost:8000/teacher-dashboard.html

### Method 4: Using Live Server (VS Code Extension)
- Install the "Live Server" extension in VS Code
- Right-click on `teacher-dashboard.html` and select "Open with Live Server"

## Features

- Dashboard with attendance statistics
- Interactive calendar
- Student attendance management
- Responsive design
- Local data storage using localStorage

## Technology Stack

- **HTML5** - Structure and markup
- **CSS3** - Styling and layout
- **Vanilla JavaScript** - Functionality and interactions
- **Font Awesome** - Icons
- **Local Storage** - Data persistence

## Notes

- All data is stored locally in the browser's localStorage
- No backend server required
- All functionality works offline once loaded