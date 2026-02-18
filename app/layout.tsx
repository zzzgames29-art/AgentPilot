import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgentPilot',
  description: 'Personal commission dashboard for property agents'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
