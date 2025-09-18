import { useState, useEffect } from "react"
import axios from "axios"

export default function Chat() {
  const [messages, setMessages] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("chat")) || []
    }
    return []
  })
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState("openai") // 🆕 اختيار النموذج

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages))
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await axios.post("/api/chat", { message: input, model })
      const reply = res.data.reply
      setMessages(prev => [...prev, { role: "assistant", content: reply }])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">AI Hub</h2>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="openai">ChatGPT</option>
          <option value="gemini">Gemini</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded-xl ${msg.role === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-gray-100 self-start'}`}>
            {msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-500 text-sm">Thinking...</p>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          disabled={loading}
        >
          إرسال
        </button>
      </div>
    </div>
  )
}
