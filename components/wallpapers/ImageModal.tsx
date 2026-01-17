'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Info, X } from 'lucide-react';
import { Wallpaper } from '@/lib/supabase';
import { getModalImageUrl, cn, glassIcon } from '@/utils/helpers';
import { WallpaperInfo } from './WallpaperInfo';
import { DownloadButton } from './DownloadButton';
import { ShareButton } from './ShareButton';
import { FavoriteButton } from './FavoriteButton';
import { DoubleTapLikeOverlay } from './DoubleTapLikeOverlay';

import { Z_INDEX } from '@/lib/constants';

interface ImageModalProps {
    wallpaper: Wallpaper | null;
    onClose: () => void;
}

export function ImageModal({ wallpaper, onClose }: ImageModalProps) {
    const [showInfo, setShowInfo] = useState(false);

    if (!wallpaper) return null;

    return (
        <AnimatePresence onExitComplete={() => setShowInfo(false)}>
            {wallpaper && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ zIndex: Z_INDEX.IMAGE_MODAL }}
                    className={cn(
                        "fixed inset-0 flex items-center justify-center p-0 md:p-4",
                        "bg-black/95 backdrop-blur-xl"
                    )}
                    onClick={onClose}
                >
                    <motion.div
                        layoutId={`card-${wallpaper.id}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0.8, bottom: 0.8 }}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipeThreshold = 100;
                            const velocityThreshold = 200;
                            if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > velocityThreshold) {
                                onClose();
                            }
                        }}
                        className={cn(
                            "relative w-full h-full md:h-auto md:max-w-5xl md:aspect-video md:w-[80%]",
                            "flex flex-col items-center justify-center"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className={cn(
                                "absolute top-4 left-4 md:-top-12 md:-right-12 md:left-auto md:right-2",
                                "h-10 w-10 flex items-center justify-center rounded-full",
                                "bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md",
                                "border border-white/20 text-white/70 hover:text-white",
                                "transition-all duration-300 z-50 shadow-lg"
                            )}
                        >
                            <X size={24} className="md:hidden" />
                            <X size={20} className="hidden md:block" />
                        </button>

                        <div className={cn(
                            "relative w-full flex-1 md:flex-none md:h-full rounded-b-3xl md:rounded-2xl overflow-hidden",
                            "shadow-2xl bg-black/50 border-b border-white/10 md:border md:border-white/10"
                        )}>
                            <DoubleTapLikeOverlay
                                wallpaper={wallpaper}
                                className="w-full h-full flex items-center justify-center p-4 md:p-10"
                            >
                                <Image
                                    src={getModalImageUrl(wallpaper.image_url)}
                                    alt={wallpaper.name}
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    sizes="100vw"
                                    priority
                                    unoptimized
                                />
                            </DoubleTapLikeOverlay>

                            <div className="hidden md:flex absolute top-4 left-4 flex-wrap gap-2 z-20">
                                <ModalControls
                                    wallpaper={wallpaper}
                                    showInfo={showInfo}
                                    setShowInfo={setShowInfo}
                                />
                            </div>
                        </div>

                        <div className="md:hidden w-full flex items-center justify-between px-6 py-8 bg-black">
                            <ModalControls
                                wallpaper={wallpaper}
                                showInfo={showInfo}
                                setShowInfo={setShowInfo}
                                isMobile
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface ModalControlsProps {
    wallpaper: Wallpaper;
    showInfo: boolean;
    setShowInfo: (show: boolean) => void;
    isMobile?: boolean;
}

function ModalControls({ wallpaper, showInfo, setShowInfo, isMobile }: ModalControlsProps) {
    const btnBase = "flex items-center justify-center rounded-full transition-all";
    const iconBtnClass = cn(btnBase, isMobile ? "h-11 w-11" : "h-10 w-10");

    return (
        <div className={cn("flex items-center", isMobile ? "w-full justify-evenly" : "gap-3")}>
            <div
                className="relative"
                onMouseEnter={() => !isMobile && setShowInfo(true)}
                onMouseLeave={() => !isMobile && setShowInfo(false)}
                onClick={() => setShowInfo(!showInfo)}
            >
                <button
                    className={cn(
                        glassIcon(),
                        iconBtnClass,
                        'text-white',
                        showInfo && "bg-white/20 text-[#00e5ff]"
                    )}
                >
                    <Info size={24} className="md:w-5 md:h-5" />
                </button>

                <WallpaperInfo
                    wallpaper={wallpaper}
                    isVisible={showInfo}
                    position="modal"
                />
            </div>

            <FavoriteButton
                wallpaper={wallpaper}
                className={iconBtnClass}
            />

            <DownloadButton
                wallpaperId={wallpaper.id}
                imageUrl={wallpaper.image_url}
                filename={`${wallpaper.name}.${wallpaper.format.toLowerCase()}`}
                variant="link"
                className={cn(
                    isMobile ? "h-11 w-11 px-0 justify-center" : "h-10"
                )}
            />

            <ShareButton
                url={`${typeof window !== 'undefined' ? window.location.origin : ''}/wallpapers/${wallpaper.id}`}
                title={`Check out the ${wallpaper.name} wallpaper on 4K Walls!`}
                imageUrl={getModalImageUrl(wallpaper.image_url)}
                imageAlt={wallpaper.name}
                className={iconBtnClass}
            />
        </div>
    );
}
