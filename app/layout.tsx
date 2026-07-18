import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: "Uncle's Chinese - Momo Festival",
  description: 'Catch the Momo Challenge and win exciting rewards!',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#D62828" />
      </head>
      <body className="bg-accent text-dark">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
