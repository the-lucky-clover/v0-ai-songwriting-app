import { NextResponse } from "next/server"

// AudioGenetics: Generate original lyrics using Mistral AI
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
  } = await req.json()

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

  // Try Mistral first, fall back to Hugging Face
  const apiKey = MISTRAL_API_KEY || HUGGINGFACE_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "No AI API key configured" }, { status: 500 })
  }

  const systemPrompt = `You are AudioGenetics, an advanced AI songwriter within the LYRICAL AI platform. You create original, compelling song lyrics by synthesizing musical influences with user-specified themes.

CRITICAL RULES:
- NEVER include real artist names, band names, or trademarked terms in the lyrics
- The ONLY name allowed in lyrics is "Lucky Clover" as a poetic reference
- Create 100% original content - no copying existing songs
- Focus on emotional authenticity and universal themes

MUSICAL GENOME DATA:
${analysisData ? JSON.stringify(analysisData, null, 2) : "No specific influence data - use general contemporary style"}

STRUCTURE REQUIREMENTS:
- ${verseCount} verses with ${barsPerVerse} bars each (4 lines per bar)
- ${chorusCount} chorus sections (the LAST chorus MUST be labeled [Bridge])
- Use section labels: [Verse 1], [Hook], [Bridge], [Instrumental], [Harmonizing], [Drop]
- Hooks should be memorable and catchy (4-8 bars)
- Bridge should be the emotional climax (8-12 bars)

OUTPUT FORMAT:
[Song Title]
[Audio Tag: genre/style]

[Verse 1]
(lyrics here)
[Instrumental]

[Hook]
(catchy memorable chorus)
[Harmonizing]

...continue structure...`

  const userPrompt = `Create an original song with these specifications:

SUBJECT MATTER: ${subjectMatter}
MOOD/EMOTION: ${mood || "determined from subject"}
MUSICAL STYLE INSPIRATION: ${musicalInfluence || "Contemporary pop/hip-hop fusion"}
AUDIO TAG: ${audioTag || "Modern alternative"}
TITLE: ${songTitle || "Generate a compelling title"}

Generate complete, original lyrics now. Remember: NO real artist names except "Lucky Clover" as poetic reference.`

  try {
    let lyrics: string

    if (MISTRAL_API_KEY) {
      // Use Mistral API
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
          temperature: 0.8,
          max_tokens: 2000,
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
              max_new_tokens: 2000,
              temperature: 0.8,
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

    // Post-process to ensure no name drops
    lyrics = sanitizeLyrics(lyrics)

    return NextResponse.json({
      lyrics,
      metadata: {
        subjectMatter,
        musicalInfluence,
        mood,
        audioTag,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("AudioGenetics generation error:", error)
    return NextResponse.json({ error: "Failed to generate lyrics" }, { status: 500 })
  }
}

// Remove any accidental name drops (except Lucky Clover)
function sanitizeLyrics(lyrics: string): string {
  // List of common artist names to filter out
  const bannedTerms = [
    /\b(Taylor Swift|Drake|Beyoncé|Beyonce|Kendrick|Kanye|Jay-Z|Rihanna|Eminem|Ed Sheeran|Adele|The Weeknd|Billie Eilish|Post Malone|Doja Cat|SZA|Travis Scott|Bad Bunny|Dua Lipa|Harry Styles|Ariana Grande|Justin Bieber|Bruno Mars|Lady Gaga|Coldplay|BTS|Blackpink)\b/gi,
  ]

  let cleaned = lyrics
  for (const term of bannedTerms) {
    cleaned = cleaned.replace(term, "the artist")
  }

  return cleaned
}
