"use client"

import { useEffect, useRef } from "react"
import { useVideoLoader } from "./page-loader"

interface LoadedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string
}

export function LoadedVideo({ src, className, ...props }: LoadedVideoProps) {
  const { registerVideo, onVideoLoaded } = useVideoLoader()
  const hasRegistered = useRef(false)
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerVideo()
      hasRegistered.current = true
    }
  }, [registerVideo])

  const handleLoaded = () => {
    if (!hasLoaded.current) {
      onVideoLoaded()
      hasLoaded.current = true
    }
  }

  return (
    <video
      src={src}
      className={className}
      onLoadedData={handleLoaded}
      onCanPlay={handleLoaded}
      {...props}
    />
  )
}
