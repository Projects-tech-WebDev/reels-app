
import React, { useEffect, useState } from 'react'
import ReelList from '../components/ReelList'
import { recommendationService } from '../services/recommendationService'

export default function Home(){
  const [mode, setMode] = useState('recommended') // recommended | chronological

  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-3 flex gap-2 justify-center">
        <button onClick={() => setMode('recommended')} className={`px-3 py-1 rounded ${mode==='recommended'?'bg-white text-black':''}`}>Recommended</button>
        <button onClick={() => setMode('chronological')} className={`px-3 py-1 rounded ${mode==='chronological'?'bg-white text-black':''}`}>Chronological</button>
      </div>
      <ReelList feedMode={mode}/>
    </div>
  )
}
