import { useState } from 'react'
import { useDMStore } from './store/useDMStore'
import TopBar from './components/TopBar'
import InitiativeSidebar from './components/InitiativeSidebar'
import CreatureCard from './components/CreatureCard'
import LibrarySidebar from './components/LibrarySidebar'
import CreatureModal from './components/CreatureModal'
import { Sword, LayoutGrid, Library } from 'lucide-react'
import clsx from 'clsx'

type MobileTab = 'initiative' | 'combat' | 'library'

const TABS: { id: MobileTab; label: string; Icon: React.ElementType }[] = [
  { id: 'initiative', label: 'Initiative', Icon: Sword },
  { id: 'combat', label: 'Combat', Icon: LayoutGrid },
  { id: 'library', label: 'Library', Icon: Library },
]

export default function App() {
  const {
    creatures,
    combat,
    showAddModal,
    editingCreatureId,
    setShowAddModal,
    setEditingCreature,
  } = useDMStore()

  const [mobileTab, setMobileTab] = useState<MobileTab>('combat')

  const displayCreatures = combat.isActive
    ? combat.initiativeOrder.map((id) => creatures[id]).filter(Boolean)
    : Object.values(creatures)

  return (
    <div className="flex flex-col bg-dnd-bg" style={{ height: '100dvh' }}>
      <TopBar />

      {/* Desktop: three columns | Mobile: single tab content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Initiative sidebar - desktop always visible, mobile only on tab */}
        <div className={clsx(
          'hidden lg:flex h-full',
          // Mobile: full width when selected tab
        )}>
          <InitiativeSidebar />
        </div>
        <div className={clsx(
          'flex lg:hidden h-full w-full',
          mobileTab === 'initiative' ? 'flex' : 'hidden'
        )}>
          <InitiativeSidebar />
        </div>

        {/* Main creature cards - desktop always visible, mobile only on combat tab */}
        <main className={clsx(
          'flex-1 overflow-y-auto p-3',
          // On mobile hide unless combat tab
          mobileTab === 'combat' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'
        )}>
          {displayCreatures.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="text-dnd-gold text-5xl mb-4">⚔</div>
              <h2 className="text-dnd-text font-bold text-xl mb-2">DM Tracker</h2>
              <p className="text-dnd-muted text-sm max-w-xs leading-relaxed">
                Add creatures from the Library tab, or tap + to create a custom creature.
                Roll initiative and start combat when ready.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
              {displayCreatures.map((creature) => (
                <CreatureCard key={creature.id} creature={creature} />
              ))}
            </div>
          )}
        </main>

        {/* Library sidebar - desktop always visible, mobile only on library tab */}
        <div className={clsx(
          'hidden lg:flex h-full',
        )}>
          <LibrarySidebar />
        </div>
        <div className={clsx(
          'flex lg:hidden h-full w-full',
          mobileTab === 'library' ? 'flex' : 'hidden'
        )}>
          <LibrarySidebar />
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden flex border-t border-dnd-border bg-dnd-surface flex-shrink-0">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = mobileTab === id
          // Badge: show creature count on combat tab, round on initiative if active
          let badge: string | null = null
          if (id === 'combat' && displayCreatures.length > 0) badge = String(displayCreatures.length)
          if (id === 'initiative' && combat.isActive) badge = `R${combat.round}`

          return (
            <button
              key={id}
              onClick={() => setMobileTab(id)}
              className={clsx(
                'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative',
                isActive ? 'text-dnd-gold' : 'text-dnd-muted'
              )}
            >
              <div className="relative">
                <Icon size={20} />
                {badge && (
                  <span className={clsx(
                    'absolute -top-1.5 -right-2.5 text-[9px] font-bold px-1 rounded-full',
                    combat.isActive && id === 'initiative'
                      ? 'bg-red-600 text-white'
                      : 'bg-dnd-gold text-dnd-bg'
                  )}>
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-dnd-gold rounded-full" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Add/Edit modal */}
      {(showAddModal || editingCreatureId) && (
        <CreatureModal
          creatureId={editingCreatureId}
          onClose={() => {
            setShowAddModal(false)
            setEditingCreature(null)
          }}
        />
      )}
    </div>
  )
}
