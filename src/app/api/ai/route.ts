import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { leadName, tripName, vibe, groupType } = await request.json()

    const prompt = `Write a short, warm WhatsApp message from Nomichi (a slow travel company) to a lead named ${leadName} who enquired about "${tripName}". They're travelling as: ${groupType}. They said they're hoping the trip feels like: "${vibe}".

Style rules: second person, short sentences, no exclamation marks, no em-dashes, no words like "unlock", "elevate", or "embark". Warm, honest, specific, still. Keep it under 50 words. Just return the message text, nothing else.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )

    const data = await response.json()
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not generate message.'

    return NextResponse.json({ message: message.trim() })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate message.' }, { status: 500 })
  }
}