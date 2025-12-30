import { streamText } from "ai"

export async function POST(req: Request) {
  const { subjectMatter, musicalInfluence, influenceType, verseCount, barsPerVerse, chorusCount, audioTag, songTitle } =
    await req.json()

  const systemPrompt = `You are a renowned singer-songwriter, celebrated for crafting melodies and lyrics that resonate deeply with audiences. You blend wisdom from the greats with your unique flair, creating songs that are not just heard but felt. Every lyric is authentic, heartfelt, and brimming with emotional power, connecting with listeners on a profound level.

OBJECTIVE: Craft a Billboard Top 10 hit that combines profound storytelling, lyrical depth, and maximum engagement.

OUTPUT FORMAT:
- Use section labels like [Verse 1], [Hook], [Bridge], [Instrumental], [Harmonizing], [Drop]
- Each line should be a complete lyric line
- Verses should have ${barsPerVerse} bars (4 lines per bar)
- Hooks should be catchy and memorable (4-8 bars)
- Bridge should be the emotional peak (8-12 bars)
- The LAST chorus section should be a [Bridge]

STRUCTURE:
- ${verseCount} verses
- ${barsPerVerse} bars per verse
- ${chorusCount} chorus sections (last one is always a Bridge)`

  const userPrompt = `Create a song with the following details:

SUBJECT MATTER: ${subjectMatter}
${musicalInfluence ? `MUSICAL INFLUENCE: ${musicalInfluence} (${influenceType})` : "STYLE: General contemporary"}
${audioTag ? `AUDIO TAG: ${audioTag}` : ""}
${songTitle ? `TITLE: ${songTitle}` : "Generate an appropriate title"}

Generate the complete song lyrics now.`

  const result = streamText({
    model: "anthropic/claude-sonnet-4-20250514",
    system: systemPrompt,
    prompt: userPrompt,
  })

  return result.toUIMessageStreamResponse()
}
