import { useState } from "react"
import studentsData from "../data/students"
import coursesData from "../data/courses"
import attendanceData from "../data/attendance"
import resultsData from "../data/results"

function Reports() {
  const [students] = useState(() => {
    const saved = localStorage.getItem("students")
    return saved ? JSON.parse(saved) : studentsData
  })

  const [attendance] = useState(() => {
    const saved = localStorage.getItem("attendance")
    return saved ? JSON.parse(saved) : attendanceData
  })

  const [results] = useState(() => {
    const saved = localStorage.getItem("results")
    return saved ? JSON.parse(saved) : resultsData
  })

  const [activeTab, setActiveTab] = useState("overview")

  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.status === "Active").length
  const inactiveStudents = totalStudents - activeStudents

  const maleCount = students.filter((s) => s.gender === "Male").length
  const femaleCount = students.filter((s) => s.gender === "Female").length

  const presentCount = attendance.filter(
    (r) => r.status === "Present" || r.status === "Late"
  ).length
  const attendanceRate =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, r) => sum + r.assignment + r.midterm + r.final,
            0
          ) / results.length
        )
      : 0

  const passedStudents = results.filter(
    (r) => r.assignment + r.midterm + r.final >= 50
  ).length
  const failedStudents = results.length - passedStudents
  const passRate =
    results.length > 0 ? Math.round((passedStudents / results.length) * 100) : 0

  const departments = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
  ]

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const headers = ["Metric", "Value", "Notes"]
    const rows = [
      ["Total Students", totalStudents, `${activeStudents} Active, ${inactiveStudents} Inactive`],
      ["Male Students", maleCount, `${totalStudents > 0 ? Math.round((maleCount / totalStudents) * 100) : 0}%`],
      ["Female Students", femaleCount, `${totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0}%`],
      ["Total Courses", coursesData.length, "Across 3 Departments"],
      ["Attendance Rate", `${attendanceRate}%`, `${presentCount} attended`],
      ["Academic Average", `${averageScore} / 100`, `Pass Rate: ${passRate}%`],
      ["Passed Exams", passedStudents, "Score >= 50%"],
      ["Failed Exams", failedStudents, "Score < 50%"],
    ]

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `system_report_summary.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Reports</h1>
          <p className="mt-2 text-gray-500">
            Real-time analytical insights and exportable system summaries.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition text-sm"
          >
            🖨️ Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition text-sm"
          >
            📥 Export Report CSV
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Executive Summary
        </button>
        <button
          onClick={() => setActiveTab("departments")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition ${
            activeTab === "departments"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Department Analytics
        </button>
        <button
          onClick={() => setActiveTab("academics")}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition ${
            activeTab === "academics"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Academic & Attendance
        </button>
      </div>

      {/* Tab 1: Executive Summary */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Total Students</p>
              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                {totalStudents}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {activeStudents} Active · {inactiveStudents} Inactive
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Gender Ratio</p>
              <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                {maleCount}M / {femaleCount}F
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {totalStudents > 0
                  ? Math.round((femaleCount / totalStudents) * 100)
                  : 0}
                % Female Enrollment
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <h2 className="text-3xl font-bold text-amber-500 mt-2">
                {attendanceRate}%
              </h2>
              <p className="text-sm text-gray-500 mt-2">Based on daily logs</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Exam Pass Rate</p>
              <h2 className="text-3xl font-bold text-purple-600 mt-2">
                {passRate}%
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {passedStudents} Passed · {failedStudents} Failed
              </p>
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Department Analytics */}
      {activeTab === "departments" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Department Enrollment Breakdown
          </h2>

          <div className="space-y-6">
            {departments.map((department) => {
              const deptStudents = students.filter(
                (s) => s.department === department
              )
              const count = deptStudents.length
              const activeCount = deptStudents.filter(
                (s) => s.status === "Active"
              ).length
              const percentage =
                totalStudents > 0
                  ? Math.round((count / totalStudents) * 100)
                  : 0

              return (
                <div key={department} className="border-b border-gray-100 pb-5">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {department}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activeCount} Active Students
                      </p>
                    </div>
                    <span className="font-bold text-blue-600">
                      {count} ({percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Academic & Attendance */}
      {activeTab === "academics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Academic Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Academic Performance Summary
            </h2>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Average Class Score</span>
              <span className="font-bold text-blue-600 text-lg">
                {averageScore} / 100
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${averageScore}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 font-medium">Pass Rate</p>
                <p className="text-xl font-bold text-green-700 mt-1">
                  {passRate}%
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-700 font-medium">
                  Needs Re-examination
                </p>
                <p className="text-xl font-bold text-red-700 mt-1">
                  {failedStudents}
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Attendance Health Score
            </h2>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Overall Attendance Rate</span>
              <span className="font-bold text-green-600 text-lg">
                {attendanceRate}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>

            <p className="text-sm text-gray-500">
              Attendance records indicate good overall engagement across
              sections.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports