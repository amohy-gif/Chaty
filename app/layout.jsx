import './globals.css'
export const metadata = { title: process.env.NEXT_PUBLIC_APP_NAME || 'AI Hub' }
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
