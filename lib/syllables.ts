// Advanced syllable counting algorithm
const SYLLABLE_EXCEPTIONS: Record<string, number> = {
  // Common exceptions
  the: 1,
  area: 3,
  idea: 3,
  real: 1,
  feel: 1,
  really: 2,
  usually: 4,
  beautiful: 3,
  different: 3,
  interesting: 4,
  important: 3,
  everything: 4,
  sometimes: 2,
  always: 2,
  being: 2,
  seeing: 2,
  doing: 2,
  going: 2,
  having: 2,
  taking: 2,
  fire: 2,
  desire: 3,
  higher: 2,
  liar: 2,
  tired: 2,
  wired: 2,
  inspired: 3,
  required: 3,
  every: 2,
  memory: 3,
  history: 3,
  mystery: 3,
  family: 3,
  basically: 4,
  actually: 4,
  diamond: 2,
  quiet: 2,
  riot: 2,
  diet: 2,
  lion: 2,
  science: 2,
  violence: 3,
  silence: 2,
  poem: 2,
  poet: 2,
  poetry: 3,
  heaven: 2,
  seven: 2,
  eleven: 3,
  hour: 1,
  our: 1,
  power: 2,
  tower: 2,
  flower: 2,
  shower: 2,
  coward: 2,
  world: 1,
  girl: 1,
  pearl: 1,
  swirl: 1,
  love: 1,
  above: 2,
  glove: 1,
  shove: 1,
  dove: 1,
  come: 1,
  some: 1,
  none: 1,
  done: 1,
  gone: 1,
  one: 1,
  won: 1,
  son: 1,
  sun: 1,
  run: 1,
  fun: 1,
  ocean: 2,
  motion: 2,
  emotion: 3,
  devotion: 3,
  nation: 2,
  station: 2,
  creation: 3,
  relation: 3,
  people: 2,
  little: 2,
  middle: 2,
  simple: 2,
  single: 2,
  double: 2,
  trouble: 2,
  couple: 2,
  purple: 2,
  circle: 2,
  miracle: 3,
  able: 2,
  table: 2,
  stable: 2,
  cable: 2,
  angel: 2,
  danger: 2,
  stranger: 2,
  anger: 2,
  finger: 2,
  singer: 2,
  linger: 2,
  hunger: 2,
  longer: 2,
  stronger: 2,
  younger: 2,
  water: 2,
  daughter: 2,
  slaughter: 2,
  after: 2,
  laughter: 2,
  master: 2,
  faster: 2,
  chapter: 2,
  rapture: 2,
  capture: 2,
  picture: 2,
  mixture: 2,
  texture: 2,
  future: 2,
  nature: 2,
  creature: 2,
  feature: 2,
  measure: 2,
  pleasure: 2,
  treasure: 2,
  leisure: 2,
  pressure: 2,
  special: 2,
  social: 2,
  facial: 2,
  racial: 2,
  ancient: 2,
  patient: 2,
  certain: 2,
  curtain: 2,
  mountain: 2,
  fountain: 2,
  captain: 2,
  Britain: 2,
  hidden: 2,
  forbidden: 3,
  sudden: 2,
  wooden: 2,
  golden: 2,
  olden: 2,
  garden: 2,
  burden: 2,
  heaven: 2,
  given: 2,
  driven: 2,
  forgiven: 3,
  broken: 2,
  spoken: 2,
  woken: 2,
  token: 2,
  chosen: 2,
  frozen: 2,
  listen: 2,
  glisten: 2,
  christen: 2,
  often: 2,
  soften: 2,
  rhythm: 2,
  system: 2,
  symptom: 2,
  custom: 2,
  phantom: 2,
  random: 2,
  freedom: 2,
  kingdom: 2,
  boredom: 2,
  wisdom: 2,
  awesome: 2,
  handsome: 2,
  lonesome: 2,
  welcome: 2,
  problem: 2,
  emblem: 2,
  album: 2,
  column: 2,
  item: 2,
  atom: 2,
  bottom: 2,
  cotton: 2,
  button: 2,
  mutton: 2,
  lesson: 2,
  session: 2,
  mission: 2,
  vision: 2,
  passion: 2,
  fashion: 2,
  nation: 2,
  station: 2,
  question: 2,
  mention: 2,
  tension: 2,
  pension: 2,
  dimension: 3,
  attention: 3,
  intention: 3,
  direction: 3,
  connection: 3,
  protection: 3,
  collection: 3,
  selection: 3,
  reflection: 3,
  infection: 3,
  perfection: 3,
  affection: 3,
  election: 3,
  correction: 3,
  action: 2,
  fraction: 2,
  traction: 2,
  reaction: 3,
  attraction: 3,
  distraction: 3,
  satisfaction: 4,
  reason: 2,
  season: 2,
  treason: 2,
  person: 2,
  version: 2,
  lesson: 2,
  blossom: 2,
  possum: 2,
  prison: 2,
  poison: 2,
  cousin: 2,
  dozen: 2,
  raisin: 2,
  basin: 2,
  crimson: 2,
  horizon: 3,
  comparison: 4,
  garrison: 3,
  arson: 2,
  parson: 2,
  mason: 2,
  jason: 2,
  imagine: 3,
  magazine: 3,
  engine: 2,
  penguin: 2,
  origin: 3,
  margin: 2,
  virgin: 2,
  cabin: 2,
  robin: 2,
  latin: 2,
  satin: 2,
  atin: 2,
  captain: 2,
  certain: 2,
  maintain: 2,
  contain: 2,
  obtain: 2,
  retain: 2,
  remain: 2,
  explain: 2,
  complain: 2,
  refrain: 2,
  restrain: 2,
  constrain: 2,
  rain: 1,
  pain: 1,
  gain: 1,
  brain: 1,
  train: 1,
  chain: 1,
  main: 1,
  plain: 1,
  drain: 1,
  strain: 1,
  again: 2,
  against: 2,
  champagne: 2,
  cocaine: 2,
  membrane: 2,
  insane: 2,
  humane: 2,
  arcane: 2,
  profane: 2,
  mundane: 2,
  urbane: 2,
  hurricane: 3,
  cellophane: 3,
  windowpane: 3,
  aeroplane: 3,
  hydroplane: 3,
}

