import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Tech Online Store',
  description: 'Electronic Store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CDN for instant styling */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-screen flex flex-col bg-gray-100 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}