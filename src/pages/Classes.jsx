import { useEffect, useState } from "react"
import classesData from "../data/classes"

function Classes() {
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("classes")
    return saved ? JSON.parse(saved) : classesData
  })

  const [showForm, setShowForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [formErrors, setFormErrors] = useState({})
  const [notification, setNotification] = useState("")

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "Computer Science",
    year: "1st Year",
    students: 30,
    room: "",
    schedule: "",
    status: "Active",
  })

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes))
  }, [classes])

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(search.toLowerCase()) ||
      cls.code.toLowerCase().includes(search.toLowerCase()) ||
      cls.room.toLowerCase().includes(search.toLowerCase())
    const matchesDepartment =
      departmentFilter === "All" || cls.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3500)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.code.trim()) errors.code = "Class code is required"
    else {
      const isDuplicate = classes.some(
        (c) =>
          c.code.trim().toLowerCase() === formData.code.trim().toLowerCase() &&
          c.id !== editingClass?.id
      )
      if (isDuplicate) errors.code = "Class code already exists"
    }
    if (!formData.name.trim()) errors.name = "Class name is required"
    if (!formData.room.trim()) errors.room = "Room is required"
    if (!formData.schedule.trim()) errors.schedule = "Schedule is required"
    if (!formData.students || formData.students < 1)
      errors.students = "Number of students must be at least 1"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "students" ? Number(value) : value,
    })
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" })
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      department: "Computer Science",
      year: "1st Year",
      students: 30,
      room: "",
      schedule: "",
      status: "Active",
    })
    setFormErrors({})
    setEditingClass(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (editingClass) {
      setClasses(
        classes.map((c) =>
          c.id === editingClass.id ? { ...formData, id: editingClass.id } : c
        )
      )
      showNotification("Class updated successfully!")
    } else {
      setClasses([...classes, { ...formData, id: Date.now() }])
      showNotification("Class added successfully!")
    }
    resetForm()
  }

  const handleEdit = (cls) => {
    setEditingClass(cls)
    setFormData({
      code: cls.code,
      name: cls.name,
      department: cls.department,
      year: cls.year,
      students: cls.students,
      room: cls.room,
      schedule: cls.schedule,
      status: cls.status,
    })
    setShowForm(true)
    setFormErrors({})
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setClasses(classes.filter((c) => c.id !== id))
      showNotification("Class deleted successfully!")
    }
  }

  const activeCount = classes.filter((c) => c.status === "Active").length
  const totalStudents = classes.reduce((sum, c) => sum + (c.students || 0), 0)

  return (
    <div>
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Classes</h1>
          <p className="mt-2 text-gray-500">Manage class sections and schedules.</p>
        </div>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
        >
          {showForm ? "Close Form" : "+ Add Class"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Classes</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{classes.length}</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active Classes</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">{activeCount}</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Enrolled</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">{totalStudents}</h2>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {editingClass ? "Edit Class" : "Add New Class"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="CS-A-01"
              />
              {formErrors.code && <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Computer Science - Section A"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Students *</label>
              <input
                type="number"
                name="students"
                min="1"
                value={formData.students}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.students ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.students && (
                <p className="text-red-500 text-sm mt-1">{formErrors.students}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room *</label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.room ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Room 101"
              />
              {formErrors.room && <p className="text-red-500 text-sm mt-1">{formErrors.room}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schedule *</label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.schedule ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Mon & Wed - 8:00 AM"
              />
              {formErrors.schedule && (
                <p className="text-red-500 text-sm mt-1">{formErrors.schedule}</p>
              )}
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
                {editingClass ? "Update Class" : "Add Class"}
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
            Showing {filteredClasses.length} of {classes.length} classes
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, code or room..."
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
          {filteredClasses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No classes found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filters, or add a new class.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Code</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Department</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Year</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Students</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Room</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((cls) => (
                  <tr key={cls.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{cls.code}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{cls.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cls.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cls.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cls.students}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cls.room}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cls.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedClass(cls)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(cls)}
                          className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cls.id)}
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

      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Class Details</h2>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{selectedClass.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{selectedClass.code}</p>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedClass.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedClass.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Students</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedClass.students}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedClass.room}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedClass.schedule}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedClass.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedClass.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedClass(null)}
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

export default Classes
