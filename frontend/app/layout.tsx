import './globals.css';
import { Inter } from 'next/font/google';
import { AppProvider } from '../components/layout/AppProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Whitestart System Security Inc.',
  description: 'A leading provider of advanced security solutions and products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
