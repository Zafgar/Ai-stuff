import { useDMStore } from '../store/useDMStore'
import { RotateCcw, Trash2, Sword, Save } from 'lucide-react'

export default function TopBar() {
  const {
    combat,
    campaign,
    creatures,
    resetCombat,
    fullReset,
  } = useDMStore()

  const creatureCount = Object.keys(creatures).length
  const activeCount = combat.initiativeOrder.length
  const pcCount = campaign.playerCharacterIds.length

  function handleResetCombat() {
    if (confirm('Reset all combat state? (HP, conditions, actions, spell slots remain for PCs)')) {
      resetCombat()
    }
  }

  function handleFullReset() {
    if (confirm('Full reset? Keeps campaign PCs but removes all monsters and resets HP.')) {
      fullReset()
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-dnd-surface border-b border-dnd-border flex-shrink-0">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Sword size={16} className="text-dnd-gold" />
          <span className="font-bold text-dnd-gold text-sm uppercase tracking-widest font-serif">
            DM Tracker
          </span>
        </div>
        <span className="text-dnd-muted text-xs border-l border-dnd-border pl-3">
          {campaign.name}
        </span>
      </div>

      {/* Center: Combat status */}
      <div className="flex items-center gap-4 text-xs text-dnd-muted">
        {combat.isActive ? (
          <>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-bold">COMBAT ACTIVE</span>
            </span>
            <span>Round <span className="text-dnd-gold font-bold">{combat.round}</span></span>
            <span>{activeCount} in initiative</span>
          </>
        ) : (
          <span className="text-dnd-muted">
            {creatureCount} creature{creatureCount !== 1 ? 's' : ''} ·
            {pcCount} PC{pcCount !== 1 ? 's' : ''} saved
          </span>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleResetCombat}
          title="Reset combat (keeps creatures)"
          className="flex items-center gap-1 px-2 py-1 text-xs text-dnd-muted hover:text-dnd-text bg-dnd-border rounded transition-colors"
        >
          <RotateCcw size={11} /> Reset Combat
        </button>
        <button
          onClick={handleFullReset}
          title="Full reset (keeps campaign PCs)"
          className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-300 bg-dnd-border rounded transition-colors"
        >
          <Trash2 size={11} /> New Session
        </button>
      </div>
    </div>
  )
}
