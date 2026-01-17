'use client';

import { toast } from 'sonner';
import { LogIn, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2, Loader2, Lock } from 'lucide-react';
import { cn, glass, glassInput } from '@/utils/helpers';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Z_INDEX } from '@/lib/constants';


const glassToastClass = cn(
    glass(),
    "flex items-start gap-4 p-4 rounded-xl",
    "border border-white/20 shadow-2xl backdrop-blur-xl w-full max-w-sm"
);

const areNotificationsEnabled = () => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('notifications_enabled');
    return saved === null ? true : saved === 'true';
};

export function notifyLoginRequired(action: string, onLogin: () => void) {
    toast.custom((t) => (
        <div className={glassToastClass}>
            <div className="p-2 bg-white/10 rounded-full shrink-0">
                <LogIn className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-white text-base mb-1">Login Required</h3>
                <p className="text-white/70 text-sm mb-3">
                    You need to sign in to {action} wallpapers.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t);
                            onLogin();
                        }}
                        className="flex-1 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => toast.dismiss(t)}
                        className="px-4 py-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ), { duration: 5000 });
}

export function notifySuccess(message: string) {
    if (!areNotificationsEnabled()) return;
    toast.custom((t) => (
        <div className={cn(
            glass(),
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "border border-white/10 shadow-lg backdrop-blur-md min-w-[300px]"
        )}>
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            <span className="text-sm font-medium text-white">{message}</span>
            <button
                onClick={() => toast.dismiss(t)}
                className="ml-auto text-white/40 hover:text-white transition-colors"
            >
                ✕
            </button>
        </div>
    ));
}

export function notifyError(message: string) {
    if (!areNotificationsEnabled()) return;
    toast.custom((t) => (
        <div className={cn(
            glass(),
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "border border-white/10 shadow-lg backdrop-blur-md min-w-[300px]"
        )}>
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="text-sm font-medium text-white">{message}</span>
            <button
                onClick={() => toast.dismiss(t)}
                className="ml-auto text-white/40 hover:text-white transition-colors"
            >
                ✕
            </button>
        </div>
    ));
}

export function notifyInfo(message: string) {
    if (!areNotificationsEnabled()) return;
    toast.custom((t) => (
        <div className={cn(
            glass(),
            "flex items-center gap-3 px-4 py-3 rounded-xl",
            "border border-white/10 shadow-lg backdrop-blur-md min-w-[300px]"
        )}>
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="text-sm font-medium text-white">{message}</span>
            <button
                onClick={() => toast.dismiss(t)}
                className="ml-auto text-white/40 hover:text-white transition-colors"
            >
                ✕
            </button>
        </div>
    ));
}

export function useNotificationSettings() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        const checkSettings = () => {
            if (typeof window === 'undefined') return;
            const saved = localStorage.getItem('notifications_enabled');
            setNotificationsEnabled(saved === null ? true : saved === 'true');
        };

        checkSettings();

        const handleChange = (e: CustomEvent<boolean>) => {
            setNotificationsEnabled(e.detail);
        };

        window.addEventListener('notification-settings-changed', handleChange as EventListener);
        return () => window.removeEventListener('notification-settings-changed', handleChange as EventListener);
    }, []);

    const toggleNotifications = () => {
        const newState = !notificationsEnabled;
        setNotificationsEnabled(newState);
        localStorage.setItem('notifications_enabled', String(newState));
        window.dispatchEvent(new CustomEvent('notification-settings-changed', { detail: newState }));
        if (newState) {
            notifySuccess('Notifications Enabled');
        }
    };

    return { notificationsEnabled, toggleNotifications };
}

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password?: string) => Promise<void>;
    requiresPassword?: boolean;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, requiresPassword }: DeleteConfirmationModalProps) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setIsLoading(false);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center p-4"
                    style={{ zIndex: Z_INDEX.CONFIRMATION_MODAL }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 10, opacity: 0 }}
                        className={cn(
                            glass(),
                            "relative w-full max-w-sm p-6 rounded-2xl",
                            "border border-red-500/30 shadow-2xl",
                            "flex flex-col items-center text-center space-y-6"
                        )}
                    >
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Account</h3>
                            <p className="text-gray-300 text-sm">
                                Are you sure you want to do this? You will not be able to recover your data and favorites if you click delete.
                            </p>
                        </div>

                        {requiresPassword && (
                            <div className="w-full space-y-2 text-left">
                                <label className="text-sm text-gray-400 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={glassInput()}
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className={cn(
                                    "flex-1 py-3 rounded-xl",
                                    "bg-red-500 hover:bg-red-600 text-white font-bold",
                                    "shadow-lg shadow-red-500/20 transition-colors",
                                    "flex items-center justify-center gap-2 disabled:opacity-50"
                                )}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (requiresPassword && !password) {
                                        notifyError('Password is required');
                                        return;
                                    }
                                    setIsLoading(true);
                                    try {
                                        await onConfirm(password);
                                    } catch {
                                        setIsLoading(false);
                                    }
                                }}
                                disabled={isLoading}
                                className={cn(
                                    "flex-1 py-3 rounded-xl",
                                    "bg-white/5 hover:bg-white/10 text-white font-medium",
                                    "transition-colors disabled:opacity-50",
                                    "flex items-center justify-center gap-2"
                                )}
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

interface DeleteFavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function DeleteFavoritesModal({ isOpen, onClose, onConfirm }: DeleteFavoritesModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center p-4"
                    style={{ zIndex: Z_INDEX.CONFIRMATION_MODAL }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 10, opacity: 0 }}
                        className={cn(
                            glass(),
                            "relative w-full max-w-sm p-6 rounded-2xl",
                            "border border-red-500/30 shadow-2xl",
                            "flex flex-col items-center text-center space-y-6"
                        )}
                    >
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Trash2 size={32} className="text-red-500" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete All Favorites</h3>
                            <p className="text-gray-300 text-sm">
                                Are you sure? This will remove all your loved wallpapers. This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className={cn(
                                    "flex-1 py-3 rounded-xl",
                                    "bg-white/5 hover:bg-white/10 text-white font-medium",
                                    "transition-colors disabled:opacity-50"
                                )}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setIsLoading(true);
                                    try {
                                        await onConfirm();
                                    } catch {
                                        setIsLoading(false);
                                    }
                                }}
                                disabled={isLoading}
                                className={cn(
                                    "flex-1 py-3 rounded-xl",
                                    "bg-red-500 hover:bg-red-600 text-white font-bold",
                                    "shadow-lg shadow-red-500/20 transition-colors",
                                    "flex items-center justify-center gap-2 disabled:opacity-50"
                                )}
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
