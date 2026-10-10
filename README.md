# Student Management System

A modern, responsive frontend Student Management System built with **React**, **Vite**, and **Tailwind CSS**.

Manage students, teachers, courses, classes, attendance, results, and generate reports — all data is persisted in the browser using `localStorage`.

## Features

### Core Modules
- **Dashboard** — Live overview with statistics, department breakdown, and quick navigation
- **Students** — Full CRUD, search, department/year filters, pagination, CSV export, form validation, duplicate ID prevention
- **Teachers** — Full CRUD, search, department filter, validation, view modal
- **Courses** — Full CRUD, search, department filter, validation
- **Classes** — Full CRUD, search, department filter, validation
- **Attendance** — Status updates (Present / Late / Absent), batch actions, statistics, localStorage
- **Results** — Search & grade filtering, grade calculation, summary statistics, CSV export
- **Reports** — Aggregated insights across modules
- **Settings** — School profile, notification preferences, data management

### UX & Quality
- Form validation with clear error messages
- Success notifications
- Empty states
- Responsive layout (mobile-friendly)
- Active navigation highlighting
- Consistent UI design with Tailwind CSS
- Data persistence via localStorage

## Tech Stack

- React 19
- Vite 8
- React Router DOM 7
- Tailwind CSS 4 (`@tailwindcss/vite`)

## Getting Started

### Prerequisites
- Node.js 18+ 

### Installation

```bash
# Clone or extract the project
cd student-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── Sidebar.jsx
├── data/
│   ├── students.js
│   ├── teachers.js
│   ├── courses.js
│   ├── classes.js
│   ├── attendance.js
│   └── results.js
├── pages/
│   ├── Dashboard.jsx
│   ├── Students.jsx
│   ├── Teachers.jsx
│   ├── Courses.jsx
│   ├── Classes.jsx
│   ├── Attendance.jsx
│   ├── Results.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Usage Notes

- All data is stored in the browser's `localStorage`. Clearing site data will reset the application.
- Sample data is loaded on first visit.
- Use the **Settings** page to clear all application data if needed.

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run ESLint               |

## License

This project is for educational purposes.
