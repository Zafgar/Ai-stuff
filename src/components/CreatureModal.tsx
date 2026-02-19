import { useState, useEffect } from 'react'
import { useDMStore } from '../store/useDMStore'
import { Creature, AbilityKey, SpellcastingAbility } from '../types'
import { createEmptyCreature } from '../data/defaults'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

const ABILITY_LABELS: { key: AbilityKey; label: string }[] = [
  { key: 'str', label: 'STR' },
  { key: 'dex', label: 'DEX' },
  { key: 'con', label: 'CON' },
  { key: 'int', label: 'INT' },
  { key: 'wis', label: 'WIS' },
  { key: 'cha', label: 'CHA' },
]

function NumberInput({
  label,
  value,
  onChange,
  min,
  className,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  className?: string
}) {
  return (
    <div className={clsx('flex flex-col items-center gap-0.5', className)}>
      <span className="text-[10px] text-dnd-muted">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-14 text-center text-sm bg-dnd-border rounded px-1 py-1 text-dnd-text outline-none"
      />
    </div>
  )
}

interface Props {
  creatureId?: string | null
  onClose: () => void
}

export default function CreatureModal({ creatureId, onClose }: Props) {
  const { creatures, addCreature, updateCreature, addToCombat, saveToLibrary } = useDMStore()

  const existing = creatureId ? creatures[creatureId] : null

  const [form, setForm] = useState<Creature>(
    existing ?? createEmptyCreature({ type: 'monster' })
  )
  const [showSpells, setShowSpells] = useState(form.isSpellcaster)
  const [addToCombatOnSave, setAddToCombatOnSave] = useState(!existing)
  const [saveToLib, setSaveToLib] = useState(false)

  useEffect(() => {
    if (existing) setForm(existing)
  }, [creatureId])

  function set<K extends keyof Creature>(key: K, value: Creature[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setSlot(level: number, field: 'max' | 'used', value: number) {
    setForm((prev) => ({
      ...prev,
      spellSlots: {
        ...prev.spellSlots,
        [level]: { ...prev.spellSlots[level], [field]: Math.max(0, value) },
      },
    }))
  }

  function save() {
    if (existing) {
      updateCreature(existing.id, form)
    } else {
      const id = addCreature(form)
      if (addToCombatOnSave) addToCombat(id)
      if (saveToLib) saveToLibrary(id)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 bg-dnd-surface border border-dnd-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-dnd-surface border-b border-dnd-border px-4 py-3 flex items-center justify-between z-10">
          <h2 className="font-bold text-dnd-gold text-sm uppercase tracking-wider">
            {existing ? `Edit: ${existing.name}` : 'Add Creature'}
          </h2>
          <button onClick={onClose} className="text-dnd-muted hover:text-dnd-text">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[10px] text-dnd-muted block mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="w-full text-sm bg-dnd-border rounded px-2 py-1.5 text-dnd-text outline-none"
                placeholder="Goblin, Troll, Elara..."
              />
            </div>
            <div>
              <label className="text-[10px] text-dnd-muted block mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as Creature['type'])}
                className="w-full text-sm bg-dnd-border rounded px-2 py-1.5 text-dnd-text outline-none"
              >
                <option value="monster">Monster</option>
                <option value="npc">NPC</option>
                <option value="pc">Player Character</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-dnd-muted block mb-1">CR</label>
              <input
                value={form.cr ?? ''}
                onChange={(e) => set('cr', e.target.value)}
                className="w-full text-sm bg-dnd-border rounded px-2 py-1.5 text-dnd-text outline-none"
                placeholder="1/4, 1, 5..."
              />
            </div>
            <div>
              <label className="text-[10px] text-dnd-muted block mb-1">Size</label>
              <select
                value={form.creatureSize ?? ''}
                onChange={(e) => set('creatureSize', e.target.value)}
                className="w-full text-sm bg-dnd-border rounded px-2 py-1.5 text-dnd-text outline-none"
              >
                <option value="">—</option>
                {['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-dnd-muted block mb-1">Monster Type</label>
              <input
                value={form.monsterType ?? ''}
                onChange={(e) => set('monsterType', e.target.value)}
                className="w-full text-sm bg-dnd-border rounded px-2 py-1.5 text-dnd-text outline-none"
                placeholder="Humanoid, Beast, Undead..."
              />
            </div>
            <div>
              <label className="text-[10px] text-dnd-muted block mb-1">Alignment</label>
              <input
                value={form.alignment ?? ''}
                onChange={(e) => set('alignment', e.target.value)}
                className="w-full text-sm bg-dnd-border rounded px-2 py-1.5 text-dnd-text outline-none"
                placeholder="Chaotic Evil..."
              />
            </div>
          </div>

          {/* Combat stats */}
          <div>
            <div className="text-[10px] text-dnd-muted uppercase tracking-wider mb-2">Combat Stats</div>
            <div className="grid grid-cols-4 gap-2">
              <NumberInput label="Max HP" value={form.maxHP} onChange={(v) => { set('maxHP', v); set('currentHP', v) }} min={1} />
              <NumberInput label="AC" value={form.ac} onChange={(v) => set('ac', v)} />
              <NumberInput label="Speed" value={form.speed} onChange={(v) => set('speed', v)} />
              <NumberInput label="Init. Bonus" value={form.initiativeBonus} onChange={(v) => set('initiativeBonus', v)} />
              <NumberInput label="Proficiency" value={form.proficiencyBonus} onChange={(v) => set('proficiencyBonus', v)} min={2} />
              <NumberInput label="Initiative" value={form.initiative} onChange={(v) => set('initiative', v)} />
              <NumberInput label="Legendary" value={form.legendaryActionsMax} onChange={(v) => set('legendaryActionsMax', v)} min={0} />
            </div>
          </div>

          {/* Ability scores */}
          <div>
            <div className="text-[10px] text-dnd-muted uppercase tracking-wider mb-2">Ability Scores</div>
            <div className="grid grid-cols-6 gap-2">
              {ABILITY_LABELS.map(({ key, label }) => (
                <NumberInput
                  key={key}
                  label={label}
                  value={form[key]}
                  onChange={(v) => set(key, v)}
                  min={1}
                />
              ))}
            </div>
          </div>

          {/* Saving throw proficiencies */}
          <div>
            <div className="text-[10px] text-dnd-muted uppercase tracking-wider mb-2">Saving Throw Proficiencies</div>
            <div className="flex gap-3 flex-wrap">
              {ABILITY_LABELS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.savingThrowProf[key]}
                    onChange={(e) =>
                      set('savingThrowProf', { ...form.savingThrowProf, [key]: e.target.checked })
                    }
                    className="accent-yellow-500"
                  />
                  <span className="text-xs text-dnd-text">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Spellcasting */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isSpellcaster}
                  onChange={(e) => { set('isSpellcaster', e.target.checked); setShowSpells(e.target.checked) }}
                  className="accent-purple-500"
                />
                <span className="text-[10px] text-dnd-muted uppercase tracking-wider">Spellcaster</span>
              </label>
              {form.isSpellcaster && (
                <button onClick={() => setShowSpells(!showSpells)} className="text-dnd-muted hover:text-dnd-text">
                  {showSpells ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              )}
            </div>

            {form.isSpellcaster && showSpells && (
              <div className="space-y-3 pl-2 border-l-2 border-purple-800">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-dnd-muted block mb-1">Casting Ability</label>
                    <select
                      value={form.spellcastingAbility}
                      onChange={(e) => set('spellcastingAbility', e.target.value as SpellcastingAbility)}
                      className="w-full text-sm bg-dnd-border rounded px-2 py-1 text-dnd-text outline-none"
                    >
                      <option value="int">INT</option>
                      <option value="wis">WIS</option>
                      <option value="cha">CHA</option>
                    </select>
                  </div>
                  <NumberInput label="Spell DC" value={form.spellDC} onChange={(v) => set('spellDC', v)} />
                  <NumberInput label="Spell Atk" value={form.spellAttackBonus} onChange={(v) => set('spellAttackBonus', v)} />
                </div>

                {/* Spell slots */}
                <div>
                  <div className="text-[10px] text-dnd-muted uppercase tracking-wider mb-2">Spell Slots (Max per level)</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                      <div key={level} className="flex items-center gap-1">
                        <span className="text-[10px] text-dnd-muted w-4">{level}:</span>
                        <input
                          type="number"
                          min={0}
                          max={9}
                          value={form.spellSlots[level]?.max ?? 0}
                          onChange={(e) => setSlot(level, 'max', parseInt(e.target.value) || 0)}
                          className="w-12 text-center text-xs bg-dnd-border rounded px-1 py-0.5 text-dnd-text outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-dnd-muted block mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Abilities, traits, DM notes..."
              rows={3}
              className="w-full text-xs bg-dnd-border rounded px-2 py-1.5 text-dnd-text outline-none resize-none"
            />
          </div>

          {/* Options */}
          {!existing && (
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addToCombatOnSave}
                  onChange={(e) => setAddToCombatOnSave(e.target.checked)}
                  className="accent-yellow-500"
                />
                <span className="text-xs text-dnd-text">Add to combat</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToLib}
                  onChange={(e) => setSaveToLib(e.target.checked)}
                  className="accent-yellow-500"
                />
                <span className="text-xs text-dnd-text">Save to library</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-dnd-surface border-t border-dnd-border px-4 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-dnd-muted hover:text-dnd-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!form.name}
            className="px-4 py-1.5 text-sm bg-dnd-gold text-dnd-bg rounded font-bold hover:bg-dnd-gold-light transition-colors disabled:opacity-40"
          >
            {existing ? 'Save Changes' : 'Add Creature'}
          </button>
        </div>
      </div>
    </div>
  )
}
