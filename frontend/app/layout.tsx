import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dietary Tracker',
  description: 'Track your dietary intake with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-green-700 text-white py-4 shadow-md">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-2xl font-bold tracking-tight">Dietary Tracker</h1>
            <p className="text-green-200 text-sm mt-0.5">Monitor your food intake and nutrition</p>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="text-center text-gray-400 text-sm py-6 border-t border-gray-200 mt-8">
          Dietary Tracker &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  )
}
