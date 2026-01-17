import { getProxiedImageUrl } from './helpers';
import { ANIMATION } from '@/lib/constants';

export const handleDownload = async (url: string, filename: string): Promise<void> => {
    // Use proxied URL through Next.js rewrites (/images/* -> R2)
    const downloadUrl = getProxiedImageUrl(url);

    try {
        const response = await fetch(downloadUrl, {
            mode: 'cors',
            cache: 'no-cache',
        });

        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => window.URL.revokeObjectURL(blobUrl), ANIMATION.REVOKE_OBJECT_URL);
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
};
