"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Play, Pause, StopCircle, Speaker } from "lucide-react"
import { toast } from "sonner"

interface TTSButtonProps {
  text: string
  lang?: string
}

export default function TTSButton({ text, lang = "en-US" }: TTSButtonProps) {
  const [supported, setSupported] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (typeof window.speechSynthesis === "undefined") return
    setSupported(true)

    const synth = window.speechSynthesis
    const loadVoices = () => {
      const v = synth.getVoices() || []
      setVoices(v)
      if (v.length && !selectedVoiceName) setSelectedVoiceName(v[0].name)
    }

    loadVoices()
    synth.onvoiceschanged = loadVoices
    return () => {
      synth.onvoiceschanged = null
    }
  }, [selectedVoiceName])

  const speak = () => {
    if (!supported) return toast.error("Speech synthesis not supported in this browser")
    if (!text || !text.trim()) return toast.error("No text available to read")

    // stop any existing speech
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.rate = rate
    const v = voices.find((v) => v.name === selectedVoiceName)
    if (v) utter.voice = v

    utter.onend = () => {
      setSpeaking(false)
      setPaused(false)
    }

    utter.onerror = () => {
      setSpeaking(false)
      setPaused(false)
      toast.error("TTS error")
    }

    utterRef.current = utter
    try {
      window.speechSynthesis.speak(utter)
      setSpeaking(true)
      setPaused(false)
    } catch (e) {
      toast.error("Failed to start speech")
    }
  }

  const togglePause = () => {
    if (!supported) return
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
        setPaused(false)
      } else if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause()
        setPaused(true)
      }
    } catch (e) {
      toast.error("TTS pause/resume failed")
    }
  }

  const stop = () => {
    if (!supported) return
    try {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      setPaused(false)
    } catch (e) {
      toast.error("TTS stop failed")
    }
  }

  // stop speech when component unmounts (e.g., dialog closed)
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel()
      } catch {
        // ignore
      }
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Speaker className="h-4 w-4" />
          TTS
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Read aloud</DialogTitle>
          <DialogDescription className="mb-4">Open the reader to control playback.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={speaking ? undefined : "outline"}
              size="sm"
              onClick={() => (speaking ? stop() : speak())}
              aria-label={speaking ? "Stop reading" : "Read aloud"}
              className="gap-2"
            >
              <Speaker className="h-4 w-4" />
              {speaking ? "Stop" : "Read"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={togglePause}
              disabled={!speaking}
              aria-label="Pause or resume"
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Speed</label>
            <input
              type="range"
              min={0.6}
              max={1.6}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="h-2 w-56"
              aria-label="Speech rate"
            />
            <div className="text-sm">{rate.toFixed(1)}x</div>
          </div>

          {voices.length > 0 && (
            <select
              value={selectedVoiceName || ""}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="rounded-md border border-border bg-card px-2 py-1 text-sm"
              aria-label="Voice selector"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} {v.lang ? `(${v.lang})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <DialogFooter>
          <div className="flex flex-1 items-center text-xs text-muted-foreground">Tip: close dialog to stop playback.</div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
