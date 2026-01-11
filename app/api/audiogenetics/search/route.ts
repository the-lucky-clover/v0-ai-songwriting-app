import { NextResponse } from "next/server"

// AudioGenetics: Web search for artist/song lyrical research
export async function POST(req: Request) {
  const { query, type } = await req.json()

  // Use DuckDuckGo instant answer API (free, no API key required)
  // For production, you'd want a proper API like SerpAPI or Google Custom Search
  try {
    const searchQuery =
      type === "artist" ? `${query} lyrics style analysis music` : `${query} song lyrics meaning analysis`

    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`,
    )

    if (!response.ok) {
      throw new Error("Search failed")
    }

    const data = await response.json()

    return NextResponse.json({
      query,
      type,
      abstract: data.Abstract || data.AbstractText,
      relatedTopics: data.RelatedTopics?.slice(0, 5).map((t: { Text: string; FirstURL: string }) => ({
        text: t.Text,
        url: t.FirstURL,
      })),
      source: data.AbstractSource,
      url: data.AbstractURL,
    })
  } catch (error) {
    console.error("AudioGenetics search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
