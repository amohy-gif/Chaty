'use client'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

export default function Chat() {
  const [model, setModel] = useState('openai')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aihub_messages')||'[]') } catch(e){return []}
  })
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { localStorage.setItem('aihub_messages', JSON.stringify(messages)) }, [messages])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await axios.post('/api/chat', { prompt: input, model })
      const aiText = res.data?.reply || 'لم يصل ردّ من الخادم.'
      setMessages(prev => [...prev, { id: Date.now()+1, role: 'assistant', text: aiText }])
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now()+2, role: 'assistant', text: 'حدث خطأ: ' + (err.response?.data?.error || err.message) }])
    } finally { setLoading(false) }
  }

  function clearChat(){ setMessages([]); localStorage.removeItem('aihub_messages') }

  return (
    <div className="flex flex-col h-[80vh]">
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">AI Hub</h2>
        <div className="flex items-center gap-2">
          <select value={model} onChange={e=>setModel(e.target.value)} className="p-2 border rounded">
            <option value="openai">ChatGPT (OpenAI)</option>
            <option value="gemini">Gemini (Placeholder)</option>
            <option value="claude">Claude (Placeholder)</option>
          </select>
          <button onClick={clearChat} className="px-3 py-2 bg-red-50 text-red-600 rounded">مسح</button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={m.role==='user'? 'text-right':'text-left'}>
            <div className={`inline-block max-w-[80%] p-3 rounded ${m.role==='user'? 'bg-blue-500 text-white':'bg-gray-100 text-gray-900'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-left text-gray-500">يجري الاتصال...</div>}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') sendMessage() }} placeholder="اكتب رسالتك..." className="flex-1 p-2 border rounded" />
          <button onClick={sendMessage} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">إرسال</button>
        </div>
      </div>
    </div>
  )
}
