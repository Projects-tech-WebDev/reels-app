// src/components/Reel.jsx
import React, { useRef, useState, useEffect } from 'react'
import useInViewPlay from '../hooks/useInViewPlay'
import { reelsService } from '../services/reelsService'
import { recommendationService } from '../services/recommendationService'

export default function Reel({ reel: initialReel, onOpenComments }) {
  const videoRef = useRef(null)
  const [reel, setReel] = useState(initialReel)
  useInViewPlay(videoRef)

  // keep this reel updated realtime
  useEffect(() => {
    const unsub = reelsService.listenReel(initialReel.id, (r) => setReel(r))
    return () => unsub()
  }, [initialReel.id])

  async function handleLike() {
    // optimistic update
    setReel(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }))
    try {
      await reelsService.like(initialReel.id)
    } catch (e) {
      // rollback on error
      setReel(prev => ({ ...prev, likes: Math.max((prev.likes || 1)-1, 0) }))
      console.error('like failed', e)
    }
  }
// In src/components/Reel.jsx (add analytics import)
import { analyticsService } from '../services/analyticsService'

// inside useEffect or on play events:
useEffect(() => {
  // when video starts playing
  const v = videoRef.current
  if (!v) return
  const onPlay = () => analyticsService.logEvent('impression', { reelId: initialReel.id })
  const onEnded = () => analyticsService.logEvent('watchComplete', { reelId: initialReel.id })
  v.addEventListener('play', onPlay)
  v.addEventListener('ended', onEnded)
  return () => {
    v.removeEventListener('play', onPlay)
    v.removeEventListener('ended', onEnded)
  }
}, [initialReel.id])

  return (
    <div className="h-screen flex items-end justify-start p-4 box-border relative">
      <video
        ref={videoRef}
        src={reel.src}
        loop
        playsInline
        className="w-full h-full object-cover rounded-xl shadow-lg"
        muted
      />
      <div className="absolute right-4 bottom-12 flex flex-col items-center gap-4">
        <button onClick={handleLike} className="text-center">
          <div className="text-white">❤</div>
          <div className="text-xs">{reel.likes || 0}</div>
        </button>
        <button onClick={() => onOpenComments(reel)}>
          💬
          <div className="text-xs">{reel.commentsCount || 0}</div>
        </button>
      </div>
      <div className="absolute left-4 bottom-6">
        <div className="font-semibold">@{reel.user}</div>
        <div className="text-sm opacity-90">{reel.caption}</div>
      </div>
    </div>
  )
}
useEffect(() => {
  const v = videoRef.current
  if (!v) return
  const onPlay = () => recommendationService.log('impression', { reelId: initialReel.id })
  const onEnded = () => recommendationService.log('watchComplete', { reelId: initialReel.id })
  v.addEventListener('play', onPlay)
  v.addEventListener('ended', onEnded)
  return () => {
    v.removeEventListener('play', onPlay)
    v.removeEventListener('ended', onEnded)
  }
}, [initialReel.id])
