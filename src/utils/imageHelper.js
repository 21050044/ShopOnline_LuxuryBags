// Helper utilities cho image handling

/**
 * Convert Google Drive link sang direct image link có thể embed được
 * 
 * QUAN TRỌNG:
 * - Link /file/d/FILE_ID/view là PREVIEW PAGE, KHÔNG thể dùng trong <img> tag
 * - Phải dùng proxy để bypass CORS
 * 
 * @param {string} url - Google Drive URL từ API
 * @returns {string} - Direct image URL có thể embed
 */
export const convertGoogleDriveLink = (url) => {
    // Nếu không phải Google Drive link, trả về nguyên gốc
    if (!url || !url.includes('drive.google.com')) {
        return url;
    }

    // Extract file ID from Google Drive URL
    // Hỗ trợ các format:
    // 1. https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // 2. https://drive.google.com/file/d/FILE_ID/view?usp=drivesdk  
    // 3. https://drive.google.com/d/FILE_ID/view
    // 4. https://drive.google.com/open?id=FILE_ID

    // Method 1: Match /file/d/FILE_ID hoặc /d/FILE_ID
    const fileIdMatch = url.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];

        // Dùng images.weserv.nl proxy để bypass CORS
        const googleDriveUrl = `https://drive.google.com/uc?id=${fileId}`;
        return `https://images.weserv.nl/?url=${encodeURIComponent(googleDriveUrl)}`;
    }

    // Method 2: Match ?id=FILE_ID (open link format)
    const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (idParamMatch && idParamMatch[1]) {
        const googleDriveUrl = `https://drive.google.com/uc?id=${idParamMatch[1]}`;
        return `https://images.weserv.nl/?url=${encodeURIComponent(googleDriveUrl)}`;
    }

    // Fallback: trả về url gốc
    return url;
};

/**
 * Get thumbnail URL for Google Drive image
 * Useful for preview/list views where you want smaller images
 * 
 * @param {string} url - Google Drive URL
 * @param {number} size - Thumbnail width (default 400)
 * @returns {string} - Thumbnail URL
 */
export const getGoogleDriveThumbnail = (url, size = 400) => {
    if (!url || !url.includes('drive.google.com')) {
        return url;
    }

    const fileIdMatch = url.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w${size}`;
    }

    return url;
};

/**
 * Get displayable image URL - handles both regular URLs and Google Drive URLs
 * 
 * @param {string} url - Image URL (có thể là Google Drive hoặc URL thường)
 * @returns {string} - URL có thể hiển thị trong img tag
 */
export const getDisplayImageUrl = (url) => {
    if (!url) return '';

    // Nếu là Google Drive link, convert
    if (url.includes('drive.google.com')) {
        return convertGoogleDriveLink(url);
    }

    // Trả về URL gốc cho các trường hợp khác
    return url;
};
