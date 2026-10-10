import { useEffect, useState } from "react"
import teachersData from "../data/teachers"

function Teachers() {
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem("teachers")
    return saved ? JSON.parse(saved) : teachersData
  })

  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [formErrors, setFormErrors] = useState({})
  const [notification, setNotification] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    department: "Computer Science",
    subject: "",
    email: "",
    phone: "",
    status: "Active",
  })

  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers))
  }, [teachers])

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(search.toLowerCase())
    const matchesDepartment =
      departmentFilter === "All" || teacher.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3500)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    else if (formData.name.trim().length < 2) errors.name = "Name must be at least 2 characters"

    if (!formData.employeeId.trim()) {
      errors.employeeId = "Employee ID is required"
    } else {
      const isDuplicate = teachers.some(
        (t) =>
          t.employeeId.trim().toLowerCase() === formData.employeeId.trim().toLowerCase() &&
          t.id !== editingTeacher?.id
      )
      if (isDuplicate) errors.employeeId = "Employee ID already exists"
    }

    if (!formData.subject.trim()) errors.subject = "Subject is required"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!emailRegex.test(formData.email.trim())) errors.email = "Invalid email address"

    const phoneDigits = formData.phone.replace(/\D/g, "")
    if (!formData.phone.trim()) errors.phone = "Phone is required"
    else if (phoneDigits.length < 9) errors.phone = "Phone must have at least 9 digits"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      employeeId: "",
      department: "Computer Science",
      subject: "",
      email: "",
      phone: "",
      status: "Active",
    })
    setFormErrors({})
    setEditingTeacher(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (editingTeacher) {
      setTeachers(
        teachers.map((t) =>
          t.id === editingTeacher.id ? { ...formData, id: editingTeacher.id } : t
        )
      )
      showNotification("Teacher updated successfully!")
    } else {
      const newTeacher = {
        ...formData,
        id: Date.now(),
      }
      setTeachers([...teachers, newTeacher])
      showNotification("Teacher added successfully!")
    }
    resetForm()
  }

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      name: teacher.name,
      employeeId: teacher.employeeId,
      department: teacher.department,
      subject: teacher.subject,
      email: teacher.email,
      phone: teacher.phone || "",
      status: teacher.status,
    })
    setShowForm(true)
    setFormErrors({})
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(teachers.filter((t) => t.id !== id))
      showNotification("Teacher deleted successfully!")
    }
  }

  const handleView = (teacher) => setSelectedTeacher(teacher)

  const activeCount = teachers.filter((t) => t.status === "Active").length
  const inactiveCount = teachers.length - activeCount

  return (
    <div>
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
          <p className="mt-2 text-gray-500">Manage all teachers and their information.</p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm()
            else {
              setShowForm(true)
              setEditingTeacher(null)
              setFormData({
                name: "",
                employeeId: "",
                department: "Computer Science",
                subject: "",
                email: "",
                phone: "",
                status: "Active",
              })
              setFormErrors({})
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
        >
          {showForm ? "Close Form" : "+ Add Teacher"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Teachers</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{teachers.length}</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Active</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">{activeCount}</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Inactive</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">{inactiveCount}</h2>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Dr. Abebe Mekonnen"
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.employeeId ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="TCH001"
              />
              {formErrors.employeeId && (
                <p className="text-red-500 text-sm mt-1">{formErrors.employeeId}</p>
              )}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.subject ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Programming"
              />
              {formErrors.subject && (
                <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="teacher@example.com"
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0912345678"
              />
              {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
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
                {editingTeacher ? "Update Teacher" : "Add Teacher"}
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
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, ID or subject..."
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
          {filteredTeachers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No teachers found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filters, or add a new teacher.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Employee ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Department</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Subject</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">{teacher.employeeId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{teacher.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{teacher.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{teacher.subject}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          teacher.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(teacher)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                        <button onClick={() => handleEdit(teacher)} className="text-amber-600 hover:text-amber-800 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Teacher Details</h2>
              <button onClick={() => setSelectedTeacher(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800">{selectedTeacher.name}</h3>
                <p className="text-sm text-gray-500">{selectedTeacher.employeeId}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedTeacher.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedTeacher.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800 mt-1 break-all">{selectedTeacher.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800 mt-1">{selectedTeacher.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedTeacher.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {selectedTeacher.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-100">
              <button onClick={() => setSelectedTeacher(null)} className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Teachers
