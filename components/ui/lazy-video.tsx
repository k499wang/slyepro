"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string
  poster?: string
  className?: string
  /** Enable WebM source (looks for .webm version of the file) */
  webm?: boolean
}

export function LazyVideo({ src, poster, className, webm = true, ...props }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Generate WebM path from MP4 path
  const webmSrc = src.replace(/\.mp4$/, '.webm')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading earlier for smoother experience
      }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.load()
    }
  }, [isInView])

  return (
    <video
      ref={videoRef}
      poster={poster}
      className={cn(
        "transition-opacity duration-500",
        isLoaded ? "opacity-100" : "opacity-80",
        className
      )}
      onLoadedData={() => setIsLoaded(true)}
      preload="none"
      muted
      loop
      playsInline
      {...props}
    >
      {isInView && (
        <>
          {webm && <source src={webmSrc} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </>
      )}
    </video>
  )
}
