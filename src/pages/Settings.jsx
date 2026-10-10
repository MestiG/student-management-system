import { useEffect, useState } from "react"

function Settings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings")
    return saved
      ? JSON.parse(saved)
      : {
          schoolName: "Jimma Student Management System",
          schoolEmail: "admin@school.edu",
          adminName: "Administrator",
          role: "Admin",
          notifications: true,
          emailNotifications: true,
        }
  })

  const [notification, setNotification] = useState("")
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3500)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    })
    setIsDirty(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!settings.schoolName.trim()) {
      showNotification("School name is required")
      return
    }
    if (!settings.adminName.trim()) {
      showNotification("Administrator name is required")
      return
    }
    setIsDirty(false)
    showNotification("Settings saved successfully!")
  }

  const handleReset = () => {
    if (window.confirm("Reset all settings to defaults?")) {
      const defaults = {
        schoolName: "Jimma Student Management System",
        schoolEmail: "admin@school.edu",
        adminName: "Administrator",
        role: "Admin",
        notifications: true,
        emailNotifications: true,
      }
      setSettings(defaults)
      setIsDirty(false)
      showNotification("Settings reset to defaults")
    }
  }

  return (
    <div>
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="mt-2 text-gray-500">Manage your system and account preferences.</p>
      </div>

      <form onSubmit={handleSave}>
        {/* School Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">School Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
              <input
                type="text"
                name="schoolName"
                value={settings.schoolName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">School Email</label>
              <input
                type="email"
                name="schoolEmail"
                value={settings.schoolEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Administrator Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Administrator Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Administrator Name *
              </label>
              <input
                type="text"
                name="adminName"
                value={settings.adminName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={settings.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">Enable system notifications</p>
                <p className="text-sm text-gray-500">Show in-app success and error messages</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">Email notifications</p>
                <p className="text-sm text-gray-500">Receive important updates via email</p>
              </div>
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Management</h2>
          <p className="text-sm text-gray-500 mb-4">
            All data is stored locally in your browser (localStorage). Clearing browser data will
            reset the application.
          </p>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "This will clear ALL students, teachers, courses, classes, attendance, and results data. Are you sure?"
                )
              ) {
                ;[
                  "students",
                  "teachers",
                  "courses",
                  "classes",
                  "attendance",
                  "results",
                ].forEach((key) => localStorage.removeItem(key))
                showNotification("All application data has been cleared. Refresh the page.")
              }
            }}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm font-medium"
          >
            Clear All Application Data
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Save Settings
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
          >
            Reset to Defaults
          </button>
          {isDirty && (
            <span className="text-sm text-amber-600 self-center">You have unsaved changes</span>
          )}
        </div>
      </form>
    </div>
  )
}

export default Settings
