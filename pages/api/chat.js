import axios from "axios"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  const { message, model } = req.body

  try {
    if (model === "gemini") {
      // Gemini API
      const geminiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          contents: [{ parts: [{ text: message }] }],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: { key: process.env.GEMINI_API_KEY },
        }
      )
      const reply =
        geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ لم يأت رد من Gemini"
      return res.status(200).json({ reply })
    }

    // OpenAI API (ChatGPT)
    const response = await axios.post(
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
    const reply = response.data.choices[0].message.content
    return res.status(200).json({ reply })
  } catch (error) {
    console.error(error.response?.data || error.message)
    return res.status(500).json({ reply: "⚠️ خطأ أثناء الاتصال بالنموذج" })
  }
}
