import axios from 'axios'

export async function POST(req) {
  try {
    const { prompt, model } = await req.json()
    // حاليًا ندعم OpenAI فقط. لاحقًا يمكن التفرعة إلى Gemini أو Claude.
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured on server.' }), { status: 500 })
    }

    if (model === 'openai') {
      const payload = {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      }
      const res = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }
      })
      const reply = res.data.choices?.[0]?.message?.content || ''
      return new Response(JSON.stringify({ reply }), { status: 200 })
    }

    // Placeholder response for other models
    return new Response(JSON.stringify({ reply: 'هذا نموذج وهمي حالياً — إضافة Gemini/Claude لاحقاً.' }), { status: 200 })

  } catch (err) {
    console.error(err?.response?.data || err.message)
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), { status: 500 })
  }
}
