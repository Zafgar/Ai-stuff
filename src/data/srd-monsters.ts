import type { Creature } from '../types'

export interface SRDEntry {
  name: string
  cr: string
  hp: number
  ac: number
  speed: number
  str: number; dex: number; con: number; int: number; wis: number; cha: number
  size: string
  mtype: string
  align: string
  pb: number
  saves?: Partial<Record<'str'|'dex'|'con'|'int'|'wis'|'cha', boolean>>
  sc?: boolean
  sa?: 'int'|'wis'|'cha'
  sdc?: number
  ss?: number[]   // spell slots per level [l1,l2,...]
  leg?: number    // legendary actions
}

export const SRD_MONSTERS: SRDEntry[] = [
  // CR 0
  { name:'Rat',            cr:'0',   hp:1,   ac:10, speed:20, str:2,  dex:11, con:9,  int:2,  wis:10, cha:4,  size:'Tiny',      mtype:'Beast',                 align:'Unaligned',     pb:2 },
  { name:'Bat',            cr:'0',   hp:1,   ac:12, speed:5,  str:2,  dex:15, con:8,  int:2,  wis:12, cha:4,  size:'Tiny',      mtype:'Beast',                 align:'Unaligned',     pb:2 },
  { name:'Cat',            cr:'0',   hp:2,   ac:12, speed:40, str:3,  dex:15, con:10, int:3,  wis:12, cha:7,  size:'Tiny',      mtype:'Beast',                 align:'Unaligned',     pb:2 },
  { name:'Commoner',       cr:'0',   hp:4,   ac:10, speed:30, str:10, dex:10, con:10, int:10, wis:10, cha:10, size:'Medium',    mtype:'Humanoid (any)',        align:'Any',           pb:2 },
  // CR 1/8
  { name:'Bandit',         cr:'1/8', hp:11,  ac:12, speed:30, str:11, dex:12, con:12, int:10, wis:10, cha:10, size:'Medium',    mtype:'Humanoid (any)',        align:'Any Non-Lawful',pb:2 },
  { name:'Guard',          cr:'1/8', hp:11,  ac:16, speed:30, str:13, dex:12, con:12, int:10, wis:11, cha:10, size:'Medium',    mtype:'Humanoid (any)',        align:'Any',           pb:2 },
  { name:'Kobold',         cr:'1/8', hp:5,   ac:12, speed:30, str:7,  dex:15, con:9,  int:8,  wis:7,  cha:8,  size:'Small',     mtype:'Humanoid (kobold)',     align:'Lawful Evil',   pb:2 },
  { name:'Cultist',        cr:'1/8', hp:9,   ac:12, speed:30, str:11, dex:12, con:10, int:10, wis:11, cha:10, size:'Medium',    mtype:'Humanoid (any)',        align:'Any Non-Good',  pb:2 },
  { name:'Giant Rat',      cr:'1/8', hp:7,   ac:12, speed:30, str:7,  dex:15, con:11, int:2,  wis:10, cha:4,  size:'Small',     mtype:'Beast',                 align:'Unaligned',     pb:2 },
  { name:'Stirge',         cr:'1/8', hp:2,   ac:14, speed:10, str:4,  dex:16, con:11, int:2,  wis:8,  cha:6,  size:'Tiny',      mtype:'Beast',                 align:'Unaligned',     pb:2 },
  { name:'Tribal Warrior', cr:'1/8', hp:11,  ac:12, speed:30, str:13, dex:11, con:12, int:8,  wis:11, cha:8,  size:'Medium',    mtype:'Humanoid (any)',        align:'Any',           pb:2 },
  { name:'Blood Hawk',     cr:'1/8', hp:7,   ac:13, speed:10, str:6,  dex:14, con:10, int:3,  wis:14, cha:5,  size:'Small',     mtype:'Beast',                 align:'Unaligned',     pb:2 },
  { name:'Twig Blight',    cr:'1/8', hp:4,   ac:13, speed:20, str:6,  dex:13, con:12, int:4,  wis:8,  cha:6,  size:'Small',     mtype:'Plant',                 align:'Neutral Evil',  pb:2 },
  // CR 1/4
  { name:'Goblin',              cr:'1/4', hp:7,  ac:15, speed:30, str:8,  dex:14, con:10, int:10, wis:8,  cha:8,  size:'Small',  mtype:'Humanoid (goblinoid)', align:'Neutral Evil',  pb:2 },
  { name:'Skeleton',            cr:'1/4', hp:13, ac:13, speed:30, str:10, dex:14, con:15, int:6,  wis:8,  cha:5,  size:'Medium', mtype:'Undead',               align:'Lawful Evil',   pb:2 },
  { name:'Zombie',              cr:'1/4', hp:22, ac:8,  speed:20, str:13, dex:6,  con:16, int:3,  wis:6,  cha:5,  size:'Medium', mtype:'Undead',               align:'Neutral Evil',  pb:2, saves:{wis:true} },
  { name:'Wolf',                cr:'1/4', hp:11, ac:13, speed:40, str:12, dex:15, con:12, int:3,  wis:12, cha:6,  size:'Medium', mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Boar',                cr:'1/4', hp:11, ac:11, speed:40, str:13, dex:11, con:12, int:2,  wis:9,  cha:5,  size:'Medium', mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Panther',             cr:'1/4', hp:13, ac:12, speed:50, str:14, dex:15, con:10, int:3,  wis:14, cha:7,  size:'Medium', mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Constrictor Snake',   cr:'1/4', hp:13, ac:12, speed:30, str:15, dex:14, con:12, int:1,  wis:10, cha:3,  size:'Large',  mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Giant Wolf Spider',   cr:'1/4', hp:11, ac:13, speed:40, str:12, dex:16, con:13, int:3,  wis:12, cha:4,  size:'Medium', mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Needle Blight',       cr:'1/4', hp:11, ac:12, speed:30, str:12, dex:12, con:13, int:4,  wis:8,  cha:3,  size:'Medium', mtype:'Plant',                align:'Neutral Evil',  pb:2 },
  { name:'Pseudodragon',        cr:'1/4', hp:7,  ac:13, speed:15, str:6,  dex:15, con:13, int:10, wis:12, cha:10, size:'Tiny',   mtype:'Dragon',               align:'Neutral Good',  pb:2 },
  { name:'Sprite',              cr:'1/4', hp:2,  ac:15, speed:10, str:3,  dex:18, con:10, int:14, wis:13, cha:11, size:'Tiny',   mtype:'Fey',                  align:'Neutral Good',  pb:2 },
  // CR 1/2
  { name:'Hobgoblin',   cr:'1/2', hp:11, ac:18, speed:30, str:13, dex:12, con:12, int:10, wis:10, cha:9,  size:'Medium', mtype:'Humanoid (goblinoid)', align:'Lawful Evil',   pb:2 },
  { name:'Orc',         cr:'1/2', hp:15, ac:13, speed:30, str:16, dex:12, con:16, int:7,  wis:11, cha:10, size:'Medium', mtype:'Humanoid (orc)',      align:'Chaotic Evil',  pb:2, saves:{wis:true} },
  { name:'Scout',       cr:'1/2', hp:16, ac:13, speed:30, str:11, dex:14, con:12, int:11, wis:13, cha:11, size:'Medium', mtype:'Humanoid (any)',      align:'Any',           pb:2 },
  { name:'Thug',        cr:'1/2', hp:32, ac:11, speed:30, str:15, dex:11, con:14, int:10, wis:10, cha:11, size:'Medium', mtype:'Humanoid (any)',      align:'Any Non-Good',  pb:2 },
  { name:'Shadow',      cr:'1/2', hp:16, ac:12, speed:40, str:6,  dex:14, con:13, int:6,  wis:10, cha:8,  size:'Medium', mtype:'Undead',              align:'Chaotic Evil',  pb:2 },
  { name:'Vine Blight', cr:'1/2', hp:26, ac:12, speed:10, str:15, dex:8,  con:14, int:5,  wis:10, cha:3,  size:'Medium', mtype:'Plant',               align:'Neutral Evil',  pb:2 },
  { name:'Ape',         cr:'1/2', hp:19, ac:12, speed:25, str:16, dex:14, con:14, int:6,  wis:12, cha:7,  size:'Medium', mtype:'Beast',               align:'Unaligned',     pb:2 },
  { name:'Black Bear',  cr:'1/2', hp:19, ac:11, speed:40, str:15, dex:10, con:14, int:2,  wis:12, cha:7,  size:'Medium', mtype:'Beast',               align:'Unaligned',     pb:2 },
  { name:'Crocodile',   cr:'1/2', hp:19, ac:12, speed:20, str:15, dex:10, con:13, int:2,  wis:10, cha:5,  size:'Large',  mtype:'Beast',               align:'Unaligned',     pb:2 },
  { name:'Cockatrice',  cr:'1/2', hp:27, ac:11, speed:20, str:6,  dex:12, con:12, int:2,  wis:13, cha:5,  size:'Small',  mtype:'Monstrosity',         align:'Unaligned',     pb:2 },
  { name:'Gnoll',       cr:'1/2', hp:22, ac:15, speed:30, str:14, dex:12, con:11, int:6,  wis:10, cha:7,  size:'Medium', mtype:'Humanoid (gnoll)',    align:'Chaotic Evil',  pb:2 },
  { name:'Worg',        cr:'1/2', hp:26, ac:13, speed:50, str:16, dex:13, con:13, int:7,  wis:11, cha:8,  size:'Large',  mtype:'Monstrosity',         align:'Neutral Evil',  pb:2 },
  { name:'Gray Ooze',   cr:'1/2', hp:22, ac:8,  speed:10, str:12, dex:6,  con:16, int:1,  wis:6,  cha:2,  size:'Medium', mtype:'Ooze',                align:'Unaligned',     pb:2 },
  { name:'Sahuagin',    cr:'1/2', hp:22, ac:12, speed:30, str:13, dex:11, con:12, int:12, wis:13, cha:9,  size:'Medium', mtype:'Humanoid (sahuagin)', align:'Lawful Evil',   pb:2 },
  // CR 1
  { name:'Bugbear',      cr:'1', hp:27, ac:16, speed:30, str:15, dex:14, con:13, int:8,  wis:11, cha:9,  size:'Medium', mtype:'Humanoid (goblinoid)', align:'Chaotic Evil',  pb:2 },
  { name:'Duergar',      cr:'1', hp:26, ac:16, speed:25, str:14, dex:11, con:14, int:11, wis:10, cha:9,  size:'Medium', mtype:'Humanoid (dwarf)',     align:'Lawful Evil',   pb:2 },
  { name:'Ghoul',        cr:'1', hp:22, ac:12, speed:30, str:13, dex:15, con:10, int:7,  wis:10, cha:6,  size:'Medium', mtype:'Undead',               align:'Chaotic Evil',  pb:2 },
  { name:'Specter',      cr:'1', hp:22, ac:12, speed:0,  str:1,  dex:14, con:11, int:10, wis:10, cha:11, size:'Medium', mtype:'Undead',               align:'Chaotic Evil',  pb:2 },
  { name:'Brown Bear',   cr:'1', hp:34, ac:11, speed:40, str:19, dex:10, con:16, int:2,  wis:13, cha:7,  size:'Large',  mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Giant Hyena',  cr:'1', hp:45, ac:12, speed:50, str:16, dex:14, con:14, int:2,  wis:12, cha:7,  size:'Large',  mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Giant Spider', cr:'1', hp:26, ac:14, speed:30, str:14, dex:16, con:12, int:2,  wis:11, cha:4,  size:'Large',  mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Giant Toad',   cr:'1', hp:39, ac:11, speed:20, str:15, dex:13, con:13, int:2,  wis:10, cha:3,  size:'Large',  mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Harpy',        cr:'1', hp:38, ac:11, speed:20, str:12, dex:13, con:12, int:7,  wis:10, cha:13, size:'Medium', mtype:'Monstrosity',          align:'Chaotic Evil',  pb:2 },
  { name:'Hippogriff',   cr:'1', hp:19, ac:11, speed:40, str:17, dex:13, con:13, int:2,  wis:12, cha:8,  size:'Large',  mtype:'Monstrosity',          align:'Unaligned',     pb:2 },
  { name:'Imp',          cr:'1', hp:10, ac:13, speed:20, str:6,  dex:17, con:13, int:11, wis:12, cha:14, size:'Tiny',   mtype:'Fiend (devil)',        align:'Lawful Evil',   pb:2 },
  { name:'Quasit',       cr:'1', hp:7,  ac:13, speed:40, str:5,  dex:17, con:10, int:7,  wis:10, cha:10, size:'Tiny',   mtype:'Fiend (demon)',        align:'Chaotic Evil',  pb:2 },
  { name:'Dryad',        cr:'1', hp:22, ac:11, speed:30, str:10, dex:12, con:11, int:14, wis:15, cha:18, size:'Medium', mtype:'Fey',                  align:'Neutral',       pb:2, sc:true, sa:'cha', sdc:14 },
  { name:'Goblin Boss',  cr:'1', hp:21, ac:17, speed:30, str:10, dex:14, con:10, int:10, wis:8,  cha:10, size:'Small',  mtype:'Humanoid (goblinoid)', align:'Neutral Evil',  pb:2 },
  // CR 2
  { name:'Ankheg',          cr:'2', hp:39, ac:14, speed:30, str:17, dex:11, con:13, int:1,  wis:13, cha:6,  size:'Large',  mtype:'Monstrosity',          align:'Unaligned',     pb:2 },
  { name:'Azer',            cr:'2', hp:39, ac:17, speed:30, str:17, dex:12, con:15, int:12, wis:13, cha:10, size:'Medium', mtype:'Elemental',            align:'Lawful Neutral',pb:2 },
  { name:'Bandit Captain',  cr:'2', hp:65, ac:15, speed:30, str:15, dex:16, con:14, int:14, wis:11, cha:14, size:'Medium', mtype:'Humanoid (any)',       align:'Any Non-Lawful',pb:2, saves:{str:true,dex:true,wis:true} },
  { name:'Berserker',       cr:'2', hp:67, ac:13, speed:30, str:16, dex:12, con:17, int:9,  wis:11, cha:9,  size:'Medium', mtype:'Humanoid (any)',       align:'Any Chaotic',   pb:2 },
  { name:'Cult Fanatic',    cr:'2', hp:33, ac:13, speed:30, str:11, dex:14, con:12, int:10, wis:13, cha:14, size:'Medium', mtype:'Humanoid (any)',       align:'Any Non-Good',  pb:2, sc:true, sa:'wis', sdc:12, ss:[4,2] },
  { name:'Druid',           cr:'2', hp:27, ac:11, speed:30, str:10, dex:12, con:13, int:12, wis:15, cha:11, size:'Medium', mtype:'Humanoid (any)',       align:'Any',           pb:2, sc:true, sa:'wis', sdc:12, ss:[4,3] },
  { name:'Ettercap',        cr:'2', hp:44, ac:13, speed:30, str:14, dex:15, con:13, int:7,  wis:12, cha:8,  size:'Medium', mtype:'Monstrosity',          align:'Neutral Evil',  pb:2 },
  { name:'Gargoyle',        cr:'2', hp:52, ac:15, speed:30, str:15, dex:11, con:16, int:6,  wis:11, cha:7,  size:'Medium', mtype:'Elemental',            align:'Chaotic Evil',  pb:2 },
  { name:'Gelatinous Cube', cr:'2', hp:84, ac:6,  speed:15, str:14, dex:3,  con:20, int:1,  wis:6,  cha:1,  size:'Large',  mtype:'Ooze',                 align:'Unaligned',     pb:2 },
  { name:'Ghast',           cr:'2', hp:36, ac:13, speed:30, str:16, dex:17, con:10, int:11, wis:10, cha:8,  size:'Medium', mtype:'Undead',               align:'Chaotic Evil',  pb:2 },
  { name:'Giant Boar',      cr:'2', hp:42, ac:12, speed:40, str:17, dex:10, con:16, int:2,  wis:7,  cha:5,  size:'Large',  mtype:'Beast',                align:'Unaligned',     pb:2 },
  { name:'Giant Constrictor Snake', cr:'2', hp:60, ac:12, speed:30, str:19, dex:14, con:12, int:1, wis:10, cha:3, size:'Huge', mtype:'Beast',            align:'Unaligned',     pb:2 },
  { name:'Nothic',          cr:'2', hp:45, ac:15, speed:30, str:14, dex:16, con:16, int:13, wis:10, cha:8,  size:'Medium', mtype:'Aberration',           align:'Neutral Evil',  pb:2 },
  { name:'Ogre',            cr:'2', hp:59, ac:11, speed:40, str:19, dex:8,  con:16, int:5,  wis:7,  cha:7,  size:'Large',  mtype:'Giant',                align:'Chaotic Evil',  pb:2 },
  { name:'Priest',          cr:'2', hp:27, ac:13, speed:30, str:10, dex:10, con:12, int:13, wis:16, cha:13, size:'Medium', mtype:'Humanoid (any)',       align:'Any',           pb:2, sc:true, sa:'wis', sdc:13, ss:[4,3] },
  { name:'Mimic',           cr:'2', hp:58, ac:12, speed:15, str:17, dex:12, con:15, int:5,  wis:13, cha:8,  size:'Medium', mtype:'Monstrosity',          align:'Neutral',       pb:2 },
  { name:'Pegasus',         cr:'2', hp:59, ac:12, speed:60, str:18, dex:15, con:16, int:10, wis:15, cha:13, size:'Large',  mtype:'Celestial',            align:'Chaotic Good',  pb:2 },
  { name:'Will-o-Wisp',     cr:'2', hp:22, ac:19, speed:0,  str:1,  dex:28, con:10, int:13, wis:14, cha:11, size:'Tiny',   mtype:'Undead',               align:'Chaotic Evil',  pb:2 },
  { name:'Sea Hag',         cr:'2', hp:52, ac:14, speed:30, str:16, dex:13, con:16, int:12, wis:12, cha:7,  size:'Medium', mtype:'Fey',                  align:'Chaotic Evil',  pb:2 },
  // CR 3
  { name:'Basilisk',      cr:'3', hp:52, ac:15, speed:20, str:16, dex:8,  con:15, int:2,  wis:8,  cha:7,  size:'Medium', mtype:'Monstrosity',          align:'Unaligned',    pb:2 },
  { name:'Bearded Devil', cr:'3', hp:52, ac:13, speed:30, str:16, dex:15, con:15, int:9,  wis:11, cha:11, size:'Medium', mtype:'Fiend (devil)',        align:'Lawful Evil',  pb:2, saves:{str:true,con:true,wis:true} },
  { name:'Green Hag',     cr:'3', hp:82, ac:14, speed:30, str:18, dex:12, con:16, int:13, wis:14, cha:14, size:'Medium', mtype:'Fey',                  align:'Neutral Evil', pb:2, sc:true, sa:'cha', sdc:12 },
  { name:'Knight',        cr:'3', hp:52, ac:18, speed:30, str:16, dex:11, con:14, int:11, wis:11, cha:15, size:'Medium', mtype:'Humanoid (any)',       align:'Any',          pb:2, saves:{con:true,wis:true} },
  { name:'Manticore',     cr:'3', hp:68, ac:14, speed:30, str:17, dex:16, con:17, int:7,  wis:12, cha:8,  size:'Large',  mtype:'Monstrosity',          align:'Lawful Evil',  pb:2 },
  { name:'Mummy',         cr:'3', hp:58, ac:11, speed:20, str:16, dex:8,  con:15, int:6,  wis:10, cha:12, size:'Medium', mtype:'Undead',               align:'Lawful Evil',  pb:2, saves:{wis:true} },
  { name:'Phase Spider',  cr:'3', hp:32, ac:13, speed:30, str:15, dex:15, con:12, int:6,  wis:10, cha:6,  size:'Large',  mtype:'Monstrosity',          align:'Unaligned',    pb:2 },
  { name:'Wight',         cr:'3', hp:45, ac:14, speed:30, str:15, dex:14, con:16, int:10, wis:13, cha:15, size:'Medium', mtype:'Undead',               align:'Neutral Evil', pb:2, saves:{str:true,con:true,wis:true} },
  { name:'Winter Wolf',   cr:'3', hp:75, ac:13, speed:50, str:18, dex:13, con:14, int:7,  wis:12, cha:8,  size:'Large',  mtype:'Monstrosity',          align:'Neutral Evil', pb:2 },
  { name:'Veteran',       cr:'3', hp:58, ac:17, speed:30, str:16, dex:13, con:14, int:10, wis:11, cha:10, size:'Medium', mtype:'Humanoid (any)',       align:'Any',          pb:2 },
  { name:'Doppelganger',  cr:'3', hp:52, ac:14, speed:30, str:11, dex:18, con:14, int:11, wis:12, cha:14, size:'Medium', mtype:'Monstrosity',          align:'Neutral',      pb:2 },
  { name:'Werewolf',      cr:'3', hp:58, ac:11, speed:30, str:15, dex:13, con:14, int:10, wis:11, cha:10, size:'Medium', mtype:'Humanoid',             align:'Chaotic Evil', pb:2 },
  { name:'Hobgoblin Captain', cr:'3', hp:52, ac:17, speed:30, str:15, dex:14, con:14, int:12, wis:10, cha:13, size:'Medium', mtype:'Humanoid (goblinoid)', align:'Lawful Evil', pb:2 },
  // CR 4
  { name:'Banshee',       cr:'4', hp:58,  ac:12, speed:0,  str:1,  dex:14, con:10, int:12, wis:11, cha:17, size:'Medium', mtype:'Undead',        align:'Chaotic Evil',   pb:2, saves:{wis:true,cha:true} },
  { name:'Chuul',         cr:'4', hp:93,  ac:16, speed:30, str:19, dex:10, con:16, int:5,  wis:11, cha:5,  size:'Large',  mtype:'Aberration',    align:'Chaotic Evil',   pb:2 },
  { name:'Ettin',         cr:'4', hp:85,  ac:12, speed:40, str:21, dex:8,  con:17, int:6,  wis:10, cha:8,  size:'Large',  mtype:'Giant',         align:'Chaotic Evil',   pb:2 },
  { name:'Ghost',         cr:'4', hp:45,  ac:11, speed:0,  str:7,  dex:13, con:10, int:10, wis:12, cha:17, size:'Medium', mtype:'Undead',        align:'Any',            pb:2, saves:{wis:true} },
  { name:'Elephant',      cr:'4', hp:76,  ac:12, speed:40, str:22, dex:9,  con:17, int:3,  wis:11, cha:6,  size:'Huge',   mtype:'Beast',         align:'Unaligned',      pb:2 },
  { name:'Succubus',      cr:'4', hp:66,  ac:13, speed:30, str:8,  dex:17, con:13, int:15, wis:12, cha:20, size:'Medium', mtype:'Fiend',         align:'Neutral Evil',   pb:2, saves:{wis:true} },
  { name:'Couatl',        cr:'4', hp:97,  ac:19, speed:30, str:16, dex:20, con:17, int:18, wis:20, cha:18, size:'Medium', mtype:'Celestial',     align:'Lawful Good',    pb:2, sc:true, sa:'cha', sdc:14, ss:[4,3,3,2] },
  { name:'Helmed Horror', cr:'4', hp:60,  ac:20, speed:30, str:18, dex:13, con:16, int:10, wis:10, cha:10, size:'Medium', mtype:'Construct',     align:'Neutral',        pb:2, saves:{wis:true} },
  // CR 5
  { name:'Air Elemental',    cr:'5', hp:90,  ac:15, speed:0,  str:14, dex:20, con:14, int:6,  wis:10, cha:6,  size:'Large',      mtype:'Elemental',  align:'Neutral',      pb:3 },
  { name:'Earth Elemental',  cr:'5', hp:126, ac:17, speed:30, str:20, dex:8,  con:20, int:5,  wis:10, cha:5,  size:'Large',      mtype:'Elemental',  align:'Neutral',      pb:3 },
  { name:'Fire Elemental',   cr:'5', hp:102, ac:13, speed:50, str:10, dex:17, con:16, int:6,  wis:10, cha:7,  size:'Large',      mtype:'Elemental',  align:'Neutral',      pb:3 },
  { name:'Water Elemental',  cr:'5', hp:114, ac:14, speed:30, str:18, dex:14, con:18, int:5,  wis:10, cha:8,  size:'Large',      mtype:'Elemental',  align:'Neutral',      pb:3 },
  { name:'Barbed Devil',     cr:'5', hp:110, ac:15, speed:30, str:16, dex:17, con:18, int:12, wis:14, cha:14, size:'Medium',     mtype:'Fiend (devil)', align:'Lawful Evil', pb:3, saves:{str:true,con:true,wis:true,cha:true} },
  { name:'Hill Giant',       cr:'5', hp:105, ac:13, speed:40, str:21, dex:8,  con:19, int:5,  wis:9,  cha:6,  size:'Huge',       mtype:'Giant',      align:'Chaotic Evil', pb:3 },
  { name:'Revenant',         cr:'5', hp:136, ac:13, speed:30, str:18, dex:11, con:20, int:13, wis:16, cha:18, size:'Medium',     mtype:'Undead',     align:'Neutral',      pb:3, saves:{str:true,con:true,wis:true,cha:true} },
  { name:'Shambling Mound',  cr:'5', hp:136, ac:15, speed:20, str:18, dex:8,  con:16, int:5,  wis:10, cha:5,  size:'Large',      mtype:'Plant',      align:'Unaligned',    pb:3 },
  { name:'Troll',            cr:'5', hp:84,  ac:15, speed:30, str:18, dex:13, con:20, int:7,  wis:9,  cha:7,  size:'Large',      mtype:'Giant',      align:'Chaotic Evil', pb:3 },
  { name:'Vampire Spawn',    cr:'5', hp:82,  ac:15, speed:30, str:16, dex:16, con:16, int:11, wis:10, cha:12, size:'Medium',     mtype:'Undead',     align:'Neutral Evil', pb:3, saves:{dex:true,wis:true} },
  { name:'Wraith',           cr:'5', hp:67,  ac:13, speed:0,  str:6,  dex:16, con:16, int:12, wis:14, cha:15, size:'Medium',     mtype:'Undead',     align:'Neutral Evil', pb:3 },
  { name:'Flesh Golem',      cr:'5', hp:93,  ac:9,  speed:30, str:19, dex:9,  con:18, int:6,  wis:10, cha:5,  size:'Medium',     mtype:'Construct',  align:'Neutral',      pb:3 },
  { name:'Gladiator',        cr:'5', hp:112, ac:16, speed:30, str:20, dex:15, con:14, int:10, wis:12, cha:15, size:'Medium',     mtype:'Humanoid (any)', align:'Any',      pb:3, saves:{str:true,dex:true,con:true} },
  { name:'Giant Crocodile',  cr:'5', hp:114, ac:14, speed:30, str:21, dex:9,  con:17, int:2,  wis:10, cha:7,  size:'Huge',       mtype:'Beast',      align:'Unaligned',    pb:3 },
  { name:'Unicorn',          cr:'5', hp:67,  ac:12, speed:50, str:18, dex:14, con:15, int:11, wis:17, cha:16, size:'Large',      mtype:'Celestial',  align:'Lawful Good',  pb:3 },
  { name:'Beholder Zombie',  cr:'5', hp:93,  ac:15, speed:0,  str:10, dex:8,  con:16, int:3,  wis:8,  cha:5,  size:'Large',      mtype:'Undead',     align:'Neutral Evil', pb:3 },
  { name:'Giant Shark',      cr:'5', hp:126, ac:13, speed:0,  str:23, dex:11, con:21, int:1,  wis:10, cha:5,  size:'Huge',       mtype:'Beast',      align:'Unaligned',    pb:3 },
  // CR 6
  { name:'Medusa',              cr:'6', hp:127, ac:15, speed:30, str:10, dex:15, con:16, int:12, wis:13, cha:15, size:'Medium', mtype:'Monstrosity',         align:'Lawful Evil',  pb:3, saves:{dex:true,wis:true} },
  { name:'Vrock',               cr:'6', hp:104, ac:15, speed:40, str:17, dex:15, con:18, int:8,  wis:13, cha:8,  size:'Large',  mtype:'Fiend (demon)',       align:'Chaotic Evil', pb:3, saves:{dex:true,wis:true,cha:true} },
  { name:'Mage',                cr:'6', hp:40,  ac:12, speed:30, str:9,  dex:14, con:11, int:17, wis:12, cha:11, size:'Medium', mtype:'Humanoid (any)',      align:'Any',          pb:3, sc:true, sa:'int', sdc:14, ss:[4,3,3,1] },
  { name:'Chimera',             cr:'6', hp:114, ac:14, speed:30, str:19, dex:11, con:19, int:3,  wis:14, cha:10, size:'Large',  mtype:'Monstrosity',         align:'Chaotic Evil', pb:3 },
  { name:'Hobgoblin Warlord',   cr:'6', hp:97,  ac:20, speed:30, str:16, dex:14, con:16, int:14, wis:11, cha:15, size:'Medium', mtype:'Humanoid (goblinoid)',align:'Lawful Evil',  pb:3, saves:{int:true,wis:true,cha:true} },
  { name:'Young White Dragon',  cr:'6', hp:133, ac:17, speed:40, str:18, dex:10, con:18, int:6,  wis:11, cha:12, size:'Large',  mtype:'Dragon',              align:'Chaotic Evil', pb:3, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  { name:'Invisible Stalker',   cr:'6', hp:104, ac:14, speed:50, str:16, dex:19, con:14, int:10, wis:15, cha:11, size:'Medium', mtype:'Elemental',           align:'Neutral',      pb:3 },
  // CR 7
  { name:'Stone Giant',         cr:'7', hp:126, ac:17, speed:40, str:23, dex:15, con:20, int:10, wis:12, cha:9,  size:'Huge',   mtype:'Giant',       align:'Neutral',      pb:3, saves:{dex:true,con:true,wis:true} },
  { name:'Young Black Dragon',  cr:'7', hp:127, ac:18, speed:40, str:19, dex:14, con:17, int:12, wis:11, cha:15, size:'Large',  mtype:'Dragon',      align:'Chaotic Evil', pb:3, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  { name:'Shield Guardian',     cr:'7', hp:142, ac:17, speed:30, str:18, dex:8,  con:18, int:7,  wis:10, cha:3,  size:'Large',  mtype:'Construct',   align:'Unaligned',    pb:3 },
  { name:'Yuan-ti Abomination', cr:'7', hp:127, ac:15, speed:40, str:19, dex:16, con:19, int:17, wis:15, cha:18, size:'Large',  mtype:'Monstrosity', align:'Neutral Evil', pb:3, saves:{str:true,con:true,wis:true,cha:true}, sc:true, sa:'cha', sdc:14 },
  { name:'Mind Flayer',         cr:'7', hp:71,  ac:15, speed:30, str:11, dex:12, con:12, int:19, wis:17, cha:17, size:'Medium', mtype:'Aberration',  align:'Lawful Evil',  pb:3, saves:{int:true,wis:true,cha:true}, sc:true, sa:'int', sdc:15, ss:[4,3,3,3,2] },
  // CR 8
  { name:'Frost Giant',         cr:'8', hp:138, ac:15, speed:40, str:23, dex:9,  con:21, int:9,  wis:10, cha:12, size:'Huge',  mtype:'Giant',       align:'Neutral Evil', pb:3, saves:{con:true,wis:true,cha:true} },
  { name:'Hezrou',              cr:'8', hp:136, ac:16, speed:30, str:19, dex:17, con:20, int:5,  wis:12, cha:13, size:'Large', mtype:'Fiend (demon)',align:'Chaotic Evil', pb:3, saves:{str:true,con:true,wis:true} },
  { name:'Hydra',               cr:'8', hp:172, ac:15, speed:30, str:20, dex:12, con:20, int:2,  wis:10, cha:7,  size:'Huge',  mtype:'Monstrosity', align:'Unaligned',    pb:3 },
  { name:'Young Green Dragon',  cr:'8', hp:136, ac:18, speed:40, str:19, dex:12, con:17, int:16, wis:13, cha:15, size:'Large', mtype:'Dragon',      align:'Lawful Evil',  pb:3, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  { name:'Tyrannosaurus Rex',   cr:'8', hp:136, ac:13, speed:50, str:25, dex:10, con:19, int:2,  wis:12, cha:9,  size:'Huge',  mtype:'Beast',       align:'Unaligned',    pb:3 },
  // CR 9
  { name:'Fire Giant',         cr:'9', hp:162, ac:18, speed:30, str:25, dex:9,  con:23, int:10, wis:14, cha:13, size:'Huge',  mtype:'Giant',       align:'Lawful Evil',  pb:4, saves:{dex:true,con:true,wis:true} },
  { name:'Bone Devil',         cr:'9', hp:142, ac:19, speed:40, str:18, dex:16, con:18, int:13, wis:14, cha:16, size:'Large', mtype:'Fiend (devil)',align:'Lawful Evil',  pb:4, saves:{int:true,wis:true,cha:true} },
  { name:'Cloud Giant',        cr:'9', hp:200, ac:14, speed:40, str:27, dex:10, con:22, int:12, wis:16, cha:16, size:'Huge',  mtype:'Giant',       align:'Neutral Good', pb:4, saves:{con:true,wis:true,cha:true} },
  { name:'Young Blue Dragon',  cr:'9', hp:152, ac:18, speed:40, str:21, dex:10, con:19, int:14, wis:13, cha:17, size:'Large', mtype:'Dragon',      align:'Lawful Evil',  pb:4, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  // CR 10
  { name:'Stone Golem',        cr:'10', hp:178, ac:17, speed:30, str:22, dex:9,  con:20, int:3,  wis:11, cha:1,  size:'Large',  mtype:'Construct',  align:'Unaligned',    pb:4 },
  { name:'Young Red Dragon',   cr:'10', hp:178, ac:18, speed:40, str:23, dex:10, con:21, int:14, wis:11, cha:19, size:'Large',  mtype:'Dragon',     align:'Chaotic Evil', pb:4, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  // CR 11
  { name:'Djinni',        cr:'11', hp:161, ac:17, speed:30, str:21, dex:15, con:22, int:15, wis:16, cha:20, size:'Large',  mtype:'Elemental',   align:'Chaotic Good', pb:4, saves:{dex:true,wis:true,cha:true}, sc:true, sa:'cha', sdc:17 },
  { name:'Efreeti',       cr:'11', hp:200, ac:17, speed:40, str:22, dex:12, con:24, int:16, wis:15, cha:16, size:'Large',  mtype:'Elemental',   align:'Lawful Evil',  pb:4, saves:{int:true,wis:true,cha:true}, sc:true, sa:'cha', sdc:17 },
  { name:'Horned Devil',  cr:'11', hp:178, ac:18, speed:20, str:22, dex:17, con:21, int:12, wis:16, cha:17, size:'Large',  mtype:'Fiend (devil)',align:'Lawful Evil',  pb:4, saves:{str:true,dex:true,wis:true,cha:true} },
  { name:'Roc',           cr:'11', hp:248, ac:15, speed:20, str:28, dex:10, con:20, int:3,  wis:10, cha:9,  size:'Gargantuan', mtype:'Beast',     align:'Unaligned',    pb:4, saves:{dex:true,con:true,wis:true} },
  // CR 12
  { name:'Archmage',          cr:'12', hp:99,  ac:12, speed:30, str:10, dex:14, con:12, int:20, wis:15, cha:16, size:'Medium', mtype:'Humanoid (any)',align:'Any',       pb:4, sc:true, sa:'int', sdc:17, ss:[4,3,3,3,3,1,1] },
  { name:'Adult White Dragon',cr:'13', hp:200, ac:18, speed:40, str:22, dex:10, con:22, int:8,  wis:12, cha:12, size:'Huge',   mtype:'Dragon',      align:'Chaotic Evil',pb:5, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  // CR 13+
  { name:'Vampire',            cr:'13', hp:144, ac:16, speed:30, str:18, dex:18, con:18, int:17, wis:15, cha:18, size:'Medium',    mtype:'Undead',        align:'Neutral Evil', pb:5, saves:{dex:true,wis:true,cha:true}, leg:3, sc:true, sa:'cha', sdc:17 },
  { name:'Nalfeshnee',         cr:'13', hp:184, ac:18, speed:20, str:21, dex:10, con:22, int:19, wis:12, cha:15, size:'Large',     mtype:'Fiend (demon)', align:'Chaotic Evil', pb:5, saves:{con:true,int:true,wis:true,cha:true} },
  { name:'Storm Giant',        cr:'13', hp:230, ac:16, speed:50, str:29, dex:14, con:20, int:16, wis:18, cha:18, size:'Huge',      mtype:'Giant',         align:'Chaotic Good', pb:5, saves:{str:true,con:true,wis:true,cha:true}, sc:true, sa:'cha', sdc:17 },
  { name:'Adult Black Dragon', cr:'14', hp:195, ac:19, speed:40, str:23, dex:14, con:21, int:14, wis:13, cha:17, size:'Huge',      mtype:'Dragon',        align:'Chaotic Evil', pb:5, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  { name:'Ice Devil',          cr:'14', hp:180, ac:18, speed:40, str:21, dex:14, con:18, int:18, wis:15, cha:18, size:'Large',     mtype:'Fiend (devil)', align:'Lawful Evil',  pb:5, saves:{dex:true,con:true,wis:true,cha:true} },
  { name:'Adult Green Dragon', cr:'15', hp:207, ac:19, speed:40, str:23, dex:12, con:21, int:18, wis:15, cha:17, size:'Huge',      mtype:'Dragon',        align:'Lawful Evil',  pb:5, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  { name:'Purple Worm',        cr:'15', hp:247, ac:18, speed:50, str:28, dex:7,  con:22, int:1,  wis:8,  cha:4,  size:'Gargantuan',mtype:'Monstrosity',   align:'Unaligned',    pb:5 },
  { name:'Adult Blue Dragon',  cr:'16', hp:225, ac:19, speed:40, str:25, dex:10, con:23, int:16, wis:15, cha:19, size:'Huge',      mtype:'Dragon',        align:'Lawful Evil',  pb:5, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  { name:'Iron Golem',         cr:'16', hp:210, ac:20, speed:30, str:24, dex:9,  con:20, int:3,  wis:11, cha:1,  size:'Large',     mtype:'Construct',     align:'Unaligned',    pb:5 },
  { name:'Marilith',           cr:'16', hp:189, ac:18, speed:40, str:18, dex:20, con:20, int:18, wis:16, cha:20, size:'Large',     mtype:'Fiend (demon)', align:'Chaotic Evil', pb:5, saves:{str:true,con:true,wis:true,cha:true}, leg:3 },
  { name:'Adult Red Dragon',   cr:'17', hp:256, ac:19, speed:40, str:27, dex:10, con:25, int:16, wis:13, cha:21, size:'Huge',      mtype:'Dragon',        align:'Chaotic Evil', pb:6, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  { name:'Death Knight',       cr:'17', hp:180, ac:20, speed:30, str:20, dex:11, con:20, int:12, wis:16, cha:18, size:'Medium',    mtype:'Undead',        align:'Chaotic Evil', pb:6, saves:{dex:true,wis:true,cha:true}, sc:true, sa:'cha', sdc:18, ss:[4,3,3,3,2,1] },
  { name:'Balor',              cr:'19', hp:262, ac:19, speed:40, str:26, dex:15, con:22, int:20, wis:16, cha:22, size:'Huge',      mtype:'Fiend (demon)', align:'Chaotic Evil', pb:6, saves:{str:true,con:true,wis:true,cha:true} },
  { name:'Pit Fiend',          cr:'20', hp:300, ac:19, speed:30, str:26, dex:14, con:24, int:22, wis:18, cha:24, size:'Large',     mtype:'Fiend (devil)', align:'Lawful Evil',  pb:6, saves:{dex:true,con:true,wis:true,cha:true}, leg:3, sc:true, sa:'wis', sdc:21 },
  { name:'Lich',               cr:'21', hp:135, ac:17, speed:30, str:11, dex:16, con:16, int:20, wis:14, cha:16, size:'Medium',    mtype:'Undead',        align:'Any Evil',     pb:7, saves:{con:true,int:true,wis:true}, leg:3, sc:true, sa:'int', sdc:20, ss:[4,3,3,3,3,1,1,1,1] },
  { name:'Ancient Black Dragon',cr:'21',hp:367, ac:22, speed:40, str:27, dex:14, con:25, int:16, wis:15, cha:19, size:'Gargantuan',mtype:'Dragon',        align:'Chaotic Evil', pb:7, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
  { name:'Kraken',             cr:'23', hp:472, ac:18, speed:20, str:30, dex:11, con:25, int:22, wis:18, cha:20, size:'Gargantuan',mtype:'Monstrosity',   align:'Chaotic Evil', pb:7, saves:{str:true,dex:true,con:true,int:true,wis:true}, leg:3 },
  { name:'Ancient Red Dragon', cr:'24', hp:546, ac:22, speed:40, str:30, dex:10, con:29, int:18, wis:15, cha:23, size:'Gargantuan',mtype:'Dragon',        align:'Chaotic Evil', pb:7, saves:{dex:true,con:true,wis:true,cha:true}, leg:3 },
]

export function createSRDCreature(raw: SRDEntry): Partial<Creature> {
  const spellSlots: Record<number, {max: number; used: number}> = {
    1:{max:0,used:0}, 2:{max:0,used:0}, 3:{max:0,used:0},
    4:{max:0,used:0}, 5:{max:0,used:0}, 6:{max:0,used:0},
    7:{max:0,used:0}, 8:{max:0,used:0}, 9:{max:0,used:0},
  }
  if (raw.ss) raw.ss.forEach((n, i) => { spellSlots[i + 1] = {max: n, used: 0} })

  return {
    name: raw.name,
    type: 'monster',
    cr: raw.cr,
    maxHP: raw.hp,
    currentHP: raw.hp,
    ac: raw.ac,
    speed: raw.speed,
    str: raw.str, dex: raw.dex, con: raw.con,
    int: raw.int, wis: raw.wis, cha: raw.cha,
    proficiencyBonus: raw.pb,
    initiativeBonus: Math.floor((raw.dex - 10) / 2),
    creatureSize: raw.size,
    monsterType: raw.mtype,
    alignment: raw.align,
    savingThrowProf: {
      str: raw.saves?.str ?? false,
      dex: raw.saves?.dex ?? false,
      con: raw.saves?.con ?? false,
      int: raw.saves?.int ?? false,
      wis: raw.saves?.wis ?? false,
      cha: raw.saves?.cha ?? false,
    },
    isSpellcaster: raw.sc ?? false,
    spellcastingAbility: raw.sa ?? 'int',
    spellDC: raw.sdc ?? 10,
    spellSlots,
    legendaryActionsMax: raw.leg ?? 0,
  }
}

// Unique monster types for filtering
export const SRD_TYPES = [
  'Aberration','Beast','Celestial','Construct','Dragon',
  'Elemental','Fey','Fiend','Giant','Humanoid',
  'Monstrosity','Ooze','Plant','Undead',
]

export function crSortKey(cr: string): number {
  if (cr === '0') return 0
  if (cr === '1/8') return 0.125
  if (cr === '1/4') return 0.25
  if (cr === '1/2') return 0.5
  return parseFloat(cr)
}
