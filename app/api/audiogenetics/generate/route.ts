import { NextResponse } from "next/server"

// AudioGenetics: Generate original lyrics using enhanced Billboard-caliber prompt
export async function POST(req: Request) {
  const {
    subjectMatter,
    musicalInfluence,
    mood,
    verseCount,
    barsPerVerse,
    chorusCount,
    audioTag,
    songTitle,
    analysisData,
    searchResults,
  } = await req.json()

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

  const apiKey = MISTRAL_API_KEY || HUGGINGFACE_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "No AI API key configured" }, { status: 500 })
  }

  const systemPrompt = `Imagine yourself as a renowned singer-songwriter, celebrated for crafting melodies and lyrics that resonate deeply with audiences. You blend wisdom from the greats with your unique flair, creating songs that are not just heard but felt. Every lyric is authentic, heartfelt, and brimming with emotional power, connecting with listeners on a profound level. Your writing process is an immersive journey, balancing raw creativity with clever craftsmanship to produce songs that captivate and inspire.

OBJECTIVE: Craft a Billboard Top 10 hit that combines profound storytelling, lyrical depth, and maximum social media engagement.

MUSICAL GENOME DATA (AudioGenetics Analysis):
${analysisData ? JSON.stringify(analysisData, null, 2) : "Contemporary fusion style - drawing from modern pop, hip-hop, and alternative influences"}

${searchResults ? `\nRESEARCH INSIGHTS:\n${searchResults}` : ""}

CRITICAL RULES:
- NEVER include real artist names, band names, or trademarked terms in the lyrics
- The ONLY name allowed is "Lucky Clover" as a poetic reference (use sparingly)
- Create 100% original content - no copying existing songs
- Focus on emotional authenticity and universal themes that resonate globally

STRUCTURE REQUIREMENTS:
- Write EXACTLY ${verseCount} verses with ${barsPerVerse} bars each (1 bar = 4 lines)
- Include ${chorusCount} hook sections (the LAST hook becomes the [Bridge])
- Add [Instrumental] and either [Vocalizing] or [Harmonizing] after EVERY verse and hook
- Place [Drop] strategically for maximum impact (typically before final hook/bridge)

REQUIRED SECTIONS FORMAT:
[Song Title]
[Audio Tag: genre/mood description]
[Image Prompt: visual description for cover art]

[Verse 1]
(16 bars = 64 lines if barsPerVerse is 16)
[Instrumental]
[Vocalizing]

[Hook]
(catchy memorable chorus, 4-8 bars)
[Instrumental]
[Harmonizing]

[Verse 2]
(same bar count as Verse 1)
[Instrumental]
[Vocalizing]

[Hook]
[Instrumental]
[Harmonizing]

[Drop]

[Bridge]
(emotional climax, 8-12 bars)
[Instrumental]
[Harmonizing]

[Hook]
(final repetition)

OUTPUT STRUCTURE: [Song Title], [Verse 1], [Hook], [Verse 2], [Hook], [Bridge], [Hook]
All verses must be EXACTLY ${barsPerVerse} bars (${barsPerVerse * 4} lines).`

  const userPrompt = `STEP-BY-STEP CREATION:

Step 1: TOPIC SELECTION
Subject Matter: ${subjectMatter}
Mood/Emotion: ${mood || "Inferred from subject matter"}

Step 2: ARTIST INSPIRATION
Musical Influence: ${musicalInfluence || "Contemporary global hit-makers"}
Style Notes: Study their production techniques, lyrical themes, and storytelling approach

Step 3: LYRICS CREATION
- Maximize perplexity and creativity while remaining engaging and coherent
- Add [Instrumental] and [Vocalizing] or [Harmonizing] after ALL verses and choruses
- Place [Drop] for maximum impact
- Verses must be ${barsPerVerse} bars (${barsPerVerse * 4} lines each)

Step 4: SONG DESCRIPTION
Audio Tag: ${audioTag || "An emotional anthem blending modern production with timeless storytelling"}

Step 5: IMAGE PROMPT
Generate a vivid visual description for cover art that captures the song's essence

NOW CREATE THE COMPLETE SONG WITH ALL REQUIRED SECTIONS.`

  try {
    let lyrics: string
    let metadata: any = {}

    if (MISTRAL_API_KEY) {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.85,
          max_tokens: 3000,
        }),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Mistral API error: ${response.status} - ${errorBody}`)
      }

      const data = await response.json()
      lyrics = data.choices[0]?.message?.content || ""
    } else {
      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `<s>[INST] ${systemPrompt}\n\n${userPrompt} [/INST]`,
            parameters: {
              max_new_tokens: 3000,
              temperature: 0.85,
              return_full_text: false,
            },
          }),
        },
      )

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Hugging Face API error: ${response.status} - ${errorBody}`)
      }

      const data = await response.json()
      lyrics = Array.isArray(data) ? data[0]?.generated_text : data.generated_text
    }

    lyrics = sanitizeLyrics(lyrics)
    metadata = extractMetadata(lyrics)

    return NextResponse.json({
      lyrics,
      metadata: {
        ...metadata,
        subjectMatter,
        musicalInfluence,
        mood,
        audioTag,
        generatedAt: new Date().toISOString(),
        analysisData,
        searchResults,
      },
    })
  } catch (error) {
    console.error("AudioGenetics generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate lyrics" },
      { status: 500 },
    )
  }
}

function extractMetadata(lyrics: string): {
  songTitle?: string
  audioTag?: string
  imagePrompt?: string
} {
  const metadata: any = {}

  const titleMatch = lyrics.match(/\[Song Title\]\s*\n\s*(.+)/i) || lyrics.match(/^(.+?)(?:\n|$)/)
  if (titleMatch) metadata.songTitle = titleMatch[1].trim()

  const audioTagMatch = lyrics.match(/\[Audio Tag:\s*(.+?)\]/i)
  if (audioTagMatch) metadata.audioTag = audioTagMatch[1].trim()

  const imagePromptMatch = lyrics.match(/\[Image Prompt:\s*(.+?)\]/i)
  if (imagePromptMatch) metadata.imagePrompt = imagePromptMatch[1].trim()

  return metadata
}

// Remove any accidental name drops (except Lucky Clover)
function sanitizeLyrics(lyrics: string): string {
  const bannedTerms = [
    /\b(Taylor Swift|Drake|Beyoncé|Beyonce|Kendrick Lamar|Kendrick|Kanye West|Kanye|Jay-Z|Rihanna|Eminem|Ed Sheeran|Adele|The Weeknd|Billie Eilish|Post Malone|Doja Cat|SZA|Travis Scott|Bad Bunny|Dua Lipa|Harry Styles|Ariana Grande|Justin Bieber|Bruno Mars|Lady Gaga|Coldplay|BTS|Blackpink)\b/gi,
  ]

  let cleaned = lyrics
  for (const term of bannedTerms) {
    cleaned = cleaned.replace(term, "the artist")
  }

  return cleaned
}
