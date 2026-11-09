import type { ReactNode } from 'react';
import './style.css';

export const metadata = { title: 'Animales | Framework Dev' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
