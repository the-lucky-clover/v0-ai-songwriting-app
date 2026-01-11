import { NextResponse } from "next/server"

// AudioGenetics: Analyze musical influence and extract lyrical patterns
export async function POST(req: Request) {
  const { artist, song } = await req.json()

  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

  if (!HUGGINGFACE_API_KEY) {
    return NextResponse.json({ error: "Hugging Face API key not configured" }, { status: 500 })
  }

  try {
    // Use Hugging Face for sentiment analysis of the influence
    const analysisPrompt = `Analyze the musical and lyrical style of ${artist}${song ? ` - "${song}"` : ""}. 
    Extract key attributes:
    - Emotional tone (melancholic, euphoric, introspective, etc.)
    - Lyrical themes (love, loss, empowerment, etc.)
    - Writing style (metaphorical, direct, poetic, narrative)
    - Rhyme patterns (AABB, ABAB, free verse, etc.)
    - Common imagery and motifs`

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.3",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${analysisPrompt} [/INST]`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
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
    const analysisText = Array.isArray(data) ? data[0]?.generated_text : data.generated_text

    return NextResponse.json({
      artist,
      song,
      analysis: analysisText,
      attributes: {
        emotionalTone: extractAttribute(analysisText, "emotional"),
        lyricalThemes: extractAttribute(analysisText, "themes"),
        writingStyle: extractAttribute(analysisText, "style"),
        rhymePattern: extractAttribute(analysisText, "rhyme"),
        imagery: extractAttribute(analysisText, "imagery"),
      },
    })
  } catch (error) {
    console.error("AudioGenetics analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze musical influence" }, { status: 500 })
  }
}

function extractAttribute(text: string, keyword: string): string {
  const lines = text?.split("\n") || []
  const matchingLine = lines.find((line) => line.toLowerCase().includes(keyword))
  return matchingLine?.replace(/^[-*•]\s*/, "").trim() || "Unknown"
}
