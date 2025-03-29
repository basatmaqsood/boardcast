// Generate a random color
export function getRandomColor() {
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

// Format date to readable string
export function formatDate(date) {
  if (!date) return ""

  const d = new Date(date)
  return d.toLocaleString()
}

// Debounce function to limit function calls
export function debounce(func, wait) {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

