import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Creature, CombatState, Campaign, Condition, ActiveEffect, AbilityKey } from '../types'
import { createEmptyCreature, SAMPLE_MONSTERS } from '../data/defaults'

interface DMStore {
  creatures: Record<string, Creature>
  library: Record<string, Creature>
  combat: CombatState
  campaign: Campaign
  selectedCreatureId: string | null
  showAddModal: boolean
  editingCreatureId: string | null

  // Creature management
  addCreature: (creature: Partial<Creature>) => string
  updateCreature: (id: string, updates: Partial<Creature>) => void
  removeCreature: (id: string) => void
  saveToLibrary: (id: string) => void
  removeFromLibrary: (libraryId: string) => void
  addFromLibrary: (libraryId: string) => string
  addDirectToLibrary: (partial: Partial<Creature>) => void
  saveToCampaign: (id: string) => void
  removeFromCampaign: (id: string) => void

  // HP management
  applyDamage: (id: string, amount: number) => void
  applyHealing: (id: string, amount: number) => void
  setTempHP: (id: string, amount: number) => void

  // Spell slots
  useSpellSlot: (id: string, level: number) => void
  restoreSpellSlot: (id: string, level: number) => void
  restoreAllSpellSlots: (id: string) => void

  // Actions
  toggleAction: (id: string) => void
  toggleBonusAction: (id: string) => void
  toggleReaction: (id: string) => void
  resetTurnActions: (id: string) => void

  // Conditions
  addCondition: (id: string, condition: Condition) => void
  removeCondition: (id: string, condition: Condition) => void

  // Effects
  addEffect: (id: string, effect: Omit<ActiveEffect, 'id'>) => void
  removeEffect: (id: string, effectId: string) => void

  // Death saves
  addDeathSaveSuccess: (id: string) => void
  addDeathSaveFailure: (id: string) => void
  resetDeathSaves: (id: string) => void

  // Concentration
  setConcentration: (id: string, spell: string) => void
  breakConcentration: (id: string) => void

  // Legendary actions
  useLegendaryAction: (id: string) => void
  resetLegendaryActions: (id: string) => void

  // Combat management
  startCombat: () => void
  endCombat: () => void
  nextTurn: () => void
  prevTurn: () => void
  setInitiative: (id: string, value: number) => void
  rollInitiativeAll: () => void
  addToCombat: (id: string) => void
  removeFromCombat: (id: string) => void
  sortByInitiative: () => void

  // UI
  setSelectedCreature: (id: string | null) => void
  setShowAddModal: (show: boolean) => void
  setEditingCreature: (id: string | null) => void

  // Session reset
  resetCombat: () => void
  fullReset: () => void
}

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1
}

function getAbilityMod(score: number): number {
  return Math.floor((score - 10) / 2)
}

const DEFAULT_COMBAT: CombatState = {
  isActive: false,
  round: 1,
  currentTurnId: null,
  initiativeOrder: [],
}

const DEFAULT_CAMPAIGN: Campaign = {
  name: 'My Campaign',
  playerCharacterIds: [],
}

// Build initial library from sample monsters
function buildInitialLibrary(): Record<string, Creature> {
  const lib: Record<string, Creature> = {}
  for (const monster of SAMPLE_MONSTERS) {
    const c = createEmptyCreature({ ...monster })
    lib[c.id] = c
  }
  return lib
}

