'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, Dumbbell, Plus, Utensils, LineChart } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'es';

  const navItems = [
    { href: `/${locale}`, icon: Home, label: t('dashboard') },
    { href: `/${locale}/training`, icon: Dumbbell, label: t('training') },
    { href: '#add', icon: Plus, isAction: true },
    { href: `/${locale}/nutrition`, icon: Utensils, label: t('nutrition') },
    { href: `/${locale}/progress`, icon: LineChart, label: t('progress') },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item, idx) => {
        const isActive = pathname === item.href || (item.href !== `/${locale}` && !item.isAction && pathname.startsWith(item.href));
        
        if (item.isAction) {
          return (
            <button key="action" className={styles.actionBtn}>
              <item.icon size={28} color="white" />
            </button>
          );
        }

        return (
          <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
            <item.icon size={24} />
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
