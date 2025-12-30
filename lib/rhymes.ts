// Rhyme finding utilities using Datamuse API
export interface RhymeResult {
  word: string
  score: number
  syllables: number
}

export async function findRhymes(word: string): Promise<{ perfect: RhymeResult[]; near: RhymeResult[] }> {
  if (!word || word.length < 2) {
    return { perfect: [], near: [] }
  }

  try {
    const [perfectRes, nearRes] = await Promise.all([
      fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}&max=20`),
      fetch(`https://api.datamuse.com/words?rel_nry=${encodeURIComponent(word)}&max=15`),
    ])

    const perfectData = await perfectRes.json()
    const nearData = await nearRes.json()

    const countSyl = (w: string) => {
      const vowels = "aeiouy"
      let count = 0
      let prev = false
      for (const c of w.toLowerCase()) {
        const isV = vowels.includes(c)
        if (isV && !prev) count++
        prev = isV
      }
      if (w.endsWith("e") && count > 1) count--
      return Math.max(count, 1)
    }

    return {
      perfect: perfectData.map((r: { word: string; score: number }) => ({
        word: r.word,
        score: r.score,
        syllables: countSyl(r.word),
      })),
      near: nearData.map((r: { word: string; score: number }) => ({
        word: r.word,
        score: r.score,
        syllables: countSyl(r.word),
      })),
    }
  } catch {
    return { perfect: [], near: [] }
  }
}

export async function findSynonyms(word: string): Promise<RhymeResult[]> {
  if (!word || word.length < 2) return []

  try {
    const res = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=15`)
    const data = await res.json()

    const countSyl = (w: string) => {
      const vowels = "aeiouy"
      let count = 0
      let prev = false
      for (const c of w.toLowerCase()) {
        const isV = vowels.includes(c)
        if (isV && !prev) count++
        prev = isV
      }
      if (w.endsWith("e") && count > 1) count--
      return Math.max(count, 1)
    }

    return data.map((r: { word: string; score: number }) => ({
      word: r.word,
      score: r.score,
      syllables: countSyl(r.word),
    }))
  } catch {
    return []
  }
}
