"use client"

import React, { useState, useRef, useEffect } from "react"

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [showVolume, setShowVolume] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((err) => {
          console.log("音频播放失败:", err)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="pointer-events-auto fixed right-6 top-6 z-[20] flex items-center gap-3">
      {/* 音量控制 */}
      <div
        className={`transition-all duration-300 ${
          showVolume ? "w-32 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <div className="rounded-full border border-pink-400/30 bg-gradient-to-r from-pink-900/60 to-purple-900/60 p-2 backdrop-blur-xl">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-pink-300/30 outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-400"
          />
        </div>
      </div>

      {/* 播放按钮 */}
      <button
        onClick={togglePlay}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
        className="group relative h-14 w-14 overflow-hidden rounded-full border border-pink-400/40 bg-gradient-to-br from-pink-500/20 to-purple-500/20 shadow-[0_0_20px_rgba(255,105,180,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,105,180,0.5)]"
        style={{ cursor: "pointer" }}
        title={isPlaying ? "暂停音乐" : "播放音乐"}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-purple-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-full w-full items-center justify-center text-2xl">
          {isPlaying ? <span className="animate-pulse">🎵</span> : <span>🎵</span>}
        </div>

        {/* 播放中的动画波纹 */}
        {isPlaying && (
          <>
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-pink-400/50 opacity-75"></div>
            <div
              className="absolute inset-0 animate-ping rounded-full border-2 border-purple-400/50 opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </>
        )}
      </button>

      {/* 隐藏的音频元素 - 你可以在这里添加实际的音乐文件 */}
      <audio ref={audioRef} loop>
        {/*
        添加音乐文件示例:
        <source src="/music/love-song.mp3" type="audio/mpeg" />
        <source src="/music/love-song.ogg" type="audio/ogg" />
        */}
        {/* 暂时使用浏览器生成的音调作为占位 */}
      </audio>

      {/* 提示文字 */}
      <div
        className={`pointer-events-none absolute right-0 top-16 whitespace-nowrap rounded-lg border border-pink-400/30 bg-pink-900/80 px-3 py-2 text-xs text-pink-100 backdrop-blur-xl transition-all duration-300 ${
          showVolume ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
      >
        {isPlaying ? "🎶 浪漫进行中..." : "🎵 点击播放音乐"}
      </div>
    </div>
  )
}
