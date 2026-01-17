'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Heart, Settings, Bell, BellOff, Image as ImageIcon, Maximize, LayoutGrid } from 'lucide-react';
import { glassNavbar, glassActive, cn } from '@/utils/helpers';
import { useState } from 'react';
import { useAuth } from '@/lib/hooks/auth/useAuth';
import { SettingsModal } from './SettingsModal';
import { CategoryModal } from './CategoryModal';
import { useNotificationSettings } from '@/components/common/Notifications';
import { useHaptics } from '@/components/providers/HapticsProvider';
import { Z_INDEX } from '@/lib/constants';

export function Sidebar() {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isImmersive = pathname === '/immersive';
    const [isHovered, setIsHovered] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const { user } = useAuth();

    const { notificationsEnabled, toggleNotifications } = useNotificationSettings();
    const { triggerHaptic } = useHaptics();

    const withHaptic = (callback?: () => void) => () => {
        triggerHaptic('light');
        callback?.();
    };

    const isVisible = isHome || isHovered;

    const variants = {
        hidden: { x: 50, opacity: 0 },
        visible: { x: 0, opacity: 1 },
    };

    const handleSettingsClick = () => {
        if (!user) {
            window.dispatchEvent(new Event('open-auth-modal'));
        } else {
            setIsSettingsOpen(true);
        }
    };

    return (
        <>
            {!isImmersive && (
                <>
                    {!isHome && (
                        <div
                            className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 h-[60vh] w-8 bg-transparent"
                            style={{ zIndex: Z_INDEX.SIDEBAR_TRIGGER }}
                            onMouseEnter={() => setIsHovered(true)}
                        />
                    )}

                    <motion.aside
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        variants={variants}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="hidden md:block fixed right-6 top-1/2 -translate-y-1/2"
                        style={{ zIndex: Z_INDEX.SIDEBAR }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <nav className={cn(
                            'bg-black/80 backdrop-blur-md border border-white/20',
                            'flex flex-col items-center gap-6 py-8 px-3 rounded-full',
                            'shadow-2xl shadow-black/50'
                        )}>
                            <Link href="/favorites">
                                <SidebarIcon
                                    icon={<Heart size={20} />}
                                    active={pathname === '/favorites'}
                                    className="text-red-500 shadow-red-500/20"
                                />
                            </Link>

                            <Link href="/immersive">
                                <SidebarIcon
                                    icon={<Maximize size={20} />}
                                    active={pathname === '/immersive'}
                                />
                            </Link>

                            <button onClick={() => setIsCategoryOpen(true)}>
                                <SidebarIcon
                                    icon={<LayoutGrid size={20} />}
                                    active={isCategoryOpen}
                                />
                            </button>

                            <button onClick={toggleNotifications}>
                                <SidebarIcon
                                    icon={notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                                    active={false}
                                    className={!notificationsEnabled ? "text-yellow-400 hover:text-yellow-300" : ""}
                                />
                            </button>

                            <button onClick={handleSettingsClick}>
                                <SidebarIcon
                                    icon={<Settings size={20} />}
                                    active={isSettingsOpen}
                                />
                            </button>
                        </nav>
                    </motion.aside>
                </>
            )}

            {!isImmersive && (
                <div
                    className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2"
                    style={{ zIndex: Z_INDEX.SIDEBAR }}
                >
                    <nav className={cn(
                        glassNavbar(),
                        'backdrop-blur-none md:backdrop-blur-md bg-black/80',
                        'flex items-center gap-2 py-2 px-3 rounded-full',
                        'shadow-2xl shadow-black/50'
                    )}>
                        <Link href="/favorites" onClick={withHaptic()}>
                            <MobileNavIcon
                                icon={<Heart size={20} />}
                                active={pathname === '/favorites'}
                                className="text-red-500 shadow-red-500/20"
                            />
                        </Link>

                        <Link href="/wallpapers" onClick={withHaptic()}>
                            <MobileNavIcon
                                icon={<ImageIcon size={20} />}
                                active={pathname === '/wallpapers'}
                            />
                        </Link>

                        <Link href="/" onClick={withHaptic()}>
                            <MobileNavIcon
                                icon={<Home size={20} />}
                                active={pathname === '/'}
                            />
                        </Link>

                        <button onClick={withHaptic(() => setIsCategoryOpen(true))}>
                            <MobileNavIcon
                                icon={<LayoutGrid size={20} />}
                                active={isCategoryOpen}
                            />
                        </button>

                        <button onClick={withHaptic(toggleNotifications)}>
                            <MobileNavIcon
                                icon={notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                                active={false}
                                className={!notificationsEnabled ? "text-yellow-400" : ""}
                            />
                        </button>

                        <button onClick={withHaptic(handleSettingsClick)}>
                            <MobileNavIcon
                                icon={<Settings size={20} />}
                                active={isSettingsOpen}
                            />
                        </button>
                    </nav>
                </div>
            )}

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <CategoryModal isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
        </>
    );
}

interface SidebarIconProps {
    icon: React.ReactNode;
    active: boolean;
    className?: string;
}

function SidebarIcon({ icon, active, className }: SidebarIconProps) {
    return (
        <div className={cn(
            "p-3 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer",
            active
                ? glassActive()
                : "text-white/80 hover:text-white hover:bg-white/10",
            className
        )}>
            {icon}
        </div>
    );
}

interface MobileNavIconProps {
    icon: React.ReactNode;
    active: boolean;
    className?: string;
}

function MobileNavIcon({ icon, active, className }: MobileNavIconProps) {
    return (
        <div className={cn(
            "p-3 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer",
            active
                ? glassActive()
                : "text-white/80 active:bg-white/10",
            className
        )}>
            {icon}
        </div>
    );
}
