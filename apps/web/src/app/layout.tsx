import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Mini CRM',
  description: 'Internal mini CRM'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        <div className="max-w-6xl mx-auto p-4">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Mini CRM</h1>
            <nav className="flex gap-3 text-sm">
              <a className="underline" href="/dashboard">Dashboard</a>
              <a className="underline" href="/leads">Leads</a>
              <a className="underline" href="/deals">Deals</a>
              <a className="underline" href="/companies">Companies</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
