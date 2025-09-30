
import React, { useEffect, useState } from 'react'
import Reel from './Reel'
import { reelsService } from '../services/reelsService'
import { recommendationService } from '../services/recommendationService'

export default function ReelList({ onOpenComments, feedMode = 'recommended' }) {
  const [reels, setReels] = useState([])

  useEffect(() => {
    let unsub = reelsService.listenFeed((data) => {
      if (feedMode === 'recommended') {
        const ranked = recommendationService.scoreReels(data)
        setReels(ranked)
      } else {
        setReels(data)
      }
    })
    return () => unsub && unsub()
  }, [feedMode])

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-auto">
      {reels.map(r => (
        <div key={r.id} className="snap-start h-screen">
          <Reel reel={r} onOpenComments={onOpenComments}/>
        </div>
      ))}
    </div>
  )
}
