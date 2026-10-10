import { useEffect, useState } from "react"
import studentsData from "../data/students"

function Students() {
  const [currentPage, setCurrentPage] = useState(1)

const [students, setStudents] = useState(() => {
  const savedStudents = localStorage.getItem("students")

  return savedStudents
    ? JSON.parse(savedStudents)
    : studentsData
})
const [showForm, setShowForm] = useState(false)
const [editingStudent, setEditingStudent] = useState(null)
const [selectedStudent, setSelectedStudent] = useState(null)

  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [yearFilter, setYearFilter] = useState("All")

  const [formErrors, setFormErrors] = useState({})
  const [notification, setNotification] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    gender: "Male",
    department: "Computer Science",
    year: "1st Year",
    email: "",
    phone: "",
    status: "Active",
  })
 // Save students in localStorage
useEffect(() => {
  localStorage.setItem("students", JSON.stringify(students))
}, [students])


  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.studentId.toLowerCase().includes(search.toLowerCase())

    const matchesDepartment =
      departmentFilter === "All" ||
      student.department === departmentFilter

    const matchesYear =
      yearFilter === "All" ||
      student.year === yearFilter

    return matchesSearch && matchesDepartment && matchesYear
  })
  const studentsPerPage = 5

const totalPages = Math.ceil(
  filteredStudents.length / studentsPerPage
)

const validCurrentPage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages)

const startIndex = (validCurrentPage - 1) * studentsPerPage

