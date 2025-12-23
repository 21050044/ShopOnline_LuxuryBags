// API Configuration
// Thay đổi API_BASE_URL khi deploy

const config = {
    // Backend API URL
    API_BASE_URL: 'https://necessarily-neon-grammar-harmony.trycloudflare.com',

    // AI Generate API URL (riêng)
    AI_API_URL: 'http://localhost:8080',

    // API Endpoints
    ENDPOINTS: {
        // Auth
        LOGIN: '/api/login/',
        REGISTER: '/api/auth/register/',
        LOGOUT: '/api/auth/logout/',

        // Products
        PRODUCTS: '/api/products/',
        PRODUCT_DETAIL: (id) => `/api/products/${id}/`,

        // Categories
        CATEGORIES: '/api/categories/',

        // Profile
        PROFILE: '/api/profile/',

        // Orders - API mới
        ORDERS: '/api/my-orders/',
        ORDER_DETAIL: (id) => `/api/my-orders/${id}/`,
        ORDER_CANCEL: (id) => `/api/my-orders/${id}/cancel/`,

        // AI Generate
        AI_GENERATE: '/generate/',
    },

    // Helper function to get full API URL
    getApiUrl: (endpoint) => {
        return `${config.API_BASE_URL}${endpoint}`;
    },

    // Helper function to get AI API URL
    getAiApiUrl: (endpoint) => {
        return `${config.AI_API_URL}${endpoint}`;
    },
};

export default config;
