"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Headphones, Pause, Play, Volume2 } from "lucide-react"

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

interface ChapterAudioPlayerProps {
  src: string
  title?: string
  className?: string
}

export default function ChapterAudioPlayer({
  src,
  title = "Chapter audio",
  className = "",
}: ChapterAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const syncTime = () => setCurrentTime(audio.currentTime)
    const syncDuration = () => setDuration(audio.duration || 0)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(audio.duration || 0)
    }

    audio.addEventListener("timeupdate", syncTime)
    audio.addEventListener("loadedmetadata", syncDuration)
    audio.addEventListener("durationchange", syncDuration)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", syncTime)
      audio.removeEventListener("loadedmetadata", syncDuration)
      audio.removeEventListener("durationchange", syncDuration)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume / 100
  }, [volume])

  const progressValue = useMemo(() => [currentTime], [currentTime])
  const volumeValue = useMemo(() => [volume], [volume])

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      await audio.play()
    } else {
      audio.pause()
    }
  }

  const handleSeek = (values: number[]) => {
    const nextTime = values[0] ?? 0
    setCurrentTime(nextTime)
  }

  const commitSeek = (values: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    const nextTime = values[0] ?? 0
    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const handleVolume = (values: number[]) => {
    const nextVolume = values[0] ?? 100
    setVolume(nextVolume)
  }

  return (
    <div
      className={`rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-secondary/40 p-4 shadow-sm ${className}`}
    >
      <audio ref={audioRef} preload="metadata">
        <source src={src} />
        Your browser does not support audio playback.
      </audio>

      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Headphones className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Audiobook
          </p>
          <h3 className="truncate text-sm font-semibold text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Listen directly in the reader.
          </p>
        </div>

        <Button
          type="button"
          size="icon"
          onClick={() => void togglePlayback()}
          className="h-11 w-11 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
        </Button>
      </div>

      <div className="mt-5">
        <Slider
          value={progressValue}
          min={0}
          max={Math.max(duration, 1)}
          step={1}
          onValueChange={handleSeek}
          onValueCommit={commitSeek}
          aria-label="Audio progress"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-background/70 px-3 py-2">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <Slider
          value={volumeValue}
          min={0}
          max={100}
          step={1}
          onValueChange={handleVolume}
          aria-label="Audio volume"
        />
        <span className="w-10 text-right text-xs text-muted-foreground">
          {volume}%
        </span>
      </div>
    </div>
  )
}
