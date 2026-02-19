export type CreatureType = 'pc' | 'npc' | 'monster'

export type SpellcastingAbility = 'int' | 'wis' | 'cha'

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export interface SpellSlotLevel {
  max: number
  used: number
}

export interface DeathSaves {
  successes: number
  failures: number
}

export interface ActiveEffect {
  id: string
  name: string
  description: string
  duration: number    // rounds, -1 = until rest, 0 = permanent/manual
  roundsRemaining: number
  color: string       // badge color
}

export interface SavingThrowProf {
  str: boolean
  dex: boolean
  con: boolean
  int: boolean
  wis: boolean
  cha: boolean
}

// 5e D&D 2014 conditions
export type Condition =
  | 'Blinded'
  | 'Charmed'
  | 'Deafened'
  | 'Exhaustion 1'
  | 'Exhaustion 2'
  | 'Exhaustion 3'
  | 'Exhaustion 4'
  | 'Exhaustion 5'
  | 'Exhaustion 6'
  | 'Frightened'
  | 'Grappled'
  | 'Incapacitated'
  | 'Invisible'
  | 'Paralyzed'
  | 'Petrified'
  | 'Poisoned'
  | 'Prone'
  | 'Restrained'
  | 'Stunned'
  | 'Unconscious'

export interface Creature {
  id: string
  name: string
  type: CreatureType

  // Initiative
  initiative: number
  initiativeBonus: number

  // HP
  maxHP: number
  currentHP: number
  tempHP: number

  // Defense / offense
  ac: number
  speed: number

  // Ability scores
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number

  // Proficiency
  proficiencyBonus: number

  // Saving throw proficiencies
  savingThrowProf: SavingThrowProf

  // Spellcasting
  isSpellcaster: boolean
  spellcastingAbility: SpellcastingAbility
  spellDC: number
  spellAttackBonus: number
  spellSlots: { [level: number]: SpellSlotLevel }

  // Actions used this turn
  actionUsed: boolean
  bonusActionUsed: boolean
  reactionUsed: boolean
  movementUsed: number  // feet used this turn

  // Conditions (5e standard)
  conditions: Condition[]

  // Custom effects (custom DM notes with duration)
  effects: ActiveEffect[]

  // Notes
  notes: string

  // Monster metadata
  cr?: string
  creatureSize?: string
  monsterType?: string
  alignment?: string

  // Death saves (PCs)
  deathSaves: DeathSaves

  // Concentration
  concentrating: boolean
  concentrationSpell: string

  // Legendary actions (monsters)
  legendaryActionsMax: number
  legendaryActionsUsed: number

  // Lair actions flag
  hasLairActions: boolean

  // Inspiration (PCs)
  inspiration: boolean
}

export interface CombatState {
  isActive: boolean
  round: number
  currentTurnId: string | null
  initiativeOrder: string[]  // creature ids in order
}

export interface Campaign {
  name: string
  playerCharacterIds: string[]  // ids of PC creatures saved to campaign
}

export interface DMState {
  // All creatures (PCs, NPCs, monsters in current session)
  creatures: Record<string, Creature>

  // Monster/NPC library (templates to add to combat)
  library: Record<string, Creature>

  // Current combat
  combat: CombatState

  // Campaign info (persisted between sessions)
  campaign: Campaign

  // UI state
  selectedCreatureId: string | null
  showAddModal: boolean
  editingCreatureId: string | null
}

// Partial creature for forms
export type CreatureFormData = Omit<Creature, 'id'>
