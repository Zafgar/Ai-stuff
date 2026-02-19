import { useState } from 'react'
import { useDMStore, abilityMod, formatMod, getSaveMod, getPassivePerception } from '../store/useDMStore'
import { Creature, AbilityKey, Condition } from '../types'
import { CONDITIONS, CONDITION_COLORS, CONDITION_DESCRIPTIONS } from '../data/conditions'
import {
  Heart, Shield, Zap, Eye, Trash2, Pencil, BookOpen, Star,
  ChevronDown, ChevronUp, RotateCcw, X, Plus, Minus
} from 'lucide-react'
import clsx from 'clsx'

const ABILITIES: { key: AbilityKey; label: string }[] = [
  { key: 'str', label: 'STR' },
  { key: 'dex', label: 'DEX' },
  { key: 'con', label: 'CON' },
  { key: 'int', label: 'INT' },
  { key: 'wis', label: 'WIS' },
  { key: 'cha', label: 'CHA' },
]

function HPBar({ creature }: { creature: Creature }) {
  const pct = Math.max(0, (creature.currentHP / creature.maxHP) * 100)
  const barClass = pct > 50 ? 'hp-bar-green' : pct > 25 ? 'hp-bar-yellow' : 'hp-bar-red'

  const [dmgInput, setDmgInput] = useState('')
  const [healInput, setHealInput] = useState('')
  const { applyDamage, applyHealing, setTempHP, updateCreature } = useDMStore()

  return (
    <div className="space-y-2">
      {/* HP display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart size={14} className="text-red-400" />
          <span className="text-lg font-bold text-dnd-text">
            {creature.currentHP}
            <span className="text-dnd-muted text-sm">/{creature.maxHP}</span>
          </span>
          {creature.tempHP > 0 && (
            <span className="text-blue-400 text-sm font-bold">+{creature.tempHP} tmp</span>
          )}
        </div>
        {/* Temp HP input */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-dnd-muted">Tmp HP:</span>
          <input
            type="number"
            value={creature.tempHP || ''}
            placeholder="0"
            onChange={(e) => setTempHP(creature.id, parseInt(e.target.value) || 0)}
            className="w-12 text-xs text-center bg-dnd-border rounded px-1 py-0.5 text-dnd-text outline-none"
          />
        </div>
      </div>

      {/* HP bar */}
      <div className="h-3 bg-dnd-border rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-300', barClass)}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Max HP edit */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-dnd-muted">Max HP:</span>
        <input
          type="number"
          value={creature.maxHP}
          onChange={(e) => {
            const v = parseInt(e.target.value) || 1
            useDMStore.getState().updateCreature(creature.id, { maxHP: v })
          }}
          className="w-14 text-xs text-center bg-dnd-border rounded px-1 py-0.5 text-dnd-text outline-none"
        />
      </div>

      {/* Damage / Heal inputs */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-1">
          <input
            type="number"
            value={dmgInput}
            onChange={(e) => setDmgInput(e.target.value)}
            placeholder="DMG"
            className="flex-1 text-xs text-center bg-dnd-border rounded-l px-2 py-1 text-dnd-text outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && dmgInput) {
                applyDamage(creature.id, parseInt(dmgInput) || 0)
                setDmgInput('')
              }
            }}
          />
          <button
            onClick={() => { applyDamage(creature.id, parseInt(dmgInput) || 0); setDmgInput('') }}
            className="px-2 py-1 bg-red-800 text-red-200 rounded-r text-xs font-bold hover:bg-red-700 transition-colors"
          >
            <Minus size={11} />
          </button>
        </div>
        <div className="flex-1 flex items-center gap-1">
          <input
            type="number"
            value={healInput}
            onChange={(e) => setHealInput(e.target.value)}
            placeholder="HEAL"
            className="flex-1 text-xs text-center bg-dnd-border rounded-l px-2 py-1 text-dnd-text outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && healInput) {
                applyHealing(creature.id, parseInt(healInput) || 0)
                setHealInput('')
              }
            }}
          />
          <button
            onClick={() => { applyHealing(creature.id, parseInt(healInput) || 0); setHealInput('') }}
            className="px-2 py-1 bg-green-800 text-green-200 rounded-r text-xs font-bold hover:bg-green-700 transition-colors"
          >
            <Plus size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionTracker({ creature }: { creature: Creature }) {
  const { toggleAction, toggleBonusAction, toggleReaction, resetTurnActions } = useDMStore()

  const items = [
    { label: 'Action', used: creature.actionUsed, toggle: () => toggleAction(creature.id) },
    { label: 'Bonus', used: creature.bonusActionUsed, toggle: () => toggleBonusAction(creature.id) },
    { label: 'Reaction', used: creature.reactionUsed, toggle: () => toggleReaction(creature.id) },
  ]

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-dnd-muted uppercase tracking-wider">Actions</span>
        <button
          onClick={() => resetTurnActions(creature.id)}
          className="text-[10px] text-dnd-muted hover:text-dnd-gold flex items-center gap-0.5"
        >
          <RotateCcw size={9} /> Reset
        </button>
      </div>
      <div className="flex gap-1">
        {items.map(({ label, used, toggle }) => (
          <button
            key={label}
            onClick={toggle}
            className={clsx(
              'flex-1 py-1 rounded text-[11px] font-bold transition-colors',
              used
                ? 'bg-red-900 text-red-300 line-through'
                : 'bg-green-900 text-green-300 hover:bg-green-800'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Legendary actions */}
      {creature.legendaryActionsMax > 0 && (
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[10px] text-dnd-muted">Legendary:</span>
          <div className="flex gap-1">
            {Array.from({ length: creature.legendaryActionsMax }).map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  i < creature.legendaryActionsUsed
                    ? useDMStore.getState().updateCreature(creature.id, { legendaryActionsUsed: i })
                    : useDMStore.getState().useLegendaryAction(creature.id)
                }
                className={clsx(
                  'w-5 h-5 rounded-full border text-[10px] font-bold transition-colors',
                  i < creature.legendaryActionsUsed
                    ? 'border-dnd-gold bg-dnd-gold text-dnd-bg'
                    : 'border-dnd-border text-dnd-muted hover:border-dnd-gold'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => useDMStore.getState().resetLegendaryActions(creature.id)}
            className="text-[10px] text-dnd-muted hover:text-dnd-gold"
          >
            <RotateCcw size={9} />
          </button>
        </div>
      )}
    </div>
  )
}

function SpellSlots({ creature }: { creature: Creature }) {
  const { useSpellSlot, restoreSpellSlot, restoreAllSpellSlots } = useDMStore()

  const levels = Object.entries(creature.spellSlots)
    .filter(([, slot]) => slot.max > 0)
    .map(([level, slot]) => ({ level: parseInt(level), ...slot }))

  if (levels.length === 0) return null

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-dnd-muted uppercase tracking-wider flex items-center gap-1">
          <BookOpen size={9} /> Spell Slots
          <span className="text-dnd-muted">DC {creature.spellDC} / +{creature.spellAttackBonus}</span>
        </span>
        <button
          onClick={() => restoreAllSpellSlots(creature.id)}
          className="text-[10px] text-dnd-muted hover:text-dnd-gold flex items-center gap-0.5"
        >
          <RotateCcw size={9} /> Long Rest
        </button>
      </div>
      <div className="space-y-1">
        {levels.map(({ level, max, used }) => {
          const available = max - used
          return (
            <div key={level} className="flex items-center gap-1">
              <span className="text-[10px] text-dnd-muted w-5 text-right">{level}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: max }).map((_, i) => {
                  const isUsed = i >= available
                  return (
                    <button
                      key={i}
                      onClick={() =>
                        isUsed
                          ? restoreSpellSlot(creature.id, level)
                          : useSpellSlot(creature.id, level)
                      }
                      className={clsx(
                        'w-4 h-4 rounded border transition-colors',
                        isUsed
                          ? 'border-dnd-border bg-transparent'
                          : 'border-purple-500 bg-purple-900 hover:bg-purple-800'
                      )}
                      title={isUsed ? 'Restore slot' : 'Use slot'}
                    />
                  )
                })}
              </div>
              <span className="text-[10px] text-dnd-muted">
                {available}/{max}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ConditionsPanel({ creature }: { creature: Creature }) {
  const { addCondition, removeCondition } = useDMStore()
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-dnd-muted uppercase tracking-wider">Conditions</span>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="text-[10px] text-dnd-muted hover:text-dnd-gold flex items-center gap-0.5"
        >
          <Plus size={9} /> Add
        </button>
      </div>

      {/* Active conditions */}
      <div className="flex flex-wrap gap-1">
        {creature.conditions.map((cond) => (
          <span
            key={cond}
            className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 text-white"
            style={{ backgroundColor: CONDITION_COLORS[cond] }}
            title={CONDITION_DESCRIPTIONS[cond]}
            onClick={() => removeCondition(creature.id, cond)}
          >
            {cond} <X size={8} />
          </span>
        ))}
        {creature.conditions.length === 0 && (
          <span className="text-[10px] text-dnd-muted italic">None</span>
        )}
      </div>

      {/* Condition picker */}
      {showPicker && (
        <div className="flex flex-wrap gap-1 p-2 bg-dnd-bg rounded border border-dnd-border">
          {CONDITIONS.filter((c) => !creature.conditions.includes(c)).map((cond) => (
            <button
              key={cond}
              onClick={() => { addCondition(creature.id, cond); setShowPicker(false) }}
              title={CONDITION_DESCRIPTIONS[cond]}
              className="text-[10px] px-1.5 py-0.5 rounded text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: CONDITION_COLORS[cond] }}
            >
              {cond}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function EffectsPanel({ creature }: { creature: Creature }) {
  const { addEffect, removeEffect } = useDMStore()
  const [showAdd, setShowAdd] = useState(false)
  const [newEffect, setNewEffect] = useState({ name: '', description: '', duration: -1 })

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-dnd-muted uppercase tracking-wider">Effects</span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] text-dnd-muted hover:text-dnd-gold flex items-center gap-0.5"
        >
          <Plus size={9} /> Add
        </button>
      </div>

      {creature.effects.map((effect) => (
        <div key={effect.id} className="flex items-center justify-between bg-dnd-border rounded px-2 py-1">
          <div>
            <span className="text-[11px] font-bold text-dnd-text">{effect.name}</span>
            {effect.duration > 0 && (
              <span className="text-[10px] text-dnd-muted ml-1">
                ({effect.roundsRemaining}r)
              </span>
            )}
            {effect.description && (
              <div className="text-[10px] text-dnd-muted">{effect.description}</div>
            )}
          </div>
          <button
            onClick={() => removeEffect(creature.id, effect.id)}
            className="text-dnd-muted hover:text-red-400"
          >
            <X size={11} />
          </button>
        </div>
      ))}

      {showAdd && (
        <div className="p-2 bg-dnd-bg rounded border border-dnd-border space-y-1">
          <input
            placeholder="Effect name"
            value={newEffect.name}
            onChange={(e) => setNewEffect({ ...newEffect, name: e.target.value })}
            className="w-full text-xs bg-dnd-border rounded px-2 py-1 text-dnd-text outline-none"
          />
          <input
            placeholder="Description (optional)"
            value={newEffect.description}
            onChange={(e) => setNewEffect({ ...newEffect, description: e.target.value })}
            className="w-full text-xs bg-dnd-border rounded px-2 py-1 text-dnd-text outline-none"
          />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-dnd-muted">Duration (rounds, -1=indefinite):</span>
            <input
              type="number"
              value={newEffect.duration}
              onChange={(e) => setNewEffect({ ...newEffect, duration: parseInt(e.target.value) || -1 })}
              className="w-14 text-xs bg-dnd-border rounded px-1 py-0.5 text-dnd-text outline-none text-center"
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => {
                if (!newEffect.name) return
                addEffect(creature.id, {
                  ...newEffect,
                  roundsRemaining: newEffect.duration,
                  color: '#805ad5',
                })
                setNewEffect({ name: '', description: '', duration: -1 })
                setShowAdd(false)
              }}
              className="flex-1 text-xs bg-dnd-gold text-dnd-bg rounded py-1 font-bold hover:bg-dnd-gold-light"
            >
              Add
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-2 text-xs text-dnd-muted hover:text-dnd-text"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DeathSaves({ creature }: { creature: Creature }) {
  const { addDeathSaveSuccess, addDeathSaveFailure, resetDeathSaves } = useDMStore()
  if (creature.type !== 'pc' || creature.currentHP > 0) return null

  return (
    <div className="p-2 rounded border border-red-800 bg-red-950/30 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-red-400">Death Saves</span>
        <button onClick={() => resetDeathSaves(creature.id)} className="text-[10px] text-dnd-muted hover:text-dnd-gold">
          <RotateCcw size={9} />
        </button>
      </div>
      <div className="flex gap-4">
        <div className="space-y-1">
          <div className="text-[10px] text-green-400">Successes</div>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => addDeathSaveSuccess(creature.id)}
                className={clsx(
                  'w-5 h-5 rounded-full border-2 transition-colors',
                  i <= creature.deathSaves.successes
                    ? 'border-green-500 bg-green-700'
                    : 'border-green-800'
                )}
              />
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] text-red-400">Failures</div>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => addDeathSaveFailure(creature.id)}
                className={clsx(
                  'w-5 h-5 rounded-full border-2 transition-colors',
                  i <= creature.deathSaves.failures
                    ? 'border-red-500 bg-red-700'
                    : 'border-red-900'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreatureCard({ creature }: { creature: Creature }) {
  const {
    removeCreature,
    setEditingCreature,
    saveToCampaign,
    removeFromCampaign,
    campaign,
    setConcentration,
    breakConcentration,
    updateCreature,
  } = useDMStore()

  const [expanded, setExpanded] = useState(false)
  const [showConcentrationInput, setShowConcentrationInput] = useState(false)
  const [concInput, setConcInput] = useState('')
  const isPC = campaign.playerCharacterIds.includes(creature.id)

  const borderColor = creature.id === useDMStore.getState().combat.currentTurnId
    ? 'border-dnd-gold'
    : creature.type === 'pc'
    ? 'border-blue-700'
    : creature.type === 'npc'
    ? 'border-yellow-700'
    : 'border-dnd-border'

  return (
    <div className={clsx('bg-dnd-card rounded-xl border p-3 flex flex-col gap-2', borderColor)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <h3 className="font-bold text-dnd-text text-sm">{creature.name}</h3>
            {creature.cr && (
              <span className="text-[10px] text-dnd-muted border border-dnd-border px-1 rounded">CR {creature.cr}</span>
            )}
            {isPC && <Star size={11} className="text-dnd-gold" />}
            {creature.concentrating && (
              <span
                className="text-[10px] bg-purple-900 text-purple-300 px-1 rounded cursor-pointer"
                onClick={() => breakConcentration(creature.id)}
                title="Click to break concentration"
              >
                ◉ {creature.concentrationSpell || 'Conc.'}
              </span>
            )}
          </div>
          {creature.monsterType && (
            <div className="text-[10px] text-dnd-muted">{creature.creatureSize} {creature.monsterType} · {creature.alignment}</div>
          )}
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-center">
            <div className="text-[9px] text-dnd-muted">AC</div>
            <div className="text-sm font-bold text-dnd-text">{creature.ac}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-dnd-muted">SPD</div>
            <div className="text-sm font-bold text-dnd-text">{creature.speed}</div>
          </div>
          {creature.isSpellcaster && (
            <div className="text-center">
              <div className="text-[9px] text-dnd-muted">DC</div>
              <div className="text-sm font-bold text-purple-300">{creature.spellDC}</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-[9px] text-dnd-muted">PP</div>
            <div className="text-sm font-bold text-dnd-text">{getPassivePerception(creature)}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setEditingCreature(creature.id)}
            className="p-1 text-dnd-muted hover:text-dnd-gold transition-colors"
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => isPC ? removeFromCampaign(creature.id) : saveToCampaign(creature.id)}
            className={clsx('p-1 transition-colors', isPC ? 'text-dnd-gold' : 'text-dnd-muted hover:text-dnd-gold')}
            title={isPC ? 'Remove from campaign' : 'Save to campaign'}
          >
            <Star size={13} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Remove ${creature.name}?`)) removeCreature(creature.id)
            }}
            className="p-1 text-dnd-muted hover:text-red-400 transition-colors"
            title="Remove"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* HP tracker */}
      <HPBar creature={creature} />

      {/* Actions */}
      <ActionTracker creature={creature} />

      {/* Conditions */}
      <ConditionsPanel creature={creature} />

      {/* Death saves (PC at 0 HP) */}
      <DeathSaves creature={creature} />

      {/* Expand/collapse for more info */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center gap-1 text-[10px] text-dnd-muted hover:text-dnd-text transition-colors py-1 border-t border-dnd-border"
      >
        {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        {expanded ? 'Less' : 'More'}
      </button>

      {expanded && (
        <div className="space-y-3">
          {/* Ability scores */}
          <div>
            <div className="text-[10px] text-dnd-muted uppercase tracking-wider mb-1">Ability Scores</div>
            <div className="grid grid-cols-6 gap-1">
              {ABILITIES.map(({ key, label }) => {
                const score = creature[key]
                const mod = abilityMod(score)
                return (
                  <div key={key} className="text-center bg-dnd-border rounded p-1">
                    <div className="text-[9px] text-dnd-muted">{label}</div>
                    <div className="text-xs font-bold text-dnd-text">{score}</div>
                    <div className="text-[10px] text-dnd-gold">{formatMod(mod)}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Saving throws */}
          <div>
            <div className="text-[10px] text-dnd-muted uppercase tracking-wider mb-1">Saving Throws</div>
            <div className="grid grid-cols-3 gap-1">
              {ABILITIES.map(({ key, label }) => {
                const mod = getSaveMod(creature, key)
                const isProficient = creature.savingThrowProf[key]
                return (
                  <div key={key} className="flex items-center gap-1">
                    <span className={clsx('w-1.5 h-1.5 rounded-full', isProficient ? 'bg-dnd-gold' : 'bg-dnd-border')} />
                    <span className="text-[10px] text-dnd-muted">{label}</span>
                    <span className="text-[11px] text-dnd-text font-bold ml-auto">{formatMod(mod)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Spell slots */}
          {creature.isSpellcaster && <SpellSlots creature={creature} />}

          {/* Concentration */}
          {creature.isSpellcaster && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-dnd-muted uppercase tracking-wider">Concentration</span>
                {creature.concentrating ? (
                  <button
                    onClick={() => breakConcentration(creature.id)}
                    className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5"
                  >
                    <X size={9} /> Break
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConcentrationInput(!showConcentrationInput)}
                    className="text-[10px] text-dnd-muted hover:text-dnd-gold flex items-center gap-0.5"
                  >
                    <Plus size={9} /> Set
                  </button>
                )}
              </div>
              {creature.concentrating && (
                <div className="text-[11px] text-purple-300 bg-purple-950/30 rounded px-2 py-1">
                  ◉ {creature.concentrationSpell}
                </div>
              )}
              {showConcentrationInput && !creature.concentrating && (
                <div className="flex gap-1">
                  <input
                    placeholder="Spell name"
                    value={concInput}
                    onChange={(e) => setConcInput(e.target.value)}
                    className="flex-1 text-xs bg-dnd-border rounded px-2 py-1 text-dnd-text outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && concInput) {
                        setConcentration(creature.id, concInput)
                        setConcInput('')
                        setShowConcentrationInput(false)
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (concInput) {
                        setConcentration(creature.id, concInput)
                        setConcInput('')
                        setShowConcentrationInput(false)
                      }
                    }}
                    className="px-2 text-xs bg-dnd-gold text-dnd-bg rounded font-bold"
                  >
                    Set
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Inspiration (PC only) */}
          {creature.type === 'pc' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-dnd-muted uppercase tracking-wider">Inspiration</span>
              <button
                onClick={() => updateCreature(creature.id, { inspiration: !creature.inspiration })}
                className={clsx(
                  'px-2 py-0.5 rounded text-[11px] font-bold transition-colors',
                  creature.inspiration
                    ? 'bg-dnd-gold text-dnd-bg'
                    : 'bg-dnd-border text-dnd-muted hover:border-dnd-gold'
                )}
              >
                {creature.inspiration ? '★ Inspired' : '☆ No Inspiration'}
              </button>
            </div>
          )}

          {/* Effects */}
          <EffectsPanel creature={creature} />

          {/* Notes */}
          <div className="space-y-1">
            <span className="text-[10px] text-dnd-muted uppercase tracking-wider">Notes</span>
            <textarea
              value={creature.notes}
              onChange={(e) => updateCreature(creature.id, { notes: e.target.value })}
              placeholder="DM notes..."
              rows={2}
              className="w-full text-xs bg-dnd-border rounded px-2 py-1 text-dnd-text outline-none resize-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
