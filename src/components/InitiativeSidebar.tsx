import { useDMStore, abilityMod } from '../store/useDMStore'
import { Creature } from '../types'
import { Sword, SkipForward, SkipBack, Play, Square, Shuffle, Plus } from 'lucide-react'
import clsx from 'clsx'

function hpColor(creature: Creature): string {
  const pct = creature.currentHP / creature.maxHP
  if (pct > 0.5) return 'hp-bar-green'
  if (pct > 0.25) return 'hp-bar-yellow'
  return 'hp-bar-red'
}

function typeColor(type: Creature['type']): string {
  switch (type) {
    case 'pc': return 'bg-blue-500'
    case 'npc': return 'bg-yellow-500'
    case 'monster': return 'bg-red-500'
  }
}

export default function InitiativeSidebar() {
  const {
    creatures,
    combat,
    campaign,
    startCombat,
    endCombat,
    nextTurn,
    prevTurn,
    setSelectedCreature,
    selectedCreatureId,
    rollInitiativeAll,
    setShowAddModal,
    setInitiative,
  } = useDMStore()

  const orderedCreatures = combat.initiativeOrder
    .map((id) => creatures[id])
    .filter(Boolean)

  // Outside combat: show all creatures sorted by initiative
  const allCreatures = Object.values(creatures).sort(
    (a, b) => b.initiative - a.initiative
  )

  const displayList = combat.isActive ? orderedCreatures : allCreatures

  return (
    <div className="flex flex-col h-full bg-dnd-surface border-r border-dnd-border w-64 flex-shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-dnd-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-dnd-gold font-bold text-sm uppercase tracking-wider flex items-center gap-1">
            <Sword size={14} />
            Initiative
          </h2>
          {combat.isActive && (
            <span className="text-xs bg-dnd-red text-white px-2 py-0.5 rounded font-bold">
              Round {combat.round}
            </span>
          )}
        </div>

        {/* Combat controls */}
        <div className="flex gap-1 flex-wrap">
          {!combat.isActive ? (
            <>
              <button
                onClick={rollInitiativeAll}
                title="Roll initiative for all"
                className="flex items-center gap-1 px-2 py-1 bg-dnd-gold text-dnd-bg rounded text-xs font-bold hover:bg-dnd-gold-light transition-colors"
              >
                <Shuffle size={11} /> Roll All
              </button>
              <button
                onClick={startCombat}
                disabled={allCreatures.length === 0}
                title="Start combat"
                className="flex items-center gap-1 px-2 py-1 bg-green-700 text-white rounded text-xs font-bold hover:bg-green-600 transition-colors disabled:opacity-40"
              >
                <Play size={11} /> Start
              </button>
            </>
          ) : (
            <>
              <button
                onClick={prevTurn}
                title="Previous turn"
                className="p-1.5 bg-dnd-border rounded hover:bg-dnd-card transition-colors"
              >
                <SkipBack size={13} />
              </button>
              <button
                onClick={nextTurn}
                title="Next turn"
                className="flex items-center gap-1 px-2 py-1 bg-dnd-gold text-dnd-bg rounded text-xs font-bold hover:bg-dnd-gold-light transition-colors flex-1 justify-center"
              >
                <SkipForward size={11} /> Next
              </button>
              <button
                onClick={endCombat}
                title="End combat"
                className="p-1.5 bg-red-900 text-red-300 rounded hover:bg-red-800 transition-colors"
              >
                <Square size={13} />
              </button>
            </>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            title="Add creature"
            className="p-1.5 bg-dnd-border rounded hover:bg-dnd-card transition-colors"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Initiative list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {displayList.length === 0 && (
          <div className="text-center text-dnd-muted text-xs mt-8 px-2">
            No creatures yet.<br />Add creatures or load from library.
          </div>
        )}
        {displayList.map((creature, idx) => {
          const isCurrentTurn = combat.currentTurnId === creature.id
          const isSelected = selectedCreatureId === creature.id
          const isPC = campaign.playerCharacterIds.includes(creature.id)
          const hpPct = Math.max(0, creature.currentHP / creature.maxHP) * 100
          const isDead = creature.currentHP <= 0

          return (
            <div
              key={creature.id}
              onClick={() => setSelectedCreature(isSelected ? null : creature.id)}
              className={clsx(
                'rounded-lg p-2 cursor-pointer transition-all select-none border',
                isCurrentTurn
                  ? 'border-dnd-gold bg-dnd-card shadow-lg shadow-yellow-900/20'
                  : isSelected
                  ? 'border-dnd-blue bg-dnd-card'
                  : 'border-transparent hover:border-dnd-border hover:bg-dnd-card',
                isDead && 'opacity-60'
              )}
            >
              <div className="flex items-center gap-2">
                {/* Initiative number */}
                <div className="flex flex-col items-center w-8 flex-shrink-0">
                  <input
                    type="number"
                    value={creature.initiative}
                    onChange={(e) => {
                      e.stopPropagation()
                      setInitiative(creature.id, parseInt(e.target.value) || 0)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={clsx(
                      'w-8 text-center text-sm font-bold bg-transparent border-b outline-none',
                      isCurrentTurn ? 'text-dnd-gold border-dnd-gold' : 'text-dnd-text border-dnd-border'
                    )}
                  />
                </div>

                {/* Name & type */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    {isCurrentTurn && (
                      <span className="text-dnd-gold">▶</span>
                    )}
                    <span className={clsx(
                      'text-xs font-semibold truncate',
                      isCurrentTurn ? 'text-dnd-gold' : 'text-dnd-text'
                    )}>
                      {creature.name}
                    </span>
                  </div>

                  {/* HP bar */}
                  <div className="mt-1 h-1.5 bg-dnd-border rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full transition-all', hpColor(creature))}
                      style={{ width: `${hpPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[10px] text-dnd-muted">
                      {creature.currentHP}/{creature.maxHP}
                      {creature.tempHP > 0 && (
                        <span className="text-blue-400 ml-1">+{creature.tempHP}</span>
                      )}
                    </span>
                    <span className={clsx(
                      'text-[10px] px-1 rounded',
                      typeColor(creature.type),
                      'text-white'
                    )}>
                      {creature.type === 'pc' ? 'PC' : creature.type === 'npc' ? 'NPC' : 'MON'}
                    </span>
                  </div>
                </div>

                {/* AC badge */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-[10px] text-dnd-muted">AC</div>
                  <div className="text-xs font-bold text-dnd-text">{creature.ac}</div>
                </div>
              </div>

              {/* Conditions strip */}
              {creature.conditions.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {creature.conditions.slice(0, 3).map((cond) => (
                    <span
                      key={cond}
                      className="text-[9px] bg-dnd-border px-1 rounded text-dnd-muted"
                    >
                      {cond.replace('Exhaustion ', 'Exh.')}
                    </span>
                  ))}
                  {creature.conditions.length > 3 && (
                    <span className="text-[9px] text-dnd-muted">+{creature.conditions.length - 3}</span>
                  )}
                </div>
              )}

              {/* Action indicators */}
              <div className="mt-1 flex gap-1">
                <span className={clsx('text-[9px] px-1 rounded', creature.actionUsed ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300')}>A</span>
                <span className={clsx('text-[9px] px-1 rounded', creature.bonusActionUsed ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300')}>B</span>
                <span className={clsx('text-[9px] px-1 rounded', creature.reactionUsed ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300')}>R</span>
                {creature.concentrating && (
                  <span className="text-[9px] px-1 rounded bg-purple-900 text-purple-300">CON</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
