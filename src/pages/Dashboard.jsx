import { useState } from "react"
import { Link } from "react-router-dom"
import studentsData from "../data/students"
import coursesData from "../data/courses"
import classesData from "../data/classes"

function Dashboard() {
  const [students] = useState(() => {
    const savedStudents = localStorage.getItem("students")
    if (savedStudents) {
      try {
        return JSON.parse(savedStudents)
      } catch (err) {
        console.error("Failed to parse students from localStorage", err)
        return studentsData
      }
    }
    return studentsData
  })

  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.status === "Active").length
  const inactiveStudents = totalStudents - activeStudents

  // Department Breakdown
  const departments = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
  ]
  const deptCounts = departments.map((dept) => {
    const count = students.filter((s) => s.department === dept).length
    const percentage =
      totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0
    return { name: dept, count, percentage }
  })

  return (
    <div>
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-2 text-gray-500">
            Welcome back! Here's a live overview of your system.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Students */}
        <Link
          to="/students"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition">
              🎓
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-3">
            {totalStudents}
          </h2>
          <p className="text-sm text-green-600 font-medium mt-2">
            {activeStudents} Active · {inactiveStudents} Inactive
          </p>
        </Link>

        {/* Teachers */}
        <Link
          to="/teachers"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Teachers</p>
            <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition">
              👨‍🏫
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-3">4</h2>
          <p className="text-sm text-emerald-600 font-medium mt-2">
            3 Active Faculty
          </p>
        </Link>

        {/* Courses */}
        <Link
          to="/courses"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Courses</p>
            <span className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm group-hover:bg-purple-600 group-hover:text-white transition">
              📚
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-3">
            {coursesData.length}
          </h2>
          <p className="text-sm text-purple-600 font-medium mt-2">
            Across 3 Departments
          </p>
        </Link>

        {/* Classes */}
        <Link
          to="/classes"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Active Classes</p>
            <span className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm group-hover:bg-amber-600 group-hover:text-white transition">
              🏫
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-3">
            {classesData.filter((c) => c.status === "Active").length}
          </h2>
          <p className="text-sm text-amber-600 font-medium mt-2">
            Active Sections
          </p>
        </Link>
      </div>

      {/* Grid Section: Department Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Department Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Department Distribution
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Student enrollment ratio across departments
          </p>

          <div className="space-y-5">
            {deptCounts.map((dept) => (
              <div key={dept.name}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-gray-700">{dept.name}</span>
                  <span className="text-gray-500">
                    {dept.count} students ({dept.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Quick Actions
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Shortcuts to common operations
            </p>

            <div className="space-y-3">
              <Link
                to="/students"
                className="w-full flex items-center justify-between p-3.5 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition"
              >
                <span>+ Add / Manage Students</span>
                <span>→</span>
              </Link>

              <Link
                to="/attendance"
                className="w-full flex items-center justify-between p-3.5 bg-emerald-50 text-emerald-700 font-medium rounded-lg hover:bg-emerald-100 transition"
              >
                <span>✓ Take Class Attendance</span>
                <span>→</span>
              </Link>

              <Link
                to="/reports"
                className="w-full flex items-center justify-between p-3.5 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition"
              >
                <span>📊 View System Reports</span>
                <span>→</span>
              </Link>

              <Link
                to="/settings"
                className="w-full flex items-center justify-between p-3.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                <span>⚙️ Configure Settings</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          System Activity
        </h2>
        <p className="text-sm text-gray-500 mb-4">Real-time status updates</p>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
            <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">
              ✓
            </span>
            <div>
              <p className="text-sm font-medium text-gray-800">
                System Active — {students.length} student records loaded from
                localStorage
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Updated just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard