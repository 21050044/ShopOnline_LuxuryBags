const config = {
    // Backend API URL
    API_BASE_URL: 'https://indicated-climbing-marketing-explanation.trycloudflare.com',

    // AI Generate API URL (riêng)
    AI_API_URL: 'https://4c5757b9dd01.ngrok-free.app',

    // API Endpoints
    ENDPOINTS: {
        // Auth
        LOGIN: '/api/login/',
        REGISTER: '/api/register/',
        LOGOUT: '/api/logout/',

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
