export const handleDownload = async (url: string, filename: string): Promise<void> => {
    try {
        const response = await fetch(url, {
            mode: 'cors',
            cache: 'no-cache', // Ensure we get fresh data, though mostly R2 is static
        });

        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename; // Use the provided filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Small delay to ensure click propagated before cleanup
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error; // Re-throw to handle in UI
    }
};
