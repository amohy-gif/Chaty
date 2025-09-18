'use client'
import Chat from '../components/Chat'
export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow rounded-lg">
        <Chat />
      </div>
    </main>
  )
}
