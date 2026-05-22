'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, Dumbbell, Utensils, LineChart, User } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({ user }: { user: any }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g. /es/training -> es)
  const locale = pathname.split('/')[1] || 'es';

  const navItems = [
    { href: `/${locale}`, icon: Home, label: t('dashboard') },
    { href: `/${locale}/training`, icon: Dumbbell, label: t('training') },
    { href: `/${locale}/nutrition`, icon: Utensils, label: t('nutrition') },
    { href: `/${locale}/progress`, icon: LineChart, label: t('progress') },
    { href: `/${locale}/profile`, icon: User, label: t('profile') },
  ];

  return (
    <aside className="app-sidebar">
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>🔥</div>
        <h1 className={styles.logoText}>A Forxa</h1>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <item.icon size={20} className={isActive ? 'text-fire' : ''} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
          <span className={styles.email}>{user?.email}</span>
        </div>
      </div>
    </aside>
  );
}
