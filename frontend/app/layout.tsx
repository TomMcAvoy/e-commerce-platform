import { CartProvider } from '../context/CartContext';
import './globals.css';

export const metadata = {
  title: 'Whitestart System Security - Premiumhub',
  description: 'Secure multi-vendor marketplace with enterprise-level protection and verified dropshipping integration',
  keywords: 'secure ecommerce, premium marketplace, dropshipping, verified vendors, encrypted transactions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
