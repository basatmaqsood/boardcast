"use client"

import { useState, useEffect } from "react"
import LoginForm from "../../components/login-form"
import DrawingBoard from "../../components/drawing-board"

export default function Home() {
  const [user, setUser] = useState(null)
  const [boardId, setBoardId] = useState("default-board")

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("drawingBoardUser")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse saved user", e)
        localStorage.removeItem("drawingBoardUser")
      }
    }
  }, [])

  const handleLogin = (username) => {
    const newUser = {
      id: Date.now().toString(),
      name: username,
      color: getRandomColor(),
    }
    setUser(newUser)
    localStorage.setItem("drawingBoardUser", JSON.stringify(newUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("drawingBoardUser")
  }

  return (
    <main className="min-h-screen flex flex-col bg-black">
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <DrawingBoard user={user} boardId={boardId} onLogout={handleLogout} />
      )}
            <footer className="py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-300">
              &copy; {new Date().getFullYear()} BoardCast. All rights reserved.
            </p>
            <p className="m-3">
          Developed with ❤️ by 
          <a href="https://www.basatmaqsood.live" target="_blank"> Basat Maqsood</a>
        </p>
          </div>
        </footer>
    </main>
  )
}

// Helper function to generate random color
function getRandomColor() {
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

