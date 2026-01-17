/**
 * Centralized Constants for the 4kwalls project
 * Prevents magic numbers and enables easy configuration changes
 */

// ============================================
// Stale Times for TanStack Query
// ============================================

export const STALE_TIME = {
    DEFAULT: 60 * 1000,
    /** Auth state rarely changes without explicit user action */
    AUTH: Infinity,
    /** Favorites can be stale for 5 minutes */
    FAVORITES: 5 * 60 * 1000,
    /** Wallpaper data is stable */
    WALLPAPERS: Infinity,
    /** Favorite wallpaper details */
    CATEGORIES: Infinity,
    ZERO: 0,
} as const;

// ============================================
// Infinite Scroll Configuration
// ============================================

export const INFINITE_SCROLL = {
    /** IntersectionObserver root margin - how early to trigger */
    ROOT_MARGIN: '600px',
    /** Number of wallpapers to fetch per batch */
    BATCH_SIZE: 32,
    /** Threshold for intersection observer (0 = any visibility) */
    THRESHOLD: 0,
} as const;

// ============================================
// Session Storage Keys
// ============================================

export const STORAGE_KEYS = {
    /** Tracks viewed wallpaper IDs to prevent duplicates */
    VIEWED_IDS: 'viewed_ids',
    /** User preference for notifications */
    NOTIFICATIONS_ENABLED: 'notifications_enabled',
    /** Graphics settings */
    GRAPHICS_SHOW_BACKGROUND: 'graphics_showBackground',
    GRAPHICS_REDUCE_BLUR: 'graphics_reduceBlur',
    /** Login success flag for post-redirect toast */
    LOGIN_SUCCESS: 'login_success',
} as const;

// ============================================
// Image Optimization
// ============================================

export const IMAGE_CONFIG = {
    /** Thumbnail width for grid cards */
    THUMBNAIL_WIDTH: 500,
    /** Modal/Lightbox width for detailed view */
    MODAL_WIDTH: 1200,
    /** Default quality for WebP conversion */
    THUMBNAIL_QUALITY: 80,
    MODAL_QUALITY: 85,
} as const;

// ============================================
// Animation Durations (ms)
// ============================================

export const ANIMATION = {
    FAST: 0.2,
    MEDIUM: 0.3,
    SLOW: 0.5,
    DEBOUNCE_SAVE: 300,
    DOWNLOAD_SPINNER_DELAY: 1500,
    COPY_FEEDBACK: 2000,
    REVOKE_OBJECT_URL: 100,
    SPIN_SLOW: 1,
    HERO_REVEAL: 0.6,
    HERO_CONTENT: 0.8,
    HERO_BACKGROUND: 1.5,
    HERO_DELAY_1: 0.1,
    HERO_DELAY_2: 0.2,
    HERO_DELAY_3: 0.3,
    HERO_DELAY_BG: 0.5,
} as const;

// ============================================
// Limits & Thresholds
// ============================================

export const LIMITS = {
    /** Maximum viewed IDs to store in sessionStorage */
    MAX_VIEWED_IDS: 2000,
    /** Maximum exclude IDs to send to RPC */
    MAX_EXCLUDE_IDS: 500,
    /** Minimum password length */
    MIN_PASSWORD_LENGTH: 6,
    /** Maximum display name length */
    MAX_DISPLAY_NAME_LENGTH: 30,
    /** Maximum wallpaper IDs for sitemap */
    MAX_SITEMAP_IDS: 50000,
} as const;

// ============================================
// Z-Index Layers
// ============================================

export const Z_INDEX = {
    /** Background layer */
    BACKGROUND: 0,
    /** Card hover state */
    CARD_HOVER: 10,
    CARD_CONTENT: 20,
    /** Sidebar trigger zone */
    SIDEBAR_TRIGGER: 49,
    /** Sidebar panel */
    SIDEBAR: 50,
    /** Header navigation */
    HEADER: 50,
    /** Category Modal / Overlay Modals */
    OVERLAY_MODAL: 100,
    /** Image Modal (must be above overlay modals) */
    IMAGE_MODAL: 110,
    /** Confirmation dialogs */
    CONFIRMATION_MODAL: 120,
} as const;

// ============================================
// Wallpaper Categories
// ============================================

export const WALLPAPER_CATEGORIES = [
    { id: 'anime', name: 'Anime', emoji: '🎌' },
    { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖' },
    { id: 'landscape', name: 'Landscape', emoji: '🏞️' },
    { id: 'neon city', name: 'Neon City', emoji: '🌃' },
    { id: 'minimalist', name: 'Minimalist', emoji: '✨' },
    { id: 'space', name: 'Space', emoji: '🌌' },
    { id: 'dark fantasy', name: 'Dark Fantasy', emoji: '🐉' },
    { id: 'abstract', name: 'Abstract', emoji: '🎨' },
    { id: 'car', name: 'Car', emoji: '🚗' },
    { id: 'nature', name: 'Nature', emoji: '🌿' },
    { id: 'animal', name: 'Animal', emoji: '🦁' },
    { id: 'gaming', name: 'Gaming', emoji: '🎮' },
    { id: 'horror', name: 'Horror', emoji: '👻' },
    { id: 'skull', name: 'Skull', emoji: '💀' },
    { id: 'robot', name: 'Robot', emoji: '🦾' },
    { id: 'forest', name: 'Forest', emoji: '🌲' },
    { id: 'mountain', name: 'Mountain', emoji: '🏔️' },
    { id: 'ocean', name: 'Ocean', emoji: '🌊' },
    { id: 'pixel art', name: 'Pixel Art', emoji: '👾' },
    { id: 'street photography', name: 'Street', emoji: '🏙️' },
    { id: 'sunset', name: 'Sunset', emoji: '🌅' },
    { id: 'flower', name: 'Flower', emoji: '🌸' },
    { id: 'cat', name: 'Cat', emoji: '🐱' },
    { id: 'dog', name: 'Dog', emoji: '🐶' },
    { id: 'sword', name: 'Sword', emoji: '⚔️' },
    { id: 'warrior', name: 'Warrior', emoji: '🗡️' },
    { id: 'architecture', name: 'Architecture', emoji: '🏗️' },
    { id: 'black and white', name: 'B&W', emoji: '⚫' },
    { id: 'rain', name: 'Rain', emoji: '🌧️' },
    { id: 'snow', name: 'Snow', emoji: '❄️' },
    { id: 'vintage', name: 'Vintage', emoji: '📜' },
    { id: 'sci-fi', name: 'Sci-Fi', emoji: '👽' },
] as const;
