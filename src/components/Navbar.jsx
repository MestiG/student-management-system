function Navbar() {
  return (
    <header className="h-16 sm:h-20 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Student Management System
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
          Manage your school easily
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">Administrator</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold"
          aria-label="Admin profile"
        >
          A
        </div>
      </div>
    </header>
  )
}

export default Navbar
