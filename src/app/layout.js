// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'Resume Merger',
  description: 'Merge photo and resume to PDF',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
