'use client';

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppShell({ 
  children,
  user 
}: { 
  children: React.ReactNode;
  user: any;
}) {
  return (
    <div className="app-layout">
      <Sidebar user={user} />
      <main className="app-main">
        <Header user={user} />
        <div className="app-content">
          {children}
        </div>
        <BottomNav />
      </main>
    </div>
  );
}
