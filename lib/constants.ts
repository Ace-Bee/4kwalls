/**
 * Centralized Constants for the 4kwalls project
 * Prevents magic numbers and enables easy configuration changes
 */

// ============================================
// Stale Times for TanStack Query
// ============================================

export const STALE_TIME = {
    /** Auth state rarely changes without explicit user action */
    AUTH: Infinity,
    /** Favorites can be stale for 5 minutes */
    FAVORITES: 5 * 60 * 1000,
    /** Wallpaper data is stable */
    WALLPAPERS: Infinity,
    /** Favorite wallpaper details */
    FAVORITE_WALLPAPERS: 5 * 60 * 1000,
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
    /** Standard transition duration */
    FAST: 200,
    /** Medium transition duration */
    MEDIUM: 300,
    /** Slow/Emphasized transitions */
    SLOW: 500,
    /** Debounce delay for saving viewed IDs */
    DEBOUNCE_SAVE: 300,
    /** Delay before stopping download spinner (for link variant) */
    DOWNLOAD_SPINNER_DELAY: 1500,
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
    /** Sidebar trigger zone */
    SIDEBAR_TRIGGER: 49,
    /** Sidebar panel */
    SIDEBAR: 50,
    /** Header navigation */
    HEADER: 50,
    /** Image Modal */
    MODAL: 60,
    /** Auth/Settings Modals */
    OVERLAY_MODAL: 100,
    /** Confirmation dialogs */
    CONFIRMATION_MODAL: 110,
} as const;

// ============================================
// Wallpaper Categories
// ============================================

export const WALLPAPER_CATEGORIES = [
    "Anime", "Cyberpunk", "Landscape", "Neon City", "Minimalist", "Space",
    "Dark Fantasy", "Abstract", "Car", "Nature", "Animal", "Gaming",
    "Horror", "Skull", "Robot", "Forest", "Mountain", "Ocean", "Pixel Art",
    "Street Photography", "Sunset", "Flower", "Cat", "Dog", "Sword", "Warrior",
    "Architecture", "Black and White", "Rain", "Snow", "Vintage", "Sci-Fi"
] as const;
