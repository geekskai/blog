"use client"

import React, { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  MonitorPlay,
} from "lucide-react"

interface HLSPlayerProps {
  url: string
  onLoading?: (isLoading: boolean) => void
  onError?: (error: string) => void
}

export default function HLSPlayer({ url, onLoading, onError }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [hasVideo, setHasVideo] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let hls: Hls

    if (videoRef.current && url) {
      if (Hls.isSupported()) {
        hls = new Hls()
        hls.loadSource(url)
        hls.attachMedia(videoRef.current)
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          onLoading?.(false)
          setHasVideo(hls.levels.length > 0 && !!hls.levels[0].width)
          // Autoplay on manifest parsed
          videoRef.current?.play().catch((err) => console.log("Autoplay blocked:", err))
          setIsPlaying(true)
        })
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            onError?.(`HLS Error: ${data.type}`)
          }
        })
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = url
        videoRef.current.addEventListener("loadedmetadata", () => {
          onLoading?.(false)
          setHasVideo(true)
          // Autoplay for native Safari
          videoRef.current?.play().catch((err) => console.log("Autoplay blocked:", err))
          setIsPlaying(true)
        })
      }
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [url, onLoading, onError])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const total = videoRef.current.duration
      setCurrentTime(current)
      setDuration(total)
      setProgress((current / total) * 100)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime
      setProgress(parseFloat(e.target.value))
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMute = !isMuted
      setIsMuted(newMute)
      videoRef.current.muted = newMute
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handlePlaybackRateChange = () => {
    const rates = [1, 1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]
    setPlaybackRate(nextRate)
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl transition-all ${isFullscreen ? "h-screen w-screen rounded-none" : "aspect-video"}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        playsInline
      />

      {/* Audio-only Placeholder (if no video track detected) */}
      {!hasVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 transition-opacity">
          <div
            className={`relative flex h-48 w-48 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl md:h-64 md:w-64 ${isPlaying ? "animate-pulse" : ""}`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 opacity-50"></div>
            <MonitorPlay
              className={`h-24 w-24 text-purple-400 transition-transform duration-500 ${isPlaying ? "rotate-3 scale-110" : "scale-100"}`}
            />
          </div>
          <div className="mt-8 px-6 text-center">
            <h3 className="mb-2 text-xl font-bold text-white">HLS Streaming Source</h3>
            <p className="max-w-md truncate text-sm text-slate-400">{url}</p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {duration === 0 && !hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 md:p-6 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress Slider */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress || 0}
            onChange={handleSeek}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-purple-500 transition-all hover:bg-white/30"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={togglePlay}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-1 h-5 w-5 fill-current" />
              )}
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-white md:text-sm">
              <span>{formatTime(currentTime)}</span>
              <span className="opacity-50">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Playback Rate */}
            <button
              onClick={handlePlaybackRateChange}
              className="hidden rounded px-2 py-1 text-xs font-bold text-white transition-colors hover:bg-white/10 md:block"
            >
              {playbackRate}x
            </button>

            {/* Mute/Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white opacity-70 transition-opacity hover:opacity-100"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value)
                  setVolume(v)
                  if (videoRef.current) {
                    videoRef.current.volume = v
                    setIsMuted(v === 0)
                  }
                }}
                className="hidden h-1 w-20 cursor-pointer appearance-none rounded-lg bg-white/20 accent-purple-500 md:block"
              />
            </div>

            {/* Settings/Quality (Placeholder) */}
            <button className="text-white opacity-70 transition-opacity hover:opacity-100 disabled:opacity-30">
              <Settings className="h-5 w-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white opacity-70 transition-opacity hover:opacity-100"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
