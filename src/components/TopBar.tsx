import { useDMStore } from '../store/useDMStore'
import { RotateCcw, Trash2, Sword } from 'lucide-react'

export default function TopBar() {
  const { combat, campaign, creatures, resetCombat, fullReset } = useDMStore()

  const creatureCount = Object.keys(creatures).length

  function handleResetCombat() {
    if (confirm('Reset all combat state?')) resetCombat()
  }

  function handleFullReset() {
    if (confirm('New session? Keeps campaign PCs, removes all monsters.')) fullReset()
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-dnd-surface border-b border-dnd-border flex-shrink-0 gap-2">
      {/* Title */}
      <div className="flex items-center gap-2 min-w-0">
        <Sword size={15} className="text-dnd-gold flex-shrink-0" />
        <span className="font-bold text-dnd-gold text-sm uppercase tracking-widest truncate">
          DM Tracker
        </span>
        <span className="text-dnd-muted text-xs border-l border-dnd-border pl-2 truncate hidden sm:block">
          {campaign.name}
        </span>
      </div>

      {/* Combat status */}
      <div className="flex items-center gap-2 text-xs flex-shrink-0">
        {combat.isActive ? (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-bold hidden sm:inline">COMBAT</span>
            <span className="text-dnd-gold font-bold">R{combat.round}</span>
          </span>
        ) : (
          <span className="text-dnd-muted text-xs hidden sm:inline">
            {creatureCount} creature{creatureCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={handleResetCombat}
          title="Reset combat"
          className="flex items-center gap-1 px-2 py-1 text-xs text-dnd-muted hover:text-dnd-text bg-dnd-border rounded transition-colors"
        >
          <RotateCcw size={11} />
          <span className="hidden sm:inline">Reset</span>
        </button>
        <button
          onClick={handleFullReset}
          title="New session"
          className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-300 bg-dnd-border rounded transition-colors"
        >
          <Trash2 size={11} />
          <span className="hidden sm:inline">New Session</span>
        </button>
      </div>
    </div>
  )
}
