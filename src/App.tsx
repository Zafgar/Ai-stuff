import { useDMStore } from './store/useDMStore'
import TopBar from './components/TopBar'
import InitiativeSidebar from './components/InitiativeSidebar'
import CreatureCard from './components/CreatureCard'
import LibrarySidebar from './components/LibrarySidebar'
import CreatureModal from './components/CreatureModal'

export default function App() {
  const {
    creatures,
    combat,
    showAddModal,
    editingCreatureId,
    setShowAddModal,
    setEditingCreature,
  } = useDMStore()

  // Show creatures in initiative order if combat is active, else all creatures
  const displayCreatures = combat.isActive
    ? combat.initiativeOrder.map((id) => creatures[id]).filter(Boolean)
    : Object.values(creatures)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dnd-bg">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Initiative */}
        <InitiativeSidebar />

        {/* Center: Creature cards */}
        <main className="flex-1 overflow-y-auto p-3">
          {displayCreatures.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-dnd-gold text-4xl mb-4">⚔</div>
              <h2 className="text-dnd-text font-bold text-xl mb-2">DM Tracker</h2>
              <p className="text-dnd-muted text-sm max-w-xs">
                Add creatures from the library on the right, or create a custom creature with the + button.
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

        {/* Right: Library */}
        <LibrarySidebar />
      </div>

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
