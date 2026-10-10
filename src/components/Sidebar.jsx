import { Link, useLocation } from "react-router-dom"

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/students", label: "Students" },
  { path: "/teachers", label: "Teachers" },
  { path: "/courses", label: "Courses" },
  { path: "/classes", label: "Classes" },
  { path: "/attendance", label: "Attendance" },
  { path: "/results", label: "Results" },
  { path: "/reports", label: "Reports" },
  { path: "/settings", label: "Settings" },
]

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5 flex-shrink-0">
      <h1 className="text-2xl font-bold mb-8 tracking-tight">StudentMS</h1>

      <nav className="space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600 text-white font-medium"
                  : "hover:bg-slate-800 text-slate-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
