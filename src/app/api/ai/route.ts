import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action, leadName, tripName, vibe, groupType, callLogs } = await request.json()

    let prompt = ''

    if (action === 'whatsapp') {
      prompt = `Write a short, warm WhatsApp message from Nomichi (a slow travel company) to a lead named ${leadName} who enquired about "${tripName}". They're travelling as: ${groupType}. They said they're hoping the trip feels like: "${vibe}".

Style rules: second person, short sentences, no exclamation marks, no em-dashes, no words like "unlock", "elevate", or "embark". Warm, honest, specific, still. Keep it under 50 words. Just return the message text, nothing else.`
    }

    else if (action === 'summary') {
      prompt = `You are a helpful assistant for a travel company called Nomichi. Here are the call log notes for a lead named ${leadName} who enquired about "${tripName}":

${callLogs}

Summarise where this lead stands and what the next action should be, in one clear sentence. Be specific and practical. No fluff. Just return the one sentence, nothing else.`
    }

    else if (action === 'vibefit') {
      prompt = `You are a travel curator at Nomichi, a slow, offbeat, small-group travel company. A traveller named ${leadName} enquired about "${tripName}". They're travelling as: ${groupType}. They said they're hoping the trip feels like: "${vibe}".

Based only on what they shared, does this traveller seem like a good fit for slow, small-group travel? Reply with either "Likely a fit" or "Might not be a fit", followed by a dash and one short, specific reason. Example: "Likely a fit - they want to slow down and avoid packed itineraries." This is a suggestion only, never a rejection. Just return that one line, nothing else.`
    }

    else {
      return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )

    const data = await response.json()
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Too many requests. Wait a moment and try again.'

    return NextResponse.json({ message: message.trim() })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate response.' }, { status: 500 })
  }
}