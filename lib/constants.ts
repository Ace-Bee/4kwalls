








export const STALE_TIME = {
    DEFAULT: 60 * 1000,
    
    AUTH: Infinity,
    
    FAVORITES: 5 * 60 * 1000,
    
    WALLPAPERS: Infinity,
    
    CATEGORIES: Infinity,
    ZERO: 0,
} as const;





export const INFINITE_SCROLL = {
    
    ROOT_MARGIN: '600px',
    
    BATCH_SIZE: 32,
    
    THRESHOLD: 0,
} as const;





export const STORAGE_KEYS = {
    
    VIEWED_IDS: 'viewed_ids',
    
    NOTIFICATIONS_ENABLED: 'notifications_enabled',
    
    GRAPHICS_SHOW_BACKGROUND: 'graphics_showBackground',
    GRAPHICS_REDUCE_BLUR: 'graphics_reduceBlur',
    
    LOGIN_SUCCESS: 'login_success',
    
    HAPTICS_ENABLED: 'haptics_enabled',
} as const;





export const IMAGE_CONFIG = {
    
    THUMBNAIL_WIDTH: 500,
    
    MODAL_WIDTH: 1200,
    
    THUMBNAIL_QUALITY: 80,
    MODAL_QUALITY: 85,
} as const;





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





export const HAPTIC_PATTERNS = {
    
    LIGHT: 15,
    
    MEDIUM: 50,
    
    HEAVY: 80,
    
    SUCCESS: [50, 50, 50],
    
    WARNING: [30, 50, 30],
    
    ERROR: [50, 100, 50, 50],
} as const;





export const LIMITS = {
    
    MAX_VIEWED_IDS: 2000,
    
    MAX_EXCLUDE_IDS: 500,
    
    MIN_PASSWORD_LENGTH: 6,
    
    MAX_DISPLAY_NAME_LENGTH: 30,
    
    MAX_SITEMAP_IDS: 50000,
} as const;





export const Z_INDEX = {
    
    BACKGROUND: 0,
    
    CARD_HOVER: 10,
    CARD_CONTENT: 20,
    
    SIDEBAR_TRIGGER: 49,
    
    SIDEBAR: 50,
    
    HEADER: 50,
    
    OVERLAY_MODAL: 100,
    
    IMAGE_MODAL: 110,
    
    CONFIRMATION_MODAL: 120,
} as const;





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
