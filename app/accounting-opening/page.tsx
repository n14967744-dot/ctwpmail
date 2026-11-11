import type { Metadata } from 'next';
import AccountingOpening from './AccountingOpening';

export const metadata: Metadata = {
  title: 'Prepared for Seidel Schroeder | CTWP',
  description: 'Printing, scanning and local support, built around your accounting office.',
  robots: { index: false, follow: false },
};

export default function Page() { return <AccountingOpening />; }