const SUFFIX_SYLLABLES: [RegExp, number][] = [
  [/tion$/, 1],
  [/sion$/, 1],
  [/cian$/, 1],
  [/ious$/, 2],
  [/eous$/, 2],
  [/uous$/, 2],
  [/ia$/, 2],
  [/io$/, 2],
  [/ium$/, 2],
  [/ius$/, 2],
  [/ual$/, 2],
  [/ually$/, 3],
  [/ious$/, 2],
  [/eous$/, 2],
]

export function countSyllables(word: string): number {
  // Clean the word
  word = word
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .trim()

  if (word.length === 0) return 0
  if (word.length <= 2) return 1

  // Check exceptions first
  if (SYLLABLE_EXCEPTIONS[word]) {
    return SYLLABLE_EXCEPTIONS[word]
  }

  const vowels = "aeiouy"
  let count = 0
  let prevWasVowel = false

  // Count vowel groups
  for (let i = 0; i < word.length; i++) {
    const char = word[i]
    const isVowel = vowels.includes(char)

    if (isVowel && !prevWasVowel) {
      count++
    }
    prevWasVowel = isVowel
  }

  // Adjust for silent e
  if (word.endsWith("e") && !word.endsWith("le") && count > 1) {
    count--
  }

  // Adjust for -ed endings
  if (word.endsWith("ed") && !word.endsWith("ted") && !word.endsWith("ded") && count > 1) {
    count--
  }

  // Adjust for -es endings
  if (
    word.endsWith("es") &&
    !word.endsWith("ses") &&
    !word.endsWith("zes") &&
    !word.endsWith("xes") &&
    !word.endsWith("ches") &&
    !word.endsWith("shes") &&
    count > 1
  ) {
    count--
  }

  // Handle -le endings (bottle, apple, etc.)
  if (word.endsWith("le") && word.length > 2 && !vowels.includes(word[word.length - 3])) {
    count++
  }

  // Ensure minimum of 1 syllable
  return Math.max(count, 1)
}

export function countLineSyllables(line: string): number {
  // Skip section labels
  if (/^\[.*\]$/.test(line.trim())) return 0

  const words = line
    .replace(/[^\w\s'-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0)

  return words.reduce((sum, word) => sum + countSyllables(word), 0)
}

export function getStats(content: string) {
  const lines = content.split("\n")
  const totalSyllables = lines.reduce((sum, line) => sum + countLineSyllables(line), 0)
  const words = content
    .replace(/[^\w\s'-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0).length
  const lineCount = lines.length
  const bars = Math.ceil(lineCount / 4)
  const estimatedDuration = Math.round(bars * 1.5) // ~1.5 seconds per bar

  return {
    syllables: totalSyllables,
    words,
    lines: lineCount,
    bars,
    duration: `~${Math.floor(estimatedDuration / 60)}:${String(estimatedDuration % 60).padStart(2, "0")}`,
  }
}

export function getCurrentWord(text: string, cursorPos: number): string {
  const before = text.slice(0, cursorPos)
  const after = text.slice(cursorPos)

  const wordStartMatch = before.match(/[\w'-]+$/)
  const wordEndMatch = after.match(/^[\w'-]+/)

  const wordStart = wordStartMatch ? wordStartMatch[0] : ""
  const wordEnd = wordEndMatch ? wordEndMatch[0] : ""

  return (wordStart + wordEnd).toLowerCase()
}
