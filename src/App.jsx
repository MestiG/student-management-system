import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"

import Dashboard from "./pages/Dashboard"
import Students from "./pages/Students"
import Teachers from "./pages/Teachers"
import Courses from "./pages/Courses"
import Classes from "./pages/Classes"
import Attendance from "./pages/Attendance"
import Results from "./pages/Results"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />

          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/results" element={<Results />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
