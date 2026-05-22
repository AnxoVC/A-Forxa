'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Bell, Flame } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ user }: { user: any }) {
  const t = useTranslations('nav');

  return (
    <header className="app-header">
      <div className={styles.mobileLogo}>
        <span className={styles.logoIcon}>🔥</span>
      </div>
      
      <div className={styles.centerTitle}>
        <span className={styles.title}>A Forxa</span>
      </div>

      <div className={styles.actions}>
        <div className={styles.streakBadge}>
          <Flame size={16} className="text-fire" />
          <span>3</span>
        </div>
        <button className={styles.iconBtn}>
          <Bell size={20} />
        </button>
        <div className={styles.mobileAvatar}>
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
