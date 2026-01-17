import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User, Lock, LogOut, Loader2, Save, Monitor, Palette, AlertTriangle, Trash2 } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAuth } from '@/lib/hooks/auth/useAuth';
import { useGraphics } from '@/components/providers/GraphicsProvider';
import { useHaptics } from '@/components/providers/HapticsProvider';
import { notifySuccess, notifyError, DeleteConfirmationModal, DeleteFavoritesModal } from '@/components/common/Notifications';
import { cn, glass, glassInput, THEMES } from '@/utils/helpers';
import Image from 'next/image';
import { deleteAccount, deleteAllFavorites } from '@/utils/auth-actions';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'profile' | 'security' | 'graphics' | 'personalization' | 'danger';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { user, signOut, updateProfile, updatePassword, signInWithEmail } = useAuth();
    const queryClient = useQueryClient();
    const { showBackground, setShowBackground, reduceBlur, setReduceBlur } = useGraphics();
    const { hapticsEnabled, toggleHaptics } = useHaptics();
    const { accentColor, setAccentColor } = useTheme();
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteFavoritesConfirm, setShowDeleteFavoritesConfirm] = useState(false);

    const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || user?.user_metadata?.full_name || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    if (!user) return null;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateProfile({ full_name: displayName });
            notifySuccess('Profile updated successfully');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to update profile';
            notifyError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            notifyError('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            notifyError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            if (user.email) {
                await signInWithEmail(user.email, oldPassword);
            } else {
                throw new Error("User email not found");
            }
            await updatePassword(newPassword);
            notifySuccess('Password updated successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to update password. Check old password.';
            notifyError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-transparent"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className={cn(
                            glass(),
                            "relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden",
                            "flex flex-col md:flex-row",
                            "max-h-[90vh] md:h-[500px]",
                            "bg-black/90 md:bg-black/40"
                        )}
                    >
                        <button
                            onClick={onClose}
                            className={cn(
                                "md:hidden absolute top-3 right-3 z-20",
                                "w-10 h-10 flex items-center justify-center rounded-full",
                                "text-gray-400 hover:text-white active:bg-white/10 transition-colors"
                            )}
                        >
                            <X size={22} />
                        </button>

                        <div className={cn(
                            "w-full md:w-64 bg-black/20",
                            "border-b md:border-b-0 md:border-r border-white/10",
                            "p-4 md:p-6 flex flex-col gap-2",
                            "overflow-x-auto md:overflow-visible"
                        )}>
                            <div className="hidden md:flex mb-6 flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 mb-3 relative">
                                    {user.user_metadata?.avatar_url ? (
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            alt="Avatar"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                            <User size={32} className="text-white/50" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-white truncate w-full">
                                    {user.user_metadata?.display_name || user.user_metadata?.full_name || 'User'}
                                </h3>
                                <p className="text-xs text-gray-400 truncate w-full">{user.email}</p>
                            </div>

                            <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0">
                                <TabButton
                                    icon={<User size={18} />}
                                    label="Profile"
                                    isActive={activeTab === 'profile'}
                                    onClick={() => setActiveTab('profile')}
                                />

                                {user?.app_metadata?.provider === 'email' && (
                                    <TabButton
                                        icon={<Lock size={18} />}
                                        label="Security"
                                        isActive={activeTab === 'security'}
                                        onClick={() => setActiveTab('security')}
                                    />
                                )}

                                <TabButton
                                    icon={<Monitor size={18} />}
                                    label="Graphics"
                                    isActive={activeTab === 'graphics'}
                                    onClick={() => setActiveTab('graphics')}
                                />

                                <TabButton
                                    icon={<Palette size={18} />}
                                    label="Colors"
                                    isActive={activeTab === 'personalization'}
                                    onClick={() => setActiveTab('personalization')}
                                />
                            </div>

                            <div className="hidden md:block mt-auto">
                                <button
                                    onClick={() => setActiveTab('danger')}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                                        "text-sm font-medium transition-all text-left mb-2",
                                        activeTab === 'danger'
                                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                            : "text-red-400/80 hover:text-red-400 hover:bg-red-500/5"
                                    )}
                                >
                                    <AlertTriangle size={18} />
                                    Danger Zone
                                </button>
                            </div>

                            <button
                                onClick={() => setActiveTab('danger')}
                                className={cn(
                                    "md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl",
                                    "text-sm font-medium transition-all whitespace-nowrap",
                                    activeTab === 'danger'
                                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                        : "text-red-400/80 active:bg-red-500/10"
                                )}
                            >
                                <AlertTriangle size={18} />
                            </button>
                        </div>

                        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                            <button
                                onClick={onClose}
                                className="hidden md:block absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">
                                {activeTab === 'profile' ? 'Profile Settings' :
                                    activeTab === 'security' ? 'Security Settings' :
                                        activeTab === 'graphics' ? 'Graphics Settings' :
                                            activeTab === 'personalization' ? 'Personalization' :
                                                'Danger Zone'}
                            </h2>

                            {activeTab === 'profile' && (
                                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-sm">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Display Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className={glassInput()}
                                                placeholder="Your Name"
                                                maxLength={30}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={cn(
                                            "px-6 py-2 bg-[#00e5ff] text-black font-semibold rounded-lg",
                                            "hover:bg-[#00cce6] transition-colors disabled:opacity-50",
                                            "flex items-center gap-2"
                                        )}
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Save Changes
                                    </button>
                                </form>
                            )}

                            {activeTab === 'security' && (
                                <form onSubmit={handleChangePassword} className="space-y-6 max-w-sm">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Current Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                            <input
                                                type="password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className={glassInput()}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="border-t border-white/10 pt-4 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">New Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className={glassInput()}
                                                    placeholder="••••••••"
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400">Confirm New Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                                                <input
                                                    type="password"
                                                    value={confirmNewPassword}
                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                    className={glassInput()}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={cn(
                                            "px-6 py-2 bg-red-500 text-white font-semibold rounded-lg",
                                            "hover:bg-red-600 transition-colors disabled:opacity-50",
                                            "flex items-center gap-2 shadow-lg shadow-red-500/20"
                                        )}
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Update Password
                                    </button>
                                </form>
                            )}

                            {activeTab === 'graphics' && (
                                <div className="space-y-6 max-w-sm">
                                    <ToggleCard
                                        title="Enable Animations"
                                        description="Show background particles"
                                        isEnabled={showBackground}
                                        onToggle={() => setShowBackground(!showBackground)}
                                    />
                                    <ToggleCard
                                        title="Glass Effects"
                                        description="Premium frosted glass styling"
                                        isEnabled={!reduceBlur}
                                        onToggle={() => setReduceBlur(!reduceBlur)}
                                    />
                                </div>
                            )}

                            {activeTab === 'personalization' && (
                                <div className="space-y-6">
                                    <ToggleCard
                                        title="Haptic Feedback"
                                        description="Vibrations on interaction"
                                        isEnabled={hapticsEnabled}
                                        onToggle={toggleHaptics}
                                    />

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-4">Accent Color</h3>
                                        <div className="grid grid-cols-7 gap-3">
                                            {THEMES.map((theme) => (
                                                <button
                                                    key={theme.name}
                                                    onClick={() => setAccentColor(theme.value)}
                                                    className="group relative flex flex-col items-center gap-2"
                                                    title={theme.name}
                                                >
                                                    <div
                                                        className={cn(
                                                            "w-10 h-10 rounded-full border-2 transition-all duration-300",
                                                            accentColor === theme.value
                                                                ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                                : "border-transparent hover:scale-110 hover:border-white/50"
                                                        )}
                                                        style={{ backgroundColor: theme.value }}
                                                    >
                                                        {accentColor === theme.value && (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                                        <h4 className="text-[var(--accent)] font-medium mb-1">Preview</h4>
                                        <p className="text-gray-400 text-sm">This is how your active elements will look.</p>
                                        <div className="mt-4 flex gap-3">
                                            <button className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold text-sm">
                                                Primary
                                            </button>
                                            <button className="px-4 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] font-medium text-sm">
                                                Secondary
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'danger' && (
                                <div className="space-y-6 max-w-sm">
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                                            <div>
                                                <h3 className="text-red-500 font-semibold mb-1">Danger Zone</h3>
                                                <p className="text-red-400/80 text-sm">
                                                    Manage destructive actions for your account.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={() => {
                                                signOut();
                                                onClose();
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
                                                "bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-colors"
                                            )}
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>

                                        <button
                                            onClick={() => setShowDeleteFavoritesConfirm(true)}
                                            disabled={isLoading}
                                            className={cn(
                                                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
                                                "bg-red-500 hover:bg-red-600 text-white font-semibold",
                                                "transition-colors shadow-lg shadow-red-500/20"
                                            )}
                                        >
                                            <Trash2 size={18} />
                                            Delete All Favorites
                                        </button>

                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-gray-400 text-sm mb-3">
                                                Permanently delete your account and all data.
                                            </p>
                                            <button
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className={cn(
                                                    "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
                                                    "bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium",
                                                    "transition-colors border border-red-500/20"
                                                )}
                                            >
                                                <AlertTriangle size={18} />
                                                Delete My Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <DeleteConfirmationModal
                        isOpen={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        requiresPassword={user.app_metadata.provider === 'email'}
                        onConfirm={async (password) => {
                            try {
                                if (user.app_metadata.provider === 'email') {
                                    await signInWithEmail(user.email!, password!);
                                }

                                const { data: { session } } = await supabase.auth.getSession();
                                if (!session?.access_token) {
                                    throw new Error('No active session found');
                                }

                                const result = await deleteAccount(session.access_token);

                                if (result.success) {
                                    await signOut();
                                    window.location.href = '/';
                                    notifySuccess('Account deleted successfully');
                                } else {
                                    notifyError(result.error || 'Failed to delete account');
                                    throw new Error(result.error || 'Failed');
                                }
                            } catch (error: unknown) {
                                const message = error instanceof Error ? error.message : 'Verification failed';
                                notifyError(message);
                                throw error;
                            }
                        }}
                    />

                    <DeleteFavoritesModal
                        isOpen={showDeleteFavoritesConfirm}
                        onClose={() => setShowDeleteFavoritesConfirm(false)}
                        onConfirm={async () => {
                            try {
                                if (user) {
                                    queryClient.setQueryData(['favorites', user.id], []);
                                }

                                const { data: { session } } = await supabase.auth.getSession();
                                if (!session?.access_token) throw new Error('No session');

                                const result = await deleteAllFavorites(session.access_token);
                                if (result.success) {
                                    notifySuccess('All favorites deleted');
                                    setShowDeleteFavoritesConfirm(false);
                                    if (user) {
                                        queryClient.invalidateQueries({ queryKey: ['favorites', user.id] });
                                    }
                                    window.dispatchEvent(new Event('favorites-updated'));
                                } else {
                                    notifyError('Failed to delete favorites');
                                    if (user) {
                                        queryClient.invalidateQueries({ queryKey: ['favorites', user.id] });
                                    }
                                }
                            } catch {
                                notifyError('Error deleting favorites');
                                if (user) {
                                    queryClient.invalidateQueries({ queryKey: ['favorites', user.id] });
                                }
                            }
                        }}
                    />
                </div>
            )}
        </AnimatePresence>
    );
}

interface TabButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

function TabButton({ icon, label, isActive, onClick }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl",
                "text-sm font-medium transition-all text-left whitespace-nowrap",
                isActive
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10"
            )}
        >
            {icon}
            <span className="hidden md:inline">{label}</span>
        </button>
    );
}

interface ToggleCardProps {
    title: string;
    description: string;
    isEnabled: boolean;
    onToggle: () => void;
}

function ToggleCard({ title, description, isEnabled, onToggle }: ToggleCardProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
                <h3 className="font-medium text-white">{title}</h3>
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    isEnabled ? "bg-[#00e5ff]" : "bg-white/10"
                )}
            >
                <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300",
                    isEnabled ? "left-7" : "left-1"
                )} />
            </button>
        </div>
    );
}
