'use client';

import React, { useEffect, useState } from 'react';
import { MobileSidebar, Sidebar } from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="bg-background border-top flex h-full">
            {/* Desktop Sidebar */}
            <div className="hidden flex-shrink-0 lg:block">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={handleSidebarToggle}
                />
            </div>

            {/* Mobile Sidebar */}
            <MobileSidebar
                open={mobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                <Sidebar collapsed={false} onToggle={handleMobileMenuClose} />
            </MobileSidebar>

            {/* Main Content Area - No separate dashboard header */}
            <main className="flex-1 overflow-auto">
                <div className="container mx-auto max-w-7xl p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}

// Dashboard Context Provider (for future state management)
interface DashboardContextType {
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

const DashboardContext = React.createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const value = {
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = React.useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
