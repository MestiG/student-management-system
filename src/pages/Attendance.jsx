import { useEffect, useState } from "react"
import attendanceData from "../data/attendance"

function Attendance() {
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem("attendance")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (err) {
        console.error("Failed to parse attendance from localStorage", err)
        return attendanceData
      }
    }
    return attendanceData
  })

  const [search, setSearch] = useState("")
  const [courseFilter, setCourseFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("2026-10-08")

  // Save attendance in localStorage
  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance))
  }, [attendance])

  const changeStatus = (id, newStatus) => {
    setAttendance(
      attendance.map((record) =>
        record.id === id ? { ...record, status: newStatus } : record
      )
    )
  }

  // Batch action: Mark all filtered students Present
  const handleMarkAllPresent = () => {
    const filteredIds = new Set(filteredAttendance.map((r) => r.id))
    setAttendance(
      attendance.map((record) =>
        filteredIds.has(record.id) ? { ...record, status: "Present" } : record
      )
    )
  }

  // Batch action: Mark all filtered students Absent
  const handleMarkAllAbsent = () => {
    const filteredIds = new Set(filteredAttendance.map((r) => r.id))
    setAttendance(
      attendance.map((record) =>
        filteredIds.has(record.id) ? { ...record, status: "Absent" } : record
      )
    )
  }

  // Filter attendance records
  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(search.toLowerCase()) ||
      record.studentId.toLowerCase().includes(search.toLowerCase())

    const matchesCourse =
      courseFilter === "All" || record.course === courseFilter

    const matchesDate = !dateFilter || record.date === dateFilter

    return matchesSearch && matchesCourse && matchesDate
  })

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ["Student ID", "Student Name", "Course", "Date", "Status"]
    const rows = filteredAttendance.map((r) => [
      r.studentId,
      r.studentName,
      r.course,
      r.date,
      r.status,
    ])

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `attendance_${dateFilter || "report"}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Get unique courses for filter dropdown
  const uniqueCourses = Array.from(new Set(attendance.map((r) => r.course)))

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
          <p className="mt-2 text-gray-500">
            Track and manage daily student attendance records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleMarkAllPresent}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
          >
            ✓ Mark All Present
          </button>

          <button
            onClick={handleMarkAllAbsent}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
          >
            ✕ Mark All Absent
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Present */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Present</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {filteredAttendance.filter((r) => r.status === "Present").length}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Students present</p>
        </div>

        {/* Late */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Late</p>
          <h2 className="text-3xl font-bold text-amber-500 mt-2">
            {filteredAttendance.filter((r) => r.status === "Late").length}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Students arrived late</p>
        </div>

        {/* Absent */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Absent</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {filteredAttendance.filter((r) => r.status === "Absent").length}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Students absent</p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Attendance Rate</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {filteredAttendance.length > 0
              ? Math.round(
                  ((filteredAttendance.filter(
                    (r) => r.status === "Present" || r.status === "Late"
                  ).length /
                    filteredAttendance.length) *
                    100)
                )
              : 0}
            %
          </h2>
          <p className="text-sm text-gray-500 mt-2">Current filter rate</p>
        </div>
      </div>

      {/* Attendance Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Attendance Records
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredAttendance.length} of {attendance.length}{" "}
                records
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              {/* Course Filter */}
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="All">All Courses</option>
                {uniqueCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />

              {/* Reset Filters */}
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setCourseFilter("All")
                  setDateFilter("")
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Student ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Student Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Course
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Mark Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {record.studentId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {record.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.course}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.date}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {record.status === "Present" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Present
                        </span>
                      )}
                      {record.status === "Absent" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Absent
                        </span>
                      )}
                      {record.status === "Late" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                          Late
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => changeStatus(record.id, "Present")}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                            record.status === "Present"
                              ? "bg-green-600 text-white"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          Present
                        </button>

                        <button
                          onClick={() => changeStatus(record.id, "Late")}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                            record.status === "Late"
                              ? "bg-amber-500 text-white"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          }`}
                        >
                          Late
                        </button>

                        <button
                          onClick={() => changeStatus(record.id, "Absent")}
                          className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                            record.status === "Absent"
                              ? "bg-red-600 text-white"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Attendance