"use client"

export default function UsersList({ users, currentUser }) {
  if (!users || users.length === 0) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Active Users (1)</h3>
        <div className="flex items-center space-x-2 p-2 rounded-md bg-blue-50">
          <div className="user-avatar" style={{ backgroundColor: currentUser?.color || "#3B82F6" }}>
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium">{currentUser?.name} (You)</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Active Users ({users.length})</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {users.map((user,i) => (
          <div
            key={i}
            className={`flex items-center space-x-2 p-2 rounded-md ${
              user.id === currentUser.id ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            <div className="user-avatar" style={{ backgroundColor: user.color || "#3B82F6" }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium">
              {user.name} {user.id === currentUser.id && "(You)"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

