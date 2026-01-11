import { NextResponse } from "next/server"

// AudioGenetics: Sentiment analysis for lyrics
export async function POST(req: Request) {
  const { text } = await req.json()

  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

  if (!HUGGINGFACE_API_KEY) {
    return NextResponse.json({ error: "Hugging Face API key not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      },
    )

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Sentiment API error: ${response.status} - ${errorBody}`)
    }

    const data = await response.json()

    // Parse sentiment results
    const sentiments = Array.isArray(data[0]) ? data[0] : data
    const sorted = sentiments.sort((a: { score: number }, b: { score: number }) => b.score - a.score)

    return NextResponse.json({
      primary: sorted[0]?.label || "neutral",
      confidence: sorted[0]?.score || 0,
      breakdown: sorted.map((s: { label: string; score: number }) => ({
        label: s.label,
        score: Math.round(s.score * 100),
      })),
    })
  } catch (error) {
    console.error("Sentiment analysis error:", error)
    return NextResponse.json({ error: "Sentiment analysis failed" }, { status: 500 })
  }
}
