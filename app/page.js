"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Check if the app is already installed or can be installed
  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsAppInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    });

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {});
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  // Handle the install button click
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="BoardCast" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-white">
              BoardCast: NOT BroadCast
            </h1>
            <Link
              href="/board"
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <p className="text-center"><span className="hidden sm:inline-block">Go to</span>➡</p>
            </Link>
          </div>
        </header>

        <main className="flex-1 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Hero section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Real-time Collaborative Drawing
                </h2>
                <p className="text-lg sm:text-xl opacity-90 max-w-3xl">
                  Create, collaborate, and share your ideas visually with others
                  in real-time, no matter where they are in the world.
                </p>
              </div>

              {/* Navigation tabs */}
              <div className="border-b">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {["overview", "features", "realtime", "howto", "tech"].map(
                    (section) => (
                      <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                          activeSection === section
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {section === "overview" && "Overview"}
                        {section === "features" && "Key Features"}
                        {section === "realtime" && "Real-time Collaboration"}
                        {section === "howto" && "How To Use"}
                        {section === "tech" && "Technical Details"}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Content sections */}
              <div className="p-6 sm:p-8">
                {/* Overview Section */}
                {activeSection === "overview" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Welcome to BoardCast
                    </h3>
                    <p className="text-gray-700">
                      BoardCast is a real-time collaborative drawing board that
                      allows multiple users to draw together simultaneously.
                      Whether you're brainstorming ideas with your team,
                      teaching a concept to students, or just having fun with
                      friends, BoardCast makes it easy to create and share
                      visual content in real-time.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
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
                            className="text-blue-600"
                          >
                            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                            <path d="M2 2l7.586 7.586"></path>
                            <circle cx="11" cy="11" r="2"></circle>
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium mb-2">
                          Draw Together
                        </h4>
                        <p className="text-gray-600">
                          Multiple users can draw on the same canvas
                          simultaneously, seeing each other's changes in
                          real-time.
                        </p>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
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
                            className="text-blue-600"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium mb-2">
                          Customize Your Tools
                        </h4>
                        <p className="text-gray-600">
                          Choose from different brush sizes, colors, and styles
                          to express your ideas exactly how you want.
                        </p>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
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
                            className="text-blue-600"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium mb-2">
                          Save & Share
                        </h4>
                        <p className="text-gray-600">
                          Download your creations as images and share them with
                          others or save them for later use.
                        </p>
                      </div>
                    </div>

                    {/* Install App Button - only show if not installed and can be installed */}
                    {!isAppInstalled && deferredPrompt && (
                      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex flex-col sm:flex-row items-center justify-between">
                          <div className="mb-4 sm:mb-0">
                            <h4 className="text-lg font-medium text-blue-800">
                              Install BoardCast App
                            </h4>
                            <p className="text-sm text-blue-600">
                              Use BoardCast offline and get a better drawing
                              experience!
                            </p>
                          </div>
                          <button
                            onClick={handleInstallClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
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
                              className="mr-2"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Install App
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Features Section */}
                {activeSection === "features" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Key Features
                    </h3>

                    <div className="space-y-8 mt-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
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
                              className="text-blue-600"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="2" y1="12" x2="22" y2="12"></line>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            Real-time Collaboration
                          </h4>
                          <p className="text-gray-700">
                            See others' drawings as they happen. Multiple users
                            can join the same board and draw together
                            simultaneously. Changes are synchronized instantly
                            across all connected devices, making it perfect for
                            remote collaboration.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
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
                              className="text-blue-600"
                            >
                              <circle cx="12" cy="8" r="7"></circle>
                              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            User Presence
                          </h4>
                          <p className="text-gray-700">
                            See who's currently active on the board. Each user
                            gets a unique color identifier, making it easy to
                            distinguish who's drawing what. The active users
                            list shows everyone currently connected to the
                            board.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
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
                              className="text-blue-600"
                            >
                              <circle cx="12" cy="12" r="3"></circle>
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            Drawing Tools
                          </h4>
                          <p className="text-gray-700">
                            Choose from various brush sizes, colors, and styles.
                            Use the eraser to correct mistakes, and undo/redo
                            functionality to step back or forward through your
                            changes. The intuitive toolbar makes it easy to
                            customize your drawing experience.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
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
                              className="text-blue-600"
                            >
                              <path d="M12 2v4"></path>
                              <path d="M12 18v4"></path>
                              <path d="M4.93 4.93l2.83 2.83"></path>
                              <path d="M16.24 16.24l2.83 2.83"></path>
                              <path d="M2 12h4"></path>
                              <path d="M18 12h4"></path>
                              <path d="M4.93 19.07l2.83-2.83"></path>
                              <path d="M16.24 7.76l2.83-2.83"></path>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            Auto-Save & Persistence
                          </h4>
                          <p className="text-gray-700">
                            Your drawings are automatically saved to the server,
                            so you never lose your work. When you or others
                            rejoin the board, the latest state is loaded
                            automatically. The app shows when the last save
                            occurred, giving you peace of mind.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
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
                              className="text-blue-600"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            Export & Share
                          </h4>
                          <p className="text-gray-700">
                            Download your drawings as PNG images with a single
                            click. The downloaded images have a white
                            background, making them perfect for sharing,
                            printing, or using in other applications.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Install App Button - only show if not installed and can be installed */}
                    {!isAppInstalled && deferredPrompt && (
                      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex flex-col sm:flex-row items-center justify-between">
                          <div className="mb-4 sm:mb-0">
                            <h4 className="text-lg font-medium text-blue-800">
                              Install BoardCast App
                            </h4>
                            <p className="text-sm text-blue-600">
                              Get a better drawing experience with our app!
                            </p>
                          </div>
                          <button
                            onClick={handleInstallClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
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
                              className="mr-2"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Install App
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Real-time Collaboration Section */}
                {activeSection === "realtime" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Real-time Collaboration
                    </h3>
                    <p className="text-gray-700">
                      BoardCast uses advanced real-time technology to enable
                      seamless collaboration between users. Here's how our
                      real-time features work:
                    </p>

                    <div className="bg-blue-50 p-6 rounded-lg mt-6">
                      <h4 className="text-lg font-medium mb-4">
                        How Real-time Collaboration Works
                      </h4>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 font-medium">1</span>
                          </div>
                          <p className="text-gray-700">
                            <strong>Instant Synchronization:</strong> When you
                            draw on the canvas, your strokes are immediately
                            transmitted to all other connected users through a
                            WebSocket connection.
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 font-medium">2</span>
                          </div>
                          <p className="text-gray-700">
                            <strong>User Presence:</strong> The app maintains a
                            list of all active users on the board, showing who's
                            currently connected and drawing in real-time.
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 font-medium">3</span>
                          </div>
                          <p className="text-gray-700">
                            <strong>Periodic Synchronization:</strong> The
                            entire board state is periodically synchronized to
                            ensure all users have the same view, even if they
                            missed some updates.
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 font-medium">4</span>
                          </div>
                          <p className="text-gray-700">
                            <strong>Auto-Reconnection:</strong> If your
                            connection drops, the app automatically tries to
                            reconnect and resynchronize the board state when the
                            connection is restored.
                          </p>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 font-medium">5</span>
                          </div>
                          <p className="text-gray-700">
                            <strong>Persistent Storage:</strong> All drawings
                            are saved to the server, so the board state persists
                            even when all users disconnect and return later.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="text-lg font-medium mb-4">
                        Use Cases for Real-time Collaboration
                      </h4>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium mb-2">
                            Remote Team Brainstorming
                          </h5>
                          <p className="text-gray-600">
                            Collaborate on ideas, mind maps, and diagrams with
                            your team members, no matter where they are located.
                          </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium mb-2">
                            Virtual Classrooms
                          </h5>
                          <p className="text-gray-600">
                            Teachers can explain concepts visually while
                            students follow along or contribute to the drawing.
                          </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium mb-2">
                            Design Collaboration
                          </h5>
                          <p className="text-gray-600">
                            Sketch ideas and get immediate feedback from clients
                            or team members during design discussions.
                          </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium mb-2">
                            Interactive Presentations
                          </h5>
                          <p className="text-gray-600">
                            Make your presentations more engaging by drawing and
                            annotating in real-time as you present.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* How To Use Section */}
                {activeSection === "howto" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      How To Use BoardCast
                    </h3>
                    <p className="text-gray-700">
                      Getting started with BoardCast is easy. Follow these
                      simple steps to begin collaborating:
                    </p>

                    <div className="space-y-8 mt-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            1
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">Sign In</h4>
                          <p className="text-gray-700">
                            Enter your name on the login screen to join a
                            drawing board. This name will be visible to other
                            users who join the same board. You'll be assigned a
                            unique color to identify your drawings.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            2
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            Select Your Tools
                          </h4>
                          <p className="text-gray-700">
                            Use the toolbar on the right side of the screen to
                            select your drawing tools:
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                            <li>
                              <strong>Brush Tool:</strong> For drawing lines and
                              shapes
                            </li>
                            <li>
                              <strong>Eraser Tool:</strong> To erase parts of
                              your drawing
                            </li>
                            <li>
                              <strong>Color Picker:</strong> Choose from preset
                              colors or select a custom color
                            </li>
                            <li>
                              <strong>Brush Size:</strong> Adjust the thickness
                              of your brush or eraser
                            </li>
                            <li>
                              <strong>Brush Style:</strong> Choose between
                              solid, dotted, or spray brush styles
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            3
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            Start Drawing
                          </h4>
                          <p className="text-gray-700">
                            Click and drag on the canvas to start drawing. Your
                            strokes will be visible to all other users connected
                            to the same board in real-time. You can see who else
                            is drawing by checking the "Active Users" list in
                            the toolbar.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            4
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            Collaborate
                          </h4>
                          <p className="text-gray-700">
                            As others join the board, you'll see their names in
                            the Active Users list. Each user's drawings appear
                            in real-time as they create them. You can draw
                            simultaneously with other users, making it perfect
                            for collaborative brainstorming or teaching.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            5
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            Save and Share
                          </h4>
                          <p className="text-gray-700">
                            Your work is automatically saved to the server
                            periodically. You can see when the last save
                            occurred at the top of the screen. To download your
                            drawing as an image, click the download button in
                            the top-right corner of the screen.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
                      <div className="flex">
                        <div className="flex-shrink-0">
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
                            className="text-yellow-600"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-yellow-800">
                            Pro Tip
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            To invite others to your drawing board, simply share
                            the URL of your board with them. When they open the
                            link and enter their name, they'll join the same
                            board and can start collaborating immediately.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical Details Section */}
                {activeSection === "tech" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Technical Details
                    </h3>
                    <p className="text-gray-700">
                      BoardCast is built with modern web technologies to provide
                      a smooth, responsive, and real-time collaborative
                      experience. Here's a look at the technology behind the
                      app:
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-medium mb-3">
                          Frontend Technologies
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>Next.js:</strong> React framework for
                              server-rendered applications
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>React:</strong> UI library for building
                              component-based interfaces
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>Tailwind CSS:</strong> Utility-first CSS
                              framework for styling
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>Canvas API:</strong> HTML5 Canvas for
                              drawing functionality
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>Socket.IO Client:</strong> Real-time
                              bidirectional communication
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-medium mb-3">
                          Backend Technologies
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>Node.js:</strong> JavaScript runtime for
                              the server
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>Express:</strong> Web framework for
                              Node.js
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>Socket.IO:</strong> Real-time event-based
                              communication
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>MongoDB:</strong> NoSQL database for
                              storing drawing data
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
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
                              className="text-green-600"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>
                              <strong>Vercel:</strong> Cloud platform for
                              deployment and hosting
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="text-lg font-medium mb-4">
                        How It All Works Together
                      </h4>

                      <div className="bg-gray-50 p-6 rounded-lg">
                        <ol className="space-y-4 text-gray-700">
                          <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              1
                            </div>
                            <p>
                              <strong>Drawing Input:</strong> When you draw on
                              the HTML5 Canvas, the app captures your mouse or
                              touch movements and converts them into drawing
                              commands.
                            </p>
                          </li>

                          <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              2
                            </div>
                            <p>
                              <strong>Real-time Transmission:</strong> These
                              drawing commands are sent to the Socket.IO server,
                              which broadcasts them to all other connected
                              clients.
                            </p>
                          </li>

                          <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              3
                            </div>
                            <p>
                              <strong>Rendering:</strong> Each client receives
                              these commands and renders them on their own
                              canvas, creating the illusion of real-time
                              collaborative drawing.
                            </p>
                          </li>

                          <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              4
                            </div>
                            <p>
                              <strong>Persistence:</strong> Periodically, the
                              entire canvas state is saved as a base64-encoded
                              PNG image and stored in the database, allowing for
                              persistence across sessions.
                            </p>
                          </li>

                          <li className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              5
                            </div>
                            <p>
                              <strong>Synchronization:</strong> When new users
                              join, they receive the latest canvas state from
                              the server, ensuring everyone sees the same
                              drawing regardless of when they joined.
                            </p>
                          </li>
                        </ol>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg mt-8">
                      <h4 className="text-lg font-medium mb-3">
                        Performance Optimizations
                      </h4>
                      <p className="text-gray-700 mb-4">
                        BoardCast implements several optimizations to ensure
                        smooth performance even with multiple users:
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
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
                            className="text-blue-600 mt-0.5"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          <span>
                            Efficient drawing algorithms that minimize CPU usage
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
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
                            className="text-blue-600 mt-0.5"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          <span>
                            Throttled network updates to reduce bandwidth usage
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
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
                            className="text-blue-600 mt-0.5"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          <span>
                            Optimized canvas rendering for smooth drawing
                            experience
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
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
                            className="text-blue-600 mt-0.5"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          <span>
                            Efficient data compression for storing and
                            transmitting canvas states
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Ready to start collaborating?
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/board"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Drawing Board ➡
                </Link>

                {!isAppInstalled && deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
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
                      className="mr-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Install App
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

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
      </div>
    </>
  );
}
