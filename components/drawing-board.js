"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import Toolbar from "./toolbar";
import UsersList from "./users-list";
import Link from "next/link";

export default function DrawingBoard({ user, boardId, onLogout }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const socketRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Drawing settings
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [brushStyle, setBrushStyle] = useState("normal"); // normal, dotted, spray
  const [tool, setTool] = useState("brush"); // brush, eraser

  // Initialize canvas and socket connection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      // Initialize context after resize
      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize;

      // Set white background
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);

      contextRef.current = context;

      // Redraw canvas if we have history
      if (drawingHistory.length > 0 && historyIndex >= 0) {
        const img = new Image();
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillRect(0, 0, canvas.width, canvas.height); // Add white background
          context.drawImage(img, 0, 0);
        };
        img.src = drawingHistory[historyIndex];
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize Socket.IO connection to the standalone server
    const SOCKET_SERVER_URL =  "https://api-boardcast.basatmaqsood.com/";
    const socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket"], // Force WebSocket transport
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
      socket.emit("join-board", { boardId, user });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    // Request sync when user joins
    socket.emit("request-sync");

    // Listen for board updates
    socket.on("update-board", (data) => {
      // updateCanvas(data);
    });

    // Listen for synchronization messages every 10s
    socket.on("sync-board", (data) => {
      console.log("Received board data:", data);

      // Extract base64 image string
      const imageData = data["default-board"];

      if (imageData) {
        const img = new Image();
        img.src = imageData;

        img.onload = () => {
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height); // Add white background
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the received image
        };
      } else {
        console.error("Invalid board data received");
      }
    });

    socket.on("users-update", (users) => {
      setActiveUsers(users);
    });

    socket.on("draw-line", (data) => {
      if (data.userId !== user.id) {
        drawLine(data);
      }
    });

    socket.on("clear-canvas", () => {
      clearCanvas();
    });

    socket.on("load-board", (imageData) => {
      if (imageData) {
        loadImageToCanvas(imageData);
        addToHistory(imageData);
      }
    });

    socket.on("board-saved", (timestamp) => {
      console.log("Board saved at:", timestamp);
      setIsSaving(false);
      setLastSaved(new Date(timestamp));
    });

    socketRef.current = socket;

    // Load initial board state
    socket.emit("get-board", boardId);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      socket.off("update-board");
      socket.off("sync-board");
      socket.disconnect();
    };
  }, [boardId, user, brushColor, brushSize]);

  // Update context when brush settings change
  useEffect(() => {
    if (!contextRef.current) return;

    contextRef.current.strokeStyle = tool === "eraser" ? "#FFFFFF" : brushColor;
    contextRef.current.lineWidth = brushSize;

    if (brushStyle === "dotted") {
      contextRef.current.setLineDash([brushSize, brushSize * 2]);
    } else {
      contextRef.current.setLineDash([]);
    }
  }, [brushColor, brushSize, brushStyle, tool]);

  // Drawing functions
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = getCoordinates(nativeEvent);

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);

    setIsDrawing(true);

    // Emit drawing start to server
    socketRef.current.emit("draw-line", {
      boardId,
      userId: user.id,
      start: { x: offsetX, y: offsetY },
      end: { x: offsetX, y: offsetY },
      color: contextRef.current.strokeStyle,
      size: contextRef.current.lineWidth,
      style: brushStyle,
    });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = getCoordinates(nativeEvent);

    if (brushStyle === "spray") {
      drawSpray(offsetX, offsetY);
    } else {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }

    // Emit drawing to server
    socketRef.current.emit("draw-line", {
      boardId,
      userId: user.id,
      start: {
        x: contextRef.current.lastX || offsetX,
        y: contextRef.current.lastY || offsetY,
      },
      end: { x: offsetX, y: offsetY },
      color: contextRef.current.strokeStyle,
      size: contextRef.current.lineWidth,
      style: brushStyle,
    });

    // Store last position
    contextRef.current.lastX = offsetX;
    contextRef.current.lastY = offsetY;
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    contextRef.current.closePath();
    setIsDrawing(false);

    // Clear last position
    contextRef.current.lastX = undefined;
    contextRef.current.lastY = undefined;

    // Save current state to history
    saveToHistory();
    // socket.emit("request-sync");
  };

  const drawLine = (data) => {
    if (brushSize === null) {
      alert("Please select a brush size before drawing.");
    }
    const { start, end, color, size, style } = data;
    const ctx = contextRef.current;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    if (style === "dotted") {
      ctx.setLineDash([size, size * 2]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    if (style === "spray") {
      drawSpray(end.x, end.y, color, size);
    } else {
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    ctx.closePath();
    ctx.restore();
  };

  const drawSpray = (x, y, color, size) => {
    const ctx = contextRef.current;
    const originalColor = ctx.strokeStyle;
    const originalSize = ctx.lineWidth;

    if (color) ctx.strokeStyle = color;
    if (size) ctx.lineWidth = size;

    const density = size * 2;
    const radius = size * 3;

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;

      const sprayX = x + distance * Math.cos(angle);
      const sprayY = y + distance * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(sprayX, sprayY);
      ctx.lineTo(sprayX, sprayY);
      ctx.stroke();
      ctx.closePath();
    }

    if (color) ctx.strokeStyle = originalColor;
    if (size) ctx.lineWidth = originalSize;
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");
    addToHistory(imageData);

    // Auto-save to server
    saveToServer(imageData);
  };

  const addToHistory = (imageData) => {
    // Remove any "future" history if we're not at the end
    const newHistory = drawingHistory.slice(0, historyIndex + 1);
    newHistory.push(imageData);

    // Limit history size to prevent memory issues
    if (newHistory.length > 20) {
      newHistory.shift();
    }

    setDrawingHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      loadImageToCanvas(drawingHistory[newIndex]);

      // Emit the new state to server
      saveToServer(drawingHistory[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      loadImageToCanvas(drawingHistory[newIndex]);

      // Emit the new state to server
      saveToServer(drawingHistory[newIndex]);
    }
  };

  const loadImageToCanvas = (imageData) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (imageData) {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height); // Add white background
        context.drawImage(img, 0, 0);
      };
      img.src = imageData;
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height); // Add white background
    }
  };

  const saveToServer = useCallback(
    (imageData) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        setIsSaving(true);
        socketRef.current.emit("save-board", { boardId, imageData });
        setTimeout(() => {
          setIsSaving(false);
        }, 10); // Simulate save time
      }, 10); // Delay save by 1 second to avoid spam
    },
    [boardId]
  );

  const downloadImage = () => {
    const canvas = canvasRef.current;
    // Ensure white background for downloaded image
    const context = canvas.getContext("2d");

    // Create a temporary canvas to ensure white background
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempContext = tempCanvas.getContext("2d");

    // Fill with white background
    tempContext.fillStyle = "#FFFFFF";
    tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the original canvas content on top
    tempContext.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `drawing-board-${boardId}-${new Date()
      .toISOString()
      .slice(0, 10)}.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  // Helper function to get coordinates for both mouse and touch events
  const getCoordinates = (event) => {
    let offsetX, offsetY;

    if (event.type.includes("touch")) {
      const touch = event.touches[0] || event.changedTouches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
    } else {
      offsetX = event.offsetX;
      offsetY = event.offsetY;
    }

    return { offsetX, offsetY };
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking on canvas in mobile view
  const handleCanvasClick = () => {
    if (sidebarOpen && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height); // Add white background
    saveToHistory();

    // Emit clear canvas to server
    socketRef.current.emit("clear-canvas", { boardId });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="flex flex-col py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-b shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            BoardCast: NOT BroadCast
          </h1>

          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="p-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span className="hidden sm:inline">About</span>
            </Link>

            <button
              onClick={downloadImage}
              className="p-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
              aria-label="Download image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Last saved status under the title */}
        <div className="mt-1 text-xs text-gray-600">
          {isSaving && (
            <span className="animate-pulse-slow text-gray-100">Saving...</span>
          )}
          {lastSaved && !isSaving && (
            <span className="text-gray-100">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {!isConnected && (
            <span className="text-red-400 animate-pulse-slow ml-2">
              Connecting...
            </span>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Canvas area */}
        <div className="flex-1 relative bg-white" onClick={handleCanvasClick}>
          <canvas
            ref={canvasRef}
            className="drawing-board absolute inset-0 cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {/* Sidebar - positioned absolutely on mobile to cover full height */}
        <div
          className={` 
            fixed inset-y-0 right-0 md:relative z-30 md:z-auto
            ${
              sidebarOpen
                ? "translate-x-0"
                : "translate-x-full md:translate-x-0"
            }
            transition-transform duration-300 ease-in-out
            flex flex-col w-64 h-full bg-white shadow-lg md:shadow-none md:border-l
          `}
          style={{ maxWidth: "80vw" }}
        >
          <div className="flex flex-col h-full overflow-hidden ">
            <div className="flex justify-between items-center p-3 border-b">
              <h2 className="font-semibold text-sm">Drawing Tools</h2>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-100 md:hidden"
                aria-label="Close toolbar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <Toolbar
                brushColor={brushColor}
                setBrushColor={setBrushColor}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                brushStyle={brushStyle}
                setBrushStyle={setBrushStyle}
                tool={tool}
                setTool={setTool}
                onUndo={undo}
                onRedo={redo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < drawingHistory.length - 1}
              />

              <div className="mt-4">
                <UsersList users={activeUsers} currentUser={user} />
              </div>
            </div>

            {/* Connection status and logout button at bottom of sidebar */}
            <div className="p-3 border-t flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">
                  {isConnected ? (
                    <span className="text-green-600 flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-1 inline-block"></span>
                      Connected
                    </span>
                  ) : (
                    <span className="text-red-500 animate-pulse-slow flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1 inline-block"></span>
                      Disconnected
                    </span>
                  )}
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay to close sidebar when clicking outside on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Floating action button for mobile to quickly toggle toolbar */}
        <button
          className="md:hidden fixed bottom-4 right-4 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center z-10"
          onClick={toggleSidebar}
          aria-label="Open toolbar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
          </svg>
        </button>
      </div>

    </div>
    
  );
}