export const useDMStore = create<DMStore>()(
  persist(
    (set, get) => ({
      creatures: {},
      library: buildInitialLibrary(),
      combat: DEFAULT_COMBAT,
      campaign: DEFAULT_CAMPAIGN,
      selectedCreatureId: null,
      showAddModal: false,
      editingCreatureId: null,

      addCreature: (data) => {
        const creature = createEmptyCreature(data)
        set((s) => ({ creatures: { ...s.creatures, [creature.id]: creature } }))
        return creature.id
      },

      updateCreature: (id, updates) => {
        set((s) => ({
          creatures: {
            ...s.creatures,
            [id]: { ...s.creatures[id], ...updates },
          },
        }))
      },

      removeCreature: (id) => {
        set((s) => {
          const creatures = { ...s.creatures }
          delete creatures[id]
          const order = s.combat.initiativeOrder.filter((i) => i !== id)
          const currentTurnId =
            s.combat.currentTurnId === id ? (order[0] ?? null) : s.combat.currentTurnId
          return {
            creatures,
            combat: { ...s.combat, initiativeOrder: order, currentTurnId },
            selectedCreatureId: s.selectedCreatureId === id ? null : s.selectedCreatureId,
          }
        })
      },

      saveToLibrary: (id) => {
        const creature = get().creatures[id]
        if (!creature) return
        const libEntry = { ...createEmptyCreature({ ...creature }), type: creature.type }
        set((s) => ({ library: { ...s.library, [libEntry.id]: libEntry } }))
      },

      addDirectToLibrary: (partial) => {
        const entry = createEmptyCreature(partial)
        set((s) => ({ library: { ...s.library, [entry.id]: entry } }))
      },

      removeFromLibrary: (libraryId) => {
        set((s) => {
          const library = { ...s.library }
          delete library[libraryId]
          return { library }
        })
      },

      addFromLibrary: (libraryId) => {
        const template = get().library[libraryId]
        if (!template) return ''
        const creature = createEmptyCreature({
          ...template,
          currentHP: template.maxHP,
          actionUsed: false,
          bonusActionUsed: false,
          reactionUsed: false,
          conditions: [],
          effects: [],
          deathSaves: { successes: 0, failures: 0 },
          concentrating: false,
          concentrationSpell: '',
          legendaryActionsUsed: 0,
        })
        set((s) => ({ creatures: { ...s.creatures, [creature.id]: creature } }))
        return creature.id
      },

      saveToCampaign: (id) => {
        const creature = get().creatures[id]
        if (!creature) return
        set((s) => ({
          campaign: {
            ...s.campaign,
            playerCharacterIds: s.campaign.playerCharacterIds.includes(id)
              ? s.campaign.playerCharacterIds
              : [...s.campaign.playerCharacterIds, id],
          },
          creatures: {
            ...s.creatures,
            [id]: { ...creature, type: 'pc' },
          },
        }))
      },

      removeFromCampaign: (id) => {
        set((s) => ({
          campaign: {
            ...s.campaign,
            playerCharacterIds: s.campaign.playerCharacterIds.filter((i) => i !== id),
          },
        }))
      },

      applyDamage: (id, amount) => {
        const c = get().creatures[id]
        if (!c) return
        let remaining = amount
        let tempHP = c.tempHP
        // Damage hits temp HP first
        if (tempHP > 0) {
          const absorbed = Math.min(tempHP, remaining)
          tempHP -= absorbed
          remaining -= absorbed
        }
        const currentHP = Math.max(0, c.currentHP - remaining)
        get().updateCreature(id, { currentHP, tempHP })
        // Auto unconscious if PC drops to 0
        if (currentHP === 0 && c.type === 'pc') {
          const conditions = c.conditions.includes('Unconscious')
            ? c.conditions
            : [...c.conditions, 'Unconscious' as Condition]
          get().updateCreature(id, { conditions })
        }
      },

      applyHealing: (id, amount) => {
        const c = get().creatures[id]
        if (!c) return
        const currentHP = Math.min(c.maxHP, c.currentHP + amount)
        const conditions = c.conditions.filter((cond) => cond !== 'Unconscious')
        get().updateCreature(id, { currentHP, conditions })
      },

      setTempHP: (id, amount) => {
        get().updateCreature(id, { tempHP: Math.max(0, amount) })
      },

      useSpellSlot: (id, level) => {
        const c = get().creatures[id]
        if (!c) return
        const slot = c.spellSlots[level]
        if (!slot || slot.used >= slot.max) return
        get().updateCreature(id, {
          spellSlots: { ...c.spellSlots, [level]: { ...slot, used: slot.used + 1 } },
        })
      },

      restoreSpellSlot: (id, level) => {
        const c = get().creatures[id]
        if (!c) return
        const slot = c.spellSlots[level]
        if (!slot || slot.used <= 0) return
        get().updateCreature(id, {
          spellSlots: { ...c.spellSlots, [level]: { ...slot, used: slot.used - 1 } },
        })
      },

      restoreAllSpellSlots: (id) => {
        const c = get().creatures[id]
        if (!c) return
        const spellSlots = { ...c.spellSlots }
        for (const level in spellSlots) {
          spellSlots[level] = { ...spellSlots[level], used: 0 }
        }
        get().updateCreature(id, { spellSlots })
      },

      toggleAction: (id) => {
        const c = get().creatures[id]
        if (!c) return
        get().updateCreature(id, { actionUsed: !c.actionUsed })
      },

      toggleBonusAction: (id) => {
        const c = get().creatures[id]
        if (!c) return
        get().updateCreature(id, { bonusActionUsed: !c.bonusActionUsed })
      },

      toggleReaction: (id) => {
        const c = get().creatures[id]
        if (!c) return
        get().updateCreature(id, { reactionUsed: !c.reactionUsed })
      },

      resetTurnActions: (id) => {
        get().updateCreature(id, {
          actionUsed: false,
          bonusActionUsed: false,
          movementUsed: 0,
        })
      },

      addCondition: (id, condition) => {
        const c = get().creatures[id]
        if (!c || c.conditions.includes(condition)) return
        get().updateCreature(id, { conditions: [...c.conditions, condition] })
      },

      removeCondition: (id, condition) => {
        const c = get().creatures[id]
        if (!c) return
        get().updateCreature(id, { conditions: c.conditions.filter((cond) => cond !== condition) })
      },

      addEffect: (id, effect) => {
        const c = get().creatures[id]
        if (!c) return
        const newEffect: ActiveEffect = { ...effect, id: crypto.randomUUID() }
        get().updateCreature(id, { effects: [...c.effects, newEffect] })
      },

      removeEffect: (id, effectId) => {
        const c = get().creatures[id]
        if (!c) return
        get().updateCreature(id, { effects: c.effects.filter((e) => e.id !== effectId) })
      },

      addDeathSaveSuccess: (id) => {
        const c = get().creatures[id]
        if (!c) return
        const successes = Math.min(3, c.deathSaves.successes + 1)
        if (successes >= 3) {
          // Stabilized
          get().updateCreature(id, {
            deathSaves: { successes: 3, failures: c.deathSaves.failures },
            currentHP: 1,
            conditions: c.conditions.filter((cond) => cond !== 'Unconscious'),
          })
        } else {
          get().updateCreature(id, { deathSaves: { ...c.deathSaves, successes } })
        }
      },

      addDeathSaveFailure: (id) => {
        const c = get().creatures[id]
        if (!c) return
        const failures = Math.min(3, c.deathSaves.failures + 1)
        get().updateCreature(id, { deathSaves: { ...c.deathSaves, failures } })
      },

      resetDeathSaves: (id) => {
        get().updateCreature(id, { deathSaves: { successes: 0, failures: 0 } })
      },

      setConcentration: (id, spell) => {
        get().updateCreature(id, { concentrating: true, concentrationSpell: spell })
      },

      breakConcentration: (id) => {
        get().updateCreature(id, { concentrating: false, concentrationSpell: '' })
      },

      useLegendaryAction: (id) => {
        const c = get().creatures[id]
        if (!c || c.legendaryActionsUsed >= c.legendaryActionsMax) return
        get().updateCreature(id, { legendaryActionsUsed: c.legendaryActionsUsed + 1 })
      },

      resetLegendaryActions: (id) => {
        get().updateCreature(id, { legendaryActionsUsed: 0 })
      },

      startCombat: () => {
        const { creatures } = get()
        const ids = Object.keys(creatures)
        if (ids.length === 0) return
        // Sort by initiative descending
        const sorted = [...ids].sort(
          (a, b) => creatures[b].initiative - creatures[a].initiative
        )
        set((s) => ({
          combat: {
            isActive: true,
            round: 1,
            currentTurnId: sorted[0],
            initiativeOrder: sorted,
          },
        }))
      },

      endCombat: () => {
        set({ combat: DEFAULT_COMBAT })
      },

      nextTurn: () => {
        const { combat, creatures } = get()
        if (!combat.isActive) return
        const order = combat.initiativeOrder
        if (order.length === 0) return

        const idx = order.indexOf(combat.currentTurnId ?? '')
        const nextIdx = (idx + 1) % order.length
        const newRound = nextIdx === 0 ? combat.round + 1 : combat.round
        const nextId = order[nextIdx]

        // Reset actions for next creature
        get().resetTurnActions(nextId)

        // Tick down effect durations for the creature whose turn is ending
        const endingCreature = combat.currentTurnId ? creatures[combat.currentTurnId] : null
        if (endingCreature) {
          const updatedEffects = endingCreature.effects
            .map((e) => (e.duration > 0 ? { ...e, roundsRemaining: e.roundsRemaining - 1 } : e))
            .filter((e) => e.roundsRemaining > 0 || e.duration <= 0)
          get().updateCreature(combat.currentTurnId!, { effects: updatedEffects })
        }

        set((s) => ({
          combat: { ...s.combat, round: newRound, currentTurnId: nextId },
        }))
      },

      prevTurn: () => {
        const { combat } = get()
        if (!combat.isActive) return
        const order = combat.initiativeOrder
        if (order.length === 0) return
        const idx = order.indexOf(combat.currentTurnId ?? '')
        const prevIdx = (idx - 1 + order.length) % order.length
        const newRound =
          prevIdx === order.length - 1 && combat.round > 1
            ? combat.round - 1
            : combat.round
        set((s) => ({
          combat: { ...s.combat, round: newRound, currentTurnId: order[prevIdx] },
        }))
      },

      setInitiative: (id, value) => {
        get().updateCreature(id, { initiative: value })
        get().sortByInitiative()
      },

      rollInitiativeAll: () => {
        const { creatures } = get()
        for (const id of Object.keys(creatures)) {
          const c = creatures[id]
          const roll = rollD20() + getAbilityMod(c.dex) + c.initiativeBonus
          get().updateCreature(id, { initiative: roll })
        }
        get().sortByInitiative()
      },

      addToCombat: (id) => {
        set((s) => {
          if (s.combat.initiativeOrder.includes(id)) return s
          const order = [...s.combat.initiativeOrder, id].sort(
            (a, b) => (s.creatures[b]?.initiative ?? 0) - (s.creatures[a]?.initiative ?? 0)
          )
          return { combat: { ...s.combat, initiativeOrder: order } }
        })
      },

      removeFromCombat: (id) => {
        set((s) => {
          const order = s.combat.initiativeOrder.filter((i) => i !== id)
          const currentTurnId =
            s.combat.currentTurnId === id ? (order[0] ?? null) : s.combat.currentTurnId
          return { combat: { ...s.combat, initiativeOrder: order, currentTurnId } }
        })
      },

      sortByInitiative: () => {
        set((s) => {
          const order = [...s.combat.initiativeOrder].sort(
            (a, b) => (s.creatures[b]?.initiative ?? 0) - (s.creatures[a]?.initiative ?? 0)
          )
          return { combat: { ...s.combat, initiativeOrder: order } }
        })
      },

      setSelectedCreature: (id) => set({ selectedCreatureId: id }),
      setShowAddModal: (show) => set({ showAddModal: show }),
      setEditingCreature: (id) => set({ editingCreatureId: id }),

      resetCombat: () => {
        // Reset combat state and all creature turn resources
        const { creatures } = get()
        const updated: Record<string, Creature> = {}
        for (const id of Object.keys(creatures)) {
          updated[id] = {
            ...creatures[id],
            actionUsed: false,
            bonusActionUsed: false,
            reactionUsed: false,
            movementUsed: 0,
            legendaryActionsUsed: 0,
            conditions: [],
            effects: [],
            deathSaves: { successes: 0, failures: 0 },
            concentrating: false,
            concentrationSpell: '',
          }
        }
        set({ combat: DEFAULT_COMBAT, creatures: updated })
      },

      fullReset: () => {
        // Keep campaign PCs in creatures but reset their combat state
        const { creatures, campaign } = get()
        const keptCreatures: Record<string, Creature> = {}
        for (const id of campaign.playerCharacterIds) {
          if (creatures[id]) {
            keptCreatures[id] = {
              ...creatures[id],
              currentHP: creatures[id].maxHP,
              tempHP: 0,
              actionUsed: false,
              bonusActionUsed: false,
              reactionUsed: false,
              conditions: [],
              effects: [],
              deathSaves: { successes: 0, failures: 0 },
              concentrating: false,
              concentrationSpell: '',
            }
          }
        }
        set({
          combat: DEFAULT_COMBAT,
          creatures: keptCreatures,
        })
      },
    }),
    {
      name: 'dm-tracker-v1',
      // Persist everything except UI state
      partialize: (state) => ({
        creatures: state.creatures,
        library: state.library,
        combat: state.combat,
        campaign: state.campaign,
      }),
    }
  )
)

// Helper: calculate ability modifier
export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2)
}

// Helper: format modifier string "+3" / "-1"
export function formatMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

// Helper: get saving throw modifier for a creature
export function getSaveMod(creature: Creature, ability: AbilityKey): number {
  const score = creature[ability]
  const mod = abilityMod(score)
  const isProficient = creature.savingThrowProf[ability]
  return isProficient ? mod + creature.proficiencyBonus : mod
}

// Helper: get passive perception
export function getPassivePerception(creature: Creature): number {
  return 10 + abilityMod(creature.wis) + creature.proficiencyBonus
}

// Helper: spell DC from spellcasting ability
export function calcSpellDC(creature: Creature): number {
  const mod = abilityMod(creature[creature.spellcastingAbility])
  return 8 + mod + creature.proficiencyBonus
}
