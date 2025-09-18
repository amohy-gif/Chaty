import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(req) {
  try {
    const { message, model } = await req.json()

    if (model === "gemini") {
      const geminiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          contents: [{ parts: [{ text: message }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
          params: { key: process.env.GEMINI_API_KEY },
        }
      )
      const reply =
        geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ لم يأت رد من Gemini"
      return NextResponse.json({ reply })
    }

    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    const reply = openaiRes.data.choices[0].message.content
    return NextResponse.json({ reply })
  } catch (error) {
    console.error(error.response?.data || error.message)
    return NextResponse.json(
      { reply: "⚠️ خطأ أثناء الاتصال بالنموذج" },
      { status: 500 }
    )
  }
}
