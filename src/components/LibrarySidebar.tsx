import { useState } from 'react'
import { useDMStore } from '../store/useDMStore'
import { Creature } from '../types'
import { Library, Plus, Trash2, Search, Users, Star } from 'lucide-react'
import clsx from 'clsx'

function CreatureTypeTag({ type }: { type: Creature['type'] }) {
  return (
    <span className={clsx(
      'text-[9px] px-1 rounded text-white font-bold',
      type === 'pc' ? 'bg-blue-700' : type === 'npc' ? 'bg-yellow-700' : 'bg-red-800'
    )}>
      {type.toUpperCase()}
    </span>
  )
}

export default function LibrarySidebar() {
  const {
    library,
    creatures,
    campaign,
    removeFromLibrary,
    addFromLibrary,
    addToCombat,
    setShowAddModal,
    removeCreature,
    addCreature,
  } = useDMStore()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'library' | 'campaign'>('library')

  const libraryList = Object.values(library).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const campaignPCs = campaign.playerCharacterIds
    .map((id) => creatures[id])
    .filter(Boolean)

  function spawnFromLibrary(libId: string) {
    const id = addFromLibrary(libId)
    if (id) addToCombat(id)
  }

  return (
    <div className="flex flex-col h-full bg-dnd-surface border-l border-dnd-border w-64 flex-shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-dnd-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-dnd-gold font-bold text-sm uppercase tracking-wider flex items-center gap-1">
            <Library size={14} />
            {tab === 'library' ? 'Monster Library' : 'Campaign PCs'}
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-1 text-dnd-muted hover:text-dnd-gold transition-colors"
            title="Add custom creature"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setTab('library')}
            className={clsx(
              'flex-1 text-[11px] py-1 rounded transition-colors flex items-center justify-center gap-1',
              tab === 'library'
                ? 'bg-dnd-gold text-dnd-bg font-bold'
                : 'bg-dnd-border text-dnd-muted hover:text-dnd-text'
            )}
          >
            <Library size={10} /> Library
          </button>
          <button
            onClick={() => setTab('campaign')}
            className={clsx(
              'flex-1 text-[11px] py-1 rounded transition-colors flex items-center justify-center gap-1',
              tab === 'campaign'
                ? 'bg-dnd-gold text-dnd-bg font-bold'
                : 'bg-dnd-border text-dnd-muted hover:text-dnd-text'
            )}
          >
            <Users size={10} /> PCs ({campaignPCs.length})
          </button>
        </div>

        {tab === 'library' && (
          <div className="relative">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-dnd-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full text-xs bg-dnd-border rounded pl-6 pr-2 py-1 text-dnd-text outline-none"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {tab === 'library' && (
          <>
            {libraryList.length === 0 && (
              <div className="text-center text-dnd-muted text-xs mt-8">
                No monsters found.<br />Add custom creatures with +.
              </div>
            )}
            {libraryList.map((creature) => (
              <div
                key={creature.id}
                className="rounded-lg p-2 bg-dnd-card border border-dnd-border hover:border-dnd-gold/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs font-semibold text-dnd-text truncate">{creature.name}</span>
                      <CreatureTypeTag type={creature.type} />
                      {creature.cr && (
                        <span className="text-[9px] text-dnd-muted">CR {creature.cr}</span>
                      )}
                    </div>
                    {creature.monsterType && (
                      <div className="text-[9px] text-dnd-muted truncate">
                        {creature.creatureSize} {creature.monsterType}
                      </div>
                    )}
                    <div className="text-[10px] text-dnd-muted">
                      HP {creature.maxHP} · AC {creature.ac}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                      onClick={() => spawnFromLibrary(creature.id)}
                      title="Add to combat"
                      className="px-1.5 py-0.5 bg-dnd-gold text-dnd-bg rounded text-[10px] font-bold hover:bg-dnd-gold-light transition-colors"
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => removeFromLibrary(creature.id)}
                      title="Remove from library"
                      className="p-0.5 text-dnd-muted hover:text-red-400 transition-colors self-end"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'campaign' && (
          <>
            {campaignPCs.length === 0 && (
              <div className="text-center text-dnd-muted text-xs mt-8 px-2">
                No saved PCs yet.<br />Add a creature and click ★ to save to campaign.
              </div>
            )}
            {campaignPCs.map((pc) => (
              <div
                key={pc.id}
                className="rounded-lg p-2 bg-dnd-card border border-blue-800 hover:border-blue-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-dnd-gold flex-shrink-0" />
                      <span className="text-xs font-semibold text-dnd-text truncate">{pc.name}</span>
                    </div>
                    <div className="text-[10px] text-dnd-muted">
                      HP {pc.currentHP}/{pc.maxHP} · AC {pc.ac}
                      {pc.isSpellcaster && ` · DC ${pc.spellDC}`}
                    </div>
                    <div className="text-[10px] text-dnd-muted">
                      PP {10 + Math.floor((pc.wis - 10) / 2) + pc.proficiencyBonus}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCombat(pc.id)}
                    title="Add to current combat"
                    className="px-1.5 py-0.5 bg-blue-800 text-blue-200 rounded text-[10px] font-bold hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    + Combat
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-dnd-border">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full text-xs py-1.5 bg-dnd-border text-dnd-text rounded hover:bg-dnd-card transition-colors flex items-center justify-center gap-1"
        >
          <Plus size={11} /> Custom Creature
        </button>
      </div>
    </div>
  )
}
