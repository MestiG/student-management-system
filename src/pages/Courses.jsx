import { useEffect, useState } from "react"
import coursesData from "../data/courses"

function Courses() {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses")
    return saved ? JSON.parse(saved) : coursesData
  })

  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [formErrors, setFormErrors] = useState({})
  const [notification, setNotification] = useState("")

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "Computer Science",
    instructor: "",
    credits: 3,
    semester: "Semester 1",
    status: "Active",
  })

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses))
  }, [courses])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase())
    const matchesDepartment =
      departmentFilter === "All" || course.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3500)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.code.trim()) errors.code = "Course code is required"
    else {
      const isDuplicate = courses.some(
        (c) =>
          c.code.trim().toLowerCase() === formData.code.trim().toLowerCase() &&
          c.id !== editingCourse?.id
      )
      if (isDuplicate) errors.code = "Course code already exists"
    }
    if (!formData.name.trim()) errors.name = "Course name is required"
    if (!formData.instructor.trim()) errors.instructor = "Instructor is required"
    if (!formData.credits || formData.credits < 1) errors.credits = "Credits must be at least 1"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "credits" ? Number(value) : value,
    })
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" })
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      department: "Computer Science",
      instructor: "",
      credits: 3,
      semester: "Semester 1",
      status: "Active",
    })
    setFormErrors({})
    setEditingCourse(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (editingCourse) {
      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id ? { ...formData, id: editingCourse.id } : c
        )
      )
      showNotification("Course updated successfully!")
    } else {
      setCourses([...courses, { ...formData, id: Date.now() }])
      showNotification("Course added successfully!")
    }
    resetForm()
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      code: course.code,
      name: course.name,
      department: course.department,
      instructor: course.instructor,
      credits: course.credits,
      semester: course.semester,
      status: course.status,
    })
    setShowForm(true)
    setFormErrors({})
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== id))
      showNotification("Course deleted successfully!")
    }
  }

  const activeCount = courses.filter((c) => c.status === "Active").length

  return (
    <div>
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
          <p className="mt-2 text-gray-500">Manage all courses and curriculum.</p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
        >
          {showForm ? "Close Form" : "+ Add Course"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Courses</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{courses.length}</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">{activeCount}</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Inactive</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">{courses.length - activeCount}</h2>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {editingCourse ? "Edit Course" : "Add New Course"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="CS101"
              />
              {formErrors.code && <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Introduction to Programming"
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Software Engineering">Software Engineering</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.instructor ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Dr. Abebe Mekonnen"
              />
              {formErrors.instructor && (
                <p className="text-red-500 text-sm mt-1">{formErrors.instructor}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credits *</label>
              <input
                type="number"
                name="credits"
                min="1"
                max="6"
                value={formData.credits}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.credits ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.credits && (
                <p className="text-red-500 text-sm mt-1">{formErrors.credits}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                {editingCourse ? "Update Course" : "Add Course"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, code or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>
            <button
              onClick={() => {
                setSearch("")
                setDepartmentFilter("All")
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {filteredCourses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No courses found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filters, or add a new course.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Code</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Department</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Instructor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Credits</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{course.code}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{course.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.instructor}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.credits}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Course Details</h2>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{selectedCourse.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{selectedCourse.code}</p>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedCourse.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Instructor</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedCourse.instructor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Credits</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedCourse.credits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Semester</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedCourse.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedCourse.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedCourse.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Courses
