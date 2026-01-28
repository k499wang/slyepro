"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

interface VideoLoaderContextType {
  registerVideo: () => void
  onVideoLoaded: () => void
  isLoading: boolean
}

const VideoLoaderContext = createContext<VideoLoaderContextType | null>(null)

export function useVideoLoader() {
  const context = useContext(VideoLoaderContext)
  if (!context) {
    throw new Error("useVideoLoader must be used within a PageLoader")
  }
  return context
}

interface PageLoaderProps {
  children: React.ReactNode
}

export function PageLoader({ children }: PageLoaderProps) {
  const [totalVideos, setTotalVideos] = useState(0)
  const [loadedVideos, setLoadedVideos] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  const registerVideo = useCallback(() => {
    setTotalVideos((prev) => prev + 1)
  }, [])

  const onVideoLoaded = useCallback(() => {
    setLoadedVideos((prev) => prev + 1)
  }, [])

  useEffect(() => {
    // Wait a tick for all videos to register
    const timeout = setTimeout(() => {
      if (totalVideos > 0 && loadedVideos >= totalVideos) {
        setIsLoading(false)
        // Small delay before showing content for smooth transition
        setTimeout(() => setShowContent(true), 100)
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [totalVideos, loadedVideos])

  // Fallback: if videos take too long (8s), show content anyway
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setTimeout(() => setShowContent(true), 100)
      }
    }, 8000)

    return () => clearTimeout(fallbackTimeout)
  }, [isLoading])

  const progress = totalVideos > 0 ? Math.round((loadedVideos / totalVideos) * 100) : 0

  return (
    <VideoLoaderContext.Provider value={{ registerVideo, onVideoLoaded, isLoading }}>
      {/* Loading Screen */}
      <div
        className={`fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-500 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Logo or brand */}
        <div className="mb-8">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Loading
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress text */}
        <div className="mt-4 text-zinc-500 text-sm">
          {progress}%
        </div>
      </div>

      {/* Page Content */}
      <div
        className={`transition-opacity duration-500 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </VideoLoaderContext.Provider>
  )
}
