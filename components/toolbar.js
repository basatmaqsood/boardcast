"use client"

import { useState } from "react"

const COLORS = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#FFA500",
  "#FFFF00",
  "#008000",
  "#0000FF",
  "#4B0082",
  "#EE82EE",
  "#FFC0CB",
  "#A52A2A",
  "#808080",
]

const SIZES = [2, 5, 10, 15, 20]

const STYLES = [
  { id: "normal", label: "Normal" },
  { id: "dotted", label: "Dotted" },
  // { id: "spray", label: "Spray" },
]

export default function Toolbar({
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  brushStyle,
  setBrushStyle,
  tool,
  setTool,
  // onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) {
  const [showColorPicker, setShowColorPicker] = useState(false)

  return (
    <div className="flex flex-col space-y-6">
      <div className="">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tools</h3>
        
        <div className="flex space-x-2">
          <button
            className={`tool-button ${tool === "brush" ? "active" : ""}`}
            onClick={() => setTool("brush")}
            title="Brush"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
          </button>
          <button
            className={`tool-button ${tool === "eraser" ? "active" : ""}`}
            onClick={() => setTool("eraser")}
            title="Eraser"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 20H7L3 16c-1.5-1.5-1.5-3.5 0-5l7-7c1.5-1.5 3.5-1.5 5 0l5 5c1.5 1.5 1.5 3.5 0 5l-7 7"></path>
              <path d="M6 11l5 5"></path>
            </svg>
          </button>
          {/* <button className="tool-button" onClick={onClear} title="Clear Canvas">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button> */}
          <button
            className={`tool-button ${!canUndo ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7v6h6"></path>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
            </svg>
          </button>
          <button
            className={`tool-button ${!canRedo ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 7v6h-6"></path>
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
            </svg>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Color</h3>
        <div className="relative">
          <div
            className="color-picker active"
            style={{ backgroundColor: brushColor }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />

          {showColorPicker && (
            <div className="absolute z-10 mt-2 p-2 bg-white rounded-md shadow-lg grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <div
                  key={color}
                  className={`color-picker ${color === brushColor ? "active" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setBrushColor(color)
                    setShowColorPicker(false)
                  }}
                />
              ))}
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-8 h-8 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Brush Size</h3>
        <div className="flex space-x-2">
          {SIZES.map((size) => (
            <div
              key={size}
              className={`brush-size ${size === brushSize ? "active" : ""}`}
              onClick={() => setBrushSize(size) }
            >
              <div
                className="rounded-full bg-current"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: brushColor,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Brush Style</h3>
        <div className="flex space-x-2">
          {STYLES.map((style) => (
            <button
              key={style.id}
              className={`brush-style ${style.id === brushStyle ? "active" : ""}`}
              onClick={() => setBrushStyle(style.id)}
            >
              {style.id === "normal" && <div className="w-5 h-1 bg-black rounded-full" />}
              {style.id === "dotted" && (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-black rounded-full" />
                  <div className="w-1 h-1 bg-black rounded-full" />
                  <div className="w-1 h-1 bg-black rounded-full" />
                </div>
              )}
              {style.id === "spray" && (
                <div className="relative w-5 h-5">
                  <div className="absolute w-1 h-1 bg-black rounded-full" style={{ top: "30%", left: "30%" }} />
                  <div className="absolute w-1 h-1 bg-black rounded-full" style={{ top: "50%", left: "70%" }} />
                  <div className="absolute w-1 h-1 bg-black rounded-full" style={{ top: "70%", left: "40%" }} />
                  <div className="absolute w-1 h-1 bg-black rounded-full" style={{ top: "20%", left: "60%" }} />
                  <div className="absolute w-1 h-1 bg-black rounded-full" style={{ top: "40%", left: "20%" }} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

