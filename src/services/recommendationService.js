
const KEY_EVENTS = 'reels_user_events_v1'

function loadEvents() {
  try { return JSON.parse(localStorage.getItem(KEY_EVENTS) || '[]') } catch { return [] }
}
function saveEvents(events) { localStorage.setItem(KEY_EVENTS, JSON.stringify(events)) }

export const recommendationService = {
  log: (type, { reelId }) => {
    const events = loadEvents()
    events.push({ type, reelId, ts: Date.now() })
    saveEvents(events)
  },

  scoreReels: (reels) => {
    const events = loadEvents()
    const counts = {}
    events.forEach(e => {
      counts[e.reelId] = counts[e.reelId] || { views: 0, likes: 0, completes: 0 }
      if (e.type === 'impression') counts[e.reelId].views++
      if (e.type === 'like') counts[e.reelId].likes++
      if (e.type === 'watchComplete') counts[e.reelId].completes++
    })

    const now = Date.now()
    // scoring: 5 * completes + 2 * likes + 1 * views - recency penalty
    return reels.map(r => {
      const c = counts[r.id] || { views: 0, likes: 0, completes: 0 }
      const ageHours = Math.max((now - (r.createdAt?.seconds ? r.createdAt.seconds*1000 : (r.createdAt || 0))) / (1000*60*60), 0)
      const recencyFactor = Math.exp(-ageHours/24) // recent better
      const score = (5*c.completes + 2*c.likes + 1*c.views) * recencyFactor
      return { ...r, score }
    }).sort((a,b) => b.score - a.score)
  }
}