const currentStudents = filteredStudents.slice(
  startIndex,
  startIndex + studentsPerPage
)

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => {
      setNotification("")
    }, 3500)
  }

  // Form validation function
  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Student name is required"
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!formData.studentId.trim()) {
      errors.studentId = "Student ID is required"
    } else {
      const isDuplicate = students.some(
        (s) =>
          s.studentId.trim().toLowerCase() === formData.studentId.trim().toLowerCase() &&
          s.id !== editingStudent?.id
      )
      if (isDuplicate) {
        errors.studentId = "Student ID already exists. Please use a unique ID."
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address"
    }

    const phoneDigits = formData.phone.replace(/\D/g, "")
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (phoneDigits.length < 9) {
      errors.phone = "Phone number must have at least 9 digits"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  // Edit student
  const handleEdit = (student) => {
    setEditingStudent(student)
    setFormErrors({})

    setFormData({
      name: student.name,
      studentId: student.studentId,
      gender: student.gender,
      department: student.department,
      year: student.year,
      email: student.email,
      phone: student.phone,
      status: student.status,
    })

    setShowForm(true)
  }

  // Delete student
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    )

    if (confirmed) {
      setStudents(
        students.filter((student) => student.id !== id)
      )
      showNotification("Student record deleted successfully.")
    }
  }

  // View student details
  const handleView = (student) => {
    setSelectedStudent(student)
  }

  // Add or update student
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (editingStudent) {
      // Update existing student
      const updatedStudents = students.map((student) =>
        student.id === editingStudent.id
          ? {
              ...student,
              ...formData,
              name: formData.name.trim(),
              studentId: formData.studentId.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
            }
          : student
      )

      setStudents(updatedStudents)
      setEditingStudent(null)
      showNotification("Student updated successfully!")
    } else {
      // Add new student with safe unique numeric ID
      const nextId =
        students.length > 0
          ? Math.max(...students.map((s) => Number(s.id) || 0)) + 1
          : 1

      const newStudent = {
        id: nextId,
        ...formData,
        name: formData.name.trim(),
        studentId: formData.studentId.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      }

      setStudents([...students, newStudent])
      showNotification("New student added successfully!")
    }

    // Reset form & errors
    setFormData({
      name: "",
      studentId: "",
      gender: "Male",
      department: "Computer Science",
      year: "1st Year",
      email: "",
      phone: "",
      status: "Active",
    })
    setFormErrors({})
    setShowForm(false)
  }

  // Open empty form for adding a student
  const handleAddStudent = () => {
    setEditingStudent(null)
    setFormErrors({})

    setFormData({
      name: "",
      studentId: "",
      gender: "Male",
      department: "Computer Science",
      year: "1st Year",
      email: "",
      phone: "",
      status: "Active",
    })

    setShowForm(true)
  }

  // Close form
  const handleCloseForm = () => {
    setShowForm(false)
    setEditingStudent(null)
    setFormErrors({})

    setFormData({
      name: "",
      studentId: "",
      gender: "Male",
      department: "Computer Science",
      year: "1st Year",
      email: "",
      phone: "",
      status: "Active",
    })
  }

  return (
    <>
      {/* Notification Banner */}
      {notification && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-between shadow-sm transition">
          <span className="font-medium">✓ {notification}</span>
          <button
            onClick={() => setNotification("")}
            className="text-green-700 font-bold ml-4 hover:text-green-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Students
          </h1>

          <p className="mt-2 text-gray-500">
            Manage student information and records.
          </p>
        </div>

        <button
          onClick={showForm ? handleCloseForm : handleAddStudent}
          className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? "Close Form" : "+ Add Student"}
        </button>

      </div>

      {/* Student Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 ${
                    formErrors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {formErrors.name}
                  </p>
                )}
              </div>

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
                  placeholder="Example: STU006"
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 ${
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

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>

                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Computer Science</option>
                  <option>Information Technology</option>
                  <option>Software Engineering</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>

                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>5th Year</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 ${
                    formErrors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09XXXXXXXX"
                  className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 ${
                    formErrors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">

              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                {editingStudent ? "Update Student" : "Add Student"}
              </button>

            </div>

          </form>

        </div>
      )}
      {/* Student Summary Cards */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

  {/* Total Students */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <p className="text-sm text-gray-500">Total Students</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-2">
      {students.length}
    </h3>
  </div>

  {/* Active Students */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <p className="text-sm text-gray-500">Active Students</p>
    <h3 className="text-2xl font-bold text-green-600 mt-2">
      {students.filter((student) => student.status === "Active").length}
    </h3>
  </div>

  {/* Inactive Students */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
    <p className="text-sm text-gray-500">Inactive Students</p>
    <h3 className="text-2xl font-bold text-red-600 mt-2">
      {students.filter((student) => student.status === "Inactive").length}
    </h3>
  </div>

</div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Student List
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredStudents.length} of {students.length} students
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              {/* Search */}
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">
                  All Departments
                </option>

                <option value="Computer Science">
                  Computer Science
                </option>

                <option value="Information Technology">
                  Information Technology
                </option>

                <option value="Software Engineering">
                  Software Engineering
                </option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setDepartmentFilter("All")
                  setYearFilter("All")
                  setCurrentPage(1)
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Reset Filters
              </button>
<button
  type="button"
  onClick={() => {
    const headers = [
      "Student ID",
      "Name",
      "Gender",
      "Department",
      "Year",
      "Email",
      "Phone",
      "Status",
    ]

    const rows = students.map((student) => [
      student.studentId,
      student.name,
      student.gender,
      student.department,
      student.year,
      student.email,
      student.phone,
      student.status,
    ])

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = "students.csv"
    link.click()

    URL.revokeObjectURL(url)
  }}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
>
  Export Students
</button>

              {/* Year Filter */}
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">
                  All Years
                </option>

                <option value="1st Year">
                  1st Year
                </option>

                <option value="2nd Year">
                  2nd Year
                </option>

                <option value="3rd Year">
                  3rd Year
                </option>

                <option value="4th Year">
                  4th Year
                </option>

                <option value="5th Year">
                  5th Year
                </option>
              </select>

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
                  Name
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Gender
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Department
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Year
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

             {currentStudents.map((student) => (

                <tr
                  key={student.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.studentId}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {student.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.gender}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.department}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.year}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status}
                    </span>

                  </td>

                  {/* Actions */}
<td className="px-6 py-4">

  <div className="flex items-center gap-3">

    <button
      onClick={() => handleView(student)}
      className="text-green-600 hover:text-green-800 font-medium"
    >
      View
    </button>

    <button
      onClick={() => handleEdit(student)}
      className="text-blue-600 hover:text-blue-800 font-medium"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(student.id)}
      className="text-red-600 hover:text-red-800 font-medium"
    >
      Delete
    </button>

  </div>

</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
{/* Pagination */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
  <p className="text-sm text-gray-500">
    Showing{" "}
    {filteredStudents.length === 0 ? 0 : startIndex + 1}
    {" "}to{" "}
    {Math.min(startIndex + studentsPerPage, filteredStudents.length)}
    {" "}of {filteredStudents.length} students
  </p>

  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
      disabled={validCurrentPage === 1}
      className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
    >
      Previous
    </button>

    <span className="px-3 py-2 text-sm">
      Page {validCurrentPage} of {Math.max(1, totalPages)}
    </span>

    <button
      type="button"
      onClick={() =>
        setCurrentPage((page) => Math.min(totalPages, page + 1))
      }
      disabled={validCurrentPage >= totalPages || totalPages === 0}
      className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
    >
      Next
    </button>
  </div>
</div>
    
    {/* Student Details Modal */}
{selectedStudent && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Student Details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Complete student information
          </p>
        </div>

        <button
          onClick={() => setSelectedStudent(null)}
          className="text-gray-500 hover:text-gray-800 text-2xl"
        >
          ×
        </button>

      </div>

      {/* Student Information */}
      <div className="p-6">

        {/* Student Avatar */}
        <div className="flex items-center gap-4 mb-6">

          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
            {selectedStudent.name.charAt(0)}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {selectedStudent.name}
            </h3>

            <p className="text-sm text-gray-500">
              {selectedStudent.studentId}
            </p>
          </div>

        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div>
            <p className="text-sm text-gray-500">
              Gender
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {selectedStudent.gender}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Department
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {selectedStudent.department}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Year
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {selectedStudent.year}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                selectedStudent.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedStudent.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-medium text-gray-800 mt-1 break-all">
              {selectedStudent.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {selectedStudent.phone}
            </p>
          </div>

        </div>

      </div>

      {/* Modal Footer */}
      <div className="flex justify-end p-6 border-t border-gray-100">

        <button
          onClick={() => setSelectedStudent(null)}
          className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Close
        </button>

      </div>

          </div>
    </div>
  )}
    </>
  );
}

export default Students;