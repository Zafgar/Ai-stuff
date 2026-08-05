import { useState, useMemo } from 'react'
import { useDMStore } from '../store/useDMStore'
import { Creature } from '../types'
import { SRD_MONSTERS, SRD_TYPES, crSortKey, createSRDCreature } from '../data/srd-monsters'
import { Library, Plus, Trash2, Search, Users, Star, BookOpen, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

type Tab = 'srd' | 'library' | 'campaign'
type CRFilter = 'all' | 'low' | 'mid' | 'high' | 'boss'

function CreatureTypeTag({ type }: { type: Creature['type'] }) {
  return (
    <span className={clsx(
      'text-[9px] px-1 rounded text-white font-bold flex-shrink-0',
      type === 'pc' ? 'bg-blue-700' : type === 'npc' ? 'bg-yellow-700' : 'bg-red-800'
    )}>
      {type.toUpperCase()}
    </span>
  )
}

const CR_LABELS: Record<CRFilter, string> = {
  all: 'All', low: '≤1', mid: '2–5', high: '6–10', boss: '11+',
}

function matchesCR(cr: string, filter: CRFilter): boolean {
  if (filter === 'all') return true
  const n = crSortKey(cr)
  if (filter === 'low') return n <= 1
  if (filter === 'mid') return n >= 2 && n <= 5
  if (filter === 'high') return n >= 6 && n <= 10
  return n >= 11
}

function matchesType(mtype: string, typeFilter: string): boolean {
  if (typeFilter === 'all') return true
  return mtype.toLowerCase().startsWith(typeFilter.toLowerCase())
}

export default function LibrarySidebar() {
  const {
    library, creatures, campaign,
    removeFromLibrary, addFromLibrary, addToCombat,
    setShowAddModal, addCreature, addDirectToLibrary,
    combat,
  } = useDMStore()

  const [tab, setTab] = useState<Tab>('srd')
  const [search, setSearch] = useState('')
  const [crFilter, setCRFilter] = useState<CRFilter>('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showTypeMenu, setShowTypeMenu] = useState(false)

  const srdList = useMemo(() => {
    const q = search.toLowerCase()
    return SRD_MONSTERS
      .filter(m =>
        m.name.toLowerCase().includes(q) &&
        matchesCR(m.cr, crFilter) &&
        matchesType(m.mtype, typeFilter)
      )
      .sort((a, b) => crSortKey(a.cr) - crSortKey(b.cr))
  }, [search, crFilter, typeFilter])

  const libraryList = useMemo(() => {
    const q = search.toLowerCase()
    return Object.values(library).filter(c => c.name.toLowerCase().includes(q))
  }, [library, search])

  const campaignPCs = campaign.playerCharacterIds
    .map(id => creatures[id]).filter(Boolean)

  function addSRDToCombat(monster: (typeof SRD_MONSTERS)[0]) {
    const id = addCreature(createSRDCreature(monster))
    if (combat.isActive) addToCombat(id)
  }

  function spawnFromLibrary(libId: string) {
    const id = addFromLibrary(libId)
    if (id) addToCombat(id)
  }

  return (
    <div className="flex flex-col h-full bg-dnd-surface border-l border-dnd-border w-full lg:w-72 flex-shrink-0">
      <div className="p-3 border-b border-dnd-border flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-dnd-gold font-bold text-sm uppercase tracking-wider flex items-center gap-1">
            <Library size={14} />
            {tab === 'srd' ? 'SRD Monsters' : tab === 'library' ? 'My Library' : 'Campaign PCs'}
          </h2>
          <button onClick={() => setShowAddModal(true)} className="p-1 text-dnd-muted hover:text-dnd-gold transition-colors" title="Custom creature">
            <Plus size={14} />
          </button>
        </div>

        <div className="flex gap-1 mb-2">
          {([['srd','SRD',BookOpen],['library',`Mine(${Object.keys(library).length})`,Library],['campaign',`PCs(${campaignPCs.length})`,Users]] as [Tab,string,React.ElementType][]).map(([id,label,Icon]) => (
            <button key={id} onClick={() => { setTab(id); setSearch('') }}
              className={clsx('flex-1 text-[10px] py-1 rounded transition-colors flex items-center justify-center gap-0.5',
                tab === id ? 'bg-dnd-gold text-dnd-bg font-bold' : 'bg-dnd-border text-dnd-muted hover:text-dnd-text')}>
              <Icon size={9} /> {label}
            </button>
          ))}
        </div>

        {(tab === 'srd' || tab === 'library') && (
          <div className="relative mb-2">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-dnd-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full text-xs bg-dnd-border rounded pl-6 pr-2 py-1 text-dnd-text outline-none" />
          </div>
        )}

        {tab === 'srd' && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {(Object.keys(CR_LABELS) as CRFilter[]).map(f => (
                <button key={f} onClick={() => setCRFilter(f)}
                  className={clsx('flex-1 text-[9px] py-0.5 rounded transition-colors',
                    crFilter === f ? 'bg-dnd-gold text-dnd-bg font-bold' : 'bg-dnd-border text-dnd-muted hover:text-dnd-text')}>
                  {CR_LABELS[f]}
                </button>
              ))}
            </div>
            <div className="relative">
              <button onClick={() => setShowTypeMenu(v => !v)}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] bg-dnd-border text-dnd-muted rounded hover:text-dnd-text transition-colors">
                <span>{typeFilter === 'all' ? 'All Types' : typeFilter}</span>
                <ChevronDown size={10} />
              </button>
              {showTypeMenu && (
                <div className="absolute top-full left-0 right-0 z-20 bg-dnd-card border border-dnd-border rounded shadow-lg max-h-48 overflow-y-auto mt-0.5">
                  <button onClick={() => { setTypeFilter('all'); setShowTypeMenu(false) }}
                    className={clsx('w-full text-left text-[10px] px-2 py-1 hover:bg-dnd-border transition-colors', typeFilter === 'all' ? 'text-dnd-gold' : 'text-dnd-muted')}>
                    All Types
                  </button>
                  {SRD_TYPES.map(t => (
                    <button key={t} onClick={() => { setTypeFilter(t); setShowTypeMenu(false) }}
                      className={clsx('w-full text-left text-[10px] px-2 py-1 hover:bg-dnd-border transition-colors', typeFilter === t ? 'text-dnd-gold' : 'text-dnd-muted')}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-[9px] text-dnd-muted text-right">{srdList.length} monsters</div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {tab === 'srd' && (
          <>
            {srdList.length === 0 && <div className="text-center text-dnd-muted text-xs mt-8">No monsters match filters.</div>}
            {srdList.map((monster, i) => (
              <div key={`${monster.name}-${i}`} className="rounded-lg p-2 bg-dnd-card border border-dnd-border hover:border-dnd-gold/40 transition-colors">
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs font-semibold text-dnd-text truncate">{monster.name}</span>
                      <span className="text-[9px] px-1 rounded bg-red-900 text-red-200 font-bold flex-shrink-0">CR {monster.cr}</span>
                      {monster.leg && <span className="text-[9px] px-1 rounded bg-yellow-900 text-yellow-200 font-bold">★</span>}
                      {monster.sc && <span className="text-[9px] px-1 rounded bg-purple-900 text-purple-200 font-bold">SC</span>}
                    </div>
                    <div className="text-[9px] text-dnd-muted truncate">{monster.size} {monster.mtype}</div>
                    <div className="text-[9px] text-dnd-muted">HP {monster.hp} · AC {monster.ac}</div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={() => addSRDToCombat(monster)}
                      className="px-1.5 py-0.5 bg-dnd-gold text-dnd-bg rounded text-[9px] font-bold hover:bg-yellow-400 transition-colors whitespace-nowrap">
                      + Combat
                    </button>
                    <button onClick={() => addDirectToLibrary(createSRDCreature(monster))} title="Save to My Library"
                      className="px-1.5 py-0.5 bg-dnd-border text-dnd-muted rounded text-[9px] hover:text-dnd-gold transition-colors text-center">
                      ☆ Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'library' && (
          <>
            {libraryList.length === 0 && <div className="text-center text-dnd-muted text-xs mt-8 px-2">No saved monsters.<br />Save from SRD or create custom creatures.</div>}
            {libraryList.map(creature => (
              <div key={creature.id} className="rounded-lg p-2 bg-dnd-card border border-dnd-border hover:border-dnd-gold/50 transition-colors">
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs font-semibold text-dnd-text truncate">{creature.name}</span>
                      <CreatureTypeTag type={creature.type} />
                      {creature.cr && <span className="text-[9px] text-dnd-muted">CR {creature.cr}</span>}
                    </div>
                    {creature.monsterType && <div className="text-[9px] text-dnd-muted truncate">{creature.creatureSize} {creature.monsterType}</div>}
                    <div className="text-[9px] text-dnd-muted">HP {creature.maxHP} · AC {creature.ac}</div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={() => spawnFromLibrary(creature.id)}
                      className="px-1.5 py-0.5 bg-dnd-gold text-dnd-bg rounded text-[9px] font-bold hover:bg-yellow-400 transition-colors">
                      + Add
                    </button>
                    <button onClick={() => removeFromLibrary(creature.id)} className="p-0.5 text-dnd-muted hover:text-red-400 transition-colors self-end">
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
            {campaignPCs.length === 0 && <div className="text-center text-dnd-muted text-xs mt-8 px-2">No saved PCs yet.<br />Add a creature and click ★ to save to campaign.</div>}
            {campaignPCs.map(pc => (
              <div key={pc.id} className="rounded-lg p-2 bg-dnd-card border border-blue-800 hover:border-blue-600 transition-colors">
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-dnd-gold flex-shrink-0" />
                      <span className="text-xs font-semibold text-dnd-text truncate">{pc.name}</span>
                    </div>
                    <div className="text-[9px] text-dnd-muted">HP {pc.currentHP}/{pc.maxHP} · AC {pc.ac}{pc.isSpellcaster && ` · DC ${pc.spellDC}`}</div>
                    <div className="text-[9px] text-dnd-muted">PP {10 + Math.floor((pc.wis - 10) / 2) + pc.proficiencyBonus}</div>
                  </div>
                  <button onClick={() => addToCombat(pc.id)}
                    className="px-1.5 py-0.5 bg-blue-800 text-blue-200 rounded text-[9px] font-bold hover:bg-blue-700 transition-colors flex-shrink-0">
                    + Combat
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="p-2 border-t border-dnd-border flex-shrink-0">
        <button onClick={() => setShowAddModal(true)}
          className="w-full text-xs py-1.5 bg-dnd-border text-dnd-text rounded hover:bg-dnd-card transition-colors flex items-center justify-center gap-1">
          <Plus size={11} /> Custom Creature
        </button>
      </div>
    </div>
  )
}
