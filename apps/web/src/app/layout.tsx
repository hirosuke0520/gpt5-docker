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
          <header className="mb-6">
            <h1 className="text-2xl font-bold">Mini CRM</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
