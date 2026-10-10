import { useEffect, useState } from "react"
import resultsData from "../data/results"

function getGrade(total) {
  if (total >= 90) return "A+"
  if (total >= 85) return "A"
  if (total >= 80) return "A-"
  if (total >= 75) return "B+"
  if (total >= 70) return "B"
  if (total >= 65) return "B-"
  if (total >= 60) return "C+"
  if (total >= 50) return "C"
  if (total >= 45) return "D"
  return "F"
}

function Results() {
  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("results")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (err) {
        console.error("Failed to parse results from localStorage", err)
        return resultsData
      }
    }
    return resultsData
  })

  const [search, setSearch] = useState("")
  const [courseFilter, setCourseFilter] = useState("All")
  const [gradeFilter, setGradeFilter] = useState("All")
  const [showForm, setShowForm] = useState(false)
  const [editingResult, setEditingResult] = useState(null)

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    course: "Introduction to Programming",
    assignment: 0,
    midterm: 0,
    final: 0,
  })

  const [formErrors, setFormErrors] = useState({})

  // Save results in localStorage
  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results))
  }, [results])

  const courses = ["All", ...new Set(results.map((r) => r.course))]

  // Form Validation
  const validateForm = () => {
    const errors = {}

    if (!formData.studentId.trim()) errors.studentId = "Student ID is required"
    if (!formData.studentName.trim())
      errors.studentName = "Student Name is required"

    const assignNum = Number(formData.assignment)
    if (isNaN(assignNum) || assignNum < 0 || assignNum > 20) {
      errors.assignment = "Assignment score must be between 0 and 20"
    }

    const midNum = Number(formData.midterm)
    if (isNaN(midNum) || midNum < 0 || midNum > 30) {
      errors.midterm = "Midterm score must be between 0 and 30"
    }

    const finalNum = Number(formData.final)
    if (isNaN(finalNum) || finalNum < 0 || finalNum > 50) {
      errors.final = "Final exam score must be between 0 and 50"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const handleEdit = (result) => {
    setEditingResult(result)
    setFormData({
      studentId: result.studentId,
      studentName: result.studentName,
      course: result.course,
      assignment: result.assignment,
      midterm: result.midterm,
      final: result.final,
    })
    setFormErrors({})
    setShowForm(true)
  }

  const handleAddResult = () => {
    setEditingResult(null)
    setFormData({
      studentId: "",
      studentName: "",
      course: "Introduction to Programming",
      assignment: 0,
      midterm: 0,
      final: 0,
    })
    setFormErrors({})
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const assignNum = Number(formData.assignment)
    const midNum = Number(formData.midterm)
    const finalNum = Number(formData.final)

    if (editingResult) {
      const updated = results.map((r) =>
        r.id === editingResult.id
          ? {
              ...r,
              studentId: formData.studentId.trim(),
              studentName: formData.studentName.trim(),
              course: formData.course,
              assignment: assignNum,
              midterm: midNum,
              final: finalNum,
            }
          : r
      )
      setResults(updated)
    } else {
      const nextId =
        results.length > 0
          ? Math.max(...results.map((r) => Number(r.id) || 0)) + 1
          : 1
      const newResult = {
        id: nextId,
        studentId: formData.studentId.trim(),
        studentName: formData.studentName.trim(),
        course: formData.course,
        assignment: assignNum,
        midterm: midNum,
        final: finalNum,
      }
      setResults([...results, newResult])
    }

    setShowForm(false)
  }

  const filteredResults = results.filter((result) => {
    const total = result.assignment + result.midterm + result.final
    const grade = getGrade(total)

    const matchesSearch =
      result.studentName.toLowerCase().includes(search.toLowerCase()) ||
      result.studentId.toLowerCase().includes(search.toLowerCase())

    const matchesCourse =
      courseFilter === "All" || result.course === courseFilter
    const matchesGrade = gradeFilter === "All" || grade === gradeFilter

    return matchesSearch && matchesCourse && matchesGrade
  })

  const passedStudents = filteredResults.filter((r) => {
    return r.assignment + r.midterm + r.final >= 50
  }).length

  const failedStudents = filteredResults.length - passedStudents

  const averageScore =
    filteredResults.length > 0
      ? Math.round(
          filteredResults.reduce(
            (sum, r) => sum + r.assignment + r.midterm + r.final,
            0
          ) / filteredResults.length
        )
      : 0

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      "Student ID",
      "Student Name",
      "Course",
      "Assignment (20)",
      "Midterm (30)",
      "Final (50)",
      "Total (100)",
      "Grade",
    ]
    const rows = filteredResults.map((r) => {
      const tot = r.assignment + r.midterm + r.final
      return [
        r.studentId,
        r.studentName,
        r.course,
        r.assignment,
        r.midterm,
        r.final,
        tot,
        getGrade(tot),
      ]
    })

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
    link.download = `academic_results.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Academic Results
          </h1>
          <p className="mt-2 text-gray-500">
            View, enter, and manage student exam scores and letter grades.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAddResult}
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            + Add New Result
          </button>
          <button
            onClick={handleExportCSV}
            className="px-5 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingResult ? "Edit Result" : "Add Student Result"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. STU001"
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${
                    formErrors.studentId
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {formErrors.studentId && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {formErrors.studentId}
                  </p>
                )}
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${
                    formErrors.studentName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {formErrors.studentName && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {formErrors.studentName}
                  </p>
                )}
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Introduction to Programming</option>
                  <option>Database Systems</option>
                  <option>Software Engineering</option>
                  <option>Computer Networks</option>
                </select>
              </div>

              {/* Assignment Score (Max 20) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment (Max 20)
                </label>
                <input
                  type="number"
                  name="assignment"
                  min="0"
                  max="20"
                  value={formData.assignment}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${
                    formErrors.assignment
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {formErrors.assignment && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {formErrors.assignment}
                  </p>
                )}
              </div>

              {/* Midterm Score (Max 30) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Midterm Exam (Max 30)
                </label>
                <input
                  type="number"
                  name="midterm"
                  min="0"
                  max="30"
                  value={formData.midterm}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${
                    formErrors.midterm
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {formErrors.midterm && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {formErrors.midterm}
                  </p>
                )}
              </div>

              {/* Final Exam Score (Max 50) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final Exam (Max 50)
                </label>
                <input
                  type="number"
                  name="final"
                  min="0"
                  max="50"
                  value={formData.final}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${
                    formErrors.final
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {formErrors.final && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {formErrors.final}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {editingResult ? "Update Result" : "Save Result"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Result Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Students */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Results</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {filteredResults.length}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Active student scores</p>
        </div>

        {/* Passed */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Passed (≥50%)</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {passedStudents}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Students passed</p>
        </div>

        {/* Failed */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Failed (&lt;50%)</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {failedStudents}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Need re-examination</p>
        </div>

        {/* Average */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Average Score</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {averageScore} / 100
          </h2>
          <p className="text-sm text-gray-500 mt-2">Overall mean score</p>
        </div>
      </div>

      {/* Results Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Grade Sheets
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredResults.length} of {results.length} records
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
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>

              {/* Grade Letter Filter */}
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="All">All Grades</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>
        </div>

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
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Assignment (20)
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Midterm (30)
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Final (50)
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Total
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Grade
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No academic results found matching search and filters.
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => {
                  const total =
                    result.assignment + result.midterm + result.final
                  const grade = getGrade(total)

                  return (
                    <tr
                      key={result.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {result.studentId}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {result.studentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {result.course}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600">
                        {result.assignment}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600">
                        {result.midterm}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600">
                        {result.final}
                      </td>
                      <td className="px-6 py-4 text-sm text-center font-bold text-gray-800">
                        {total}
                      </td>

                      {/* Grade Badge */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            grade === "F"
                              ? "bg-red-100 text-red-700"
                              : grade.startsWith("A")
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {grade}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(result)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Edit Scores
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Results