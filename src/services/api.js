// API Service - Gọi Backend API thật
import config from '../config/config';

// Helper function để lấy token từ localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function để xử lý response
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP Error: ${response.status}`);
    }
    return response.json();
};

// ==================== PRODUCTS API ====================

/**
 * Lấy danh sách sản phẩm
 * @param {Object} filters - { category, search, sort, featured }
 */
export const getProducts = async (filters = {}) => {
    try {
        const params = new URLSearchParams();

        if (filters.category) {
            params.append('danh_muc__ten_danh_muc', filters.category);
        }
        if (filters.search) {
            params.append('search', filters.search);
        }
        if (filters.sort) {
            // Map frontend sort to backend ordering
            const sortMap = {
                'name': 'ten_tui',
                'price-asc': 'gia_tien',
                'price-desc': '-gia_tien',
            };
            params.append('ordering', sortMap[filters.sort] || filters.sort);
        }
        if (filters.minPrice) {
            params.append('gia_tien__gte', filters.minPrice);
        }
        if (filters.maxPrice) {
            params.append('gia_tien__lte', filters.maxPrice);
        }

        const queryString = params.toString();
        const url = config.getApiUrl(config.ENDPOINTS.PRODUCTS) + (queryString ? `?${queryString}` : '');

        const response = await fetch(url);
        const data = await handleResponse(response);

        // Normalize data - đảm bảo gia_tien là number
        const normalizedData = data.map(item => ({
            ...item,
            gia_tien: Number(item.gia_tien),
        }));

        return { success: true, data: normalizedData };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Lấy sản phẩm nổi bật (featured)
 */
export const getFeaturedProducts = async () => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.PRODUCTS) + '?featured=true';
        const response = await fetch(url);
        const data = await handleResponse(response);

        const normalizedData = data.map(item => ({
            ...item,
            gia_tien: Number(item.gia_tien),
        }));

        return { success: true, data: normalizedData };
    } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback: lấy 8 sản phẩm đầu tiên nếu không có filter featured
        return getProducts({});
    }
};

/**
 * Lấy chi tiết 1 sản phẩm
 * @param {number|string} id 
 */
export const getProductById = async (id) => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.PRODUCT_DETAIL(id));
        const response = await fetch(url);
        const data = await handleResponse(response);

        return {
            success: true,
            data: {
                ...data,
                gia_tien: Number(data.gia_tien),
            }
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, error: error.message };
    }
};

// ==================== CATEGORIES API ====================

/**
 * Lấy danh sách danh mục
 */
export const getCategories = async () => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.CATEGORIES);
        const response = await fetch(url);
        const data = await handleResponse(response);

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: error.message };
    }
};

// ==================== AUTH API ====================

/**
 * Đăng nhập
 * @param {string} email 
 * @param {string} password 
 */
export const login = async (email, password) => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.LOGIN);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password }),
        });

        const data = await handleResponse(response);

        // Lưu tokens vào localStorage
        if (data.access) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
        }

        // Normalize user info
        const user = {
            id: data.user_info?.id,
            ho_ten: data.user_info?.ho_ten,
            email: data.user_info?.email,
            so_dien_thoai: data.user_info?.sdt, // Map sdt -> so_dien_thoai
        };

        return { success: true, data: user };
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, error: 'Email hoặc mật khẩu không đúng' };
    }
};

/**
 * Đăng ký tài khoản
 * @param {Object} userData - { ho_ten, email, so_dien_thoai, password, dia_chi }
 */
export const register = async (userData) => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.REGISTER);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ho_ten: userData.ho_ten,
                email: userData.email,
                so_dien_thoai: userData.so_dien_thoai,
                password: userData.password,
                dia_chi: userData.dia_chi || '',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || 'Đăng ký thất bại');
        }

        const data = await response.json();

        // Nếu API trả về token sau đăng ký
        if (data.access) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
        }

        // Normalize user info
        const user = {
            id: data.user_info?.id || data.id,
            ho_ten: data.user_info?.ho_ten || userData.ho_ten,
            email: data.user_info?.email || userData.email,
            so_dien_thoai: data.user_info?.sdt || userData.so_dien_thoai,
            dia_chi: userData.dia_chi,
        };

        return { success: true, data: user };
    } catch (error) {
        console.error('Error registering:', error);
        return { success: false, error: error.message || 'Đăng ký thất bại' };
    }
};

/**
 * Đăng xuất
 */
export const logout = async () => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.LOGOUT);
        const refreshToken = localStorage.getItem('refresh_token');

        await fetch(url, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        // Xóa tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        return { success: true };
    } catch (error) {
        // Vẫn xóa tokens dù có lỗi
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return { success: true };
    }
};

// ==================== PROFILE API ====================

/**
 * Lấy thông tin profile
 */
export const getProfile = async () => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.PROFILE);
        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });

        const result = await handleResponse(response);

        return { success: true, data: result.data || result };
    } catch (error) {
        console.error('Error fetching profile:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Cập nhật thông tin profile
 * @param {Object} profileData - { ho_ten, so_dien_thoai, dia_chi, ... }
 */
export const updateProfile = async (profileData) => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.PROFILE);
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        const result = await handleResponse(response);

        return { success: true, data: result.data || result };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
    }
};

// ==================== ORDERS API ====================

/**
 * Tạo đơn hàng mới
 * @param {Object} orderData - { cart_items, ho_ten, sdt, dia_chi, payment_method, ghi_chu }
 */
export const createOrder = async (orderData) => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.ORDERS);

        // Format request body theo API mới
        const requestBody = {
            cart_items: orderData.cart_items.map(item => ({
                id: item.id,
                quantity: item.quantity,
            })),
            ho_ten: orderData.ho_ten,
            sdt: orderData.sdt,
            dia_chi: orderData.dia_chi,
            payment_method: orderData.payment_method || 'COD',
            ghi_chu: orderData.ghi_chu || '',
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = await handleResponse(response);

        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Lấy lịch sử đơn hàng của user
 */
export const getUserOrders = async () => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.ORDERS);
        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });

        const result = await handleResponse(response);
        const orders = result.data || result;

        // Normalize data để khớp với frontend (bao gồm thông tin VIP/giảm giá)
        const normalizedOrders = Array.isArray(orders) ? orders.map(order => ({
            id: order.id,
            ma_hoa_don: order.ma_hoa_don,
            ngay_dat: order.ngay_tao,
            trang_thai: order.trang_thai,
            trang_thai_text: order.trang_thai_text || mapOrderStatus(order.trang_thai),
            tong_tien_hang: Number(order.tong_tien_hang) || 0,
            giam_gia: Number(order.giam_gia) || 0,
            thanh_tien: Number(order.thanh_tien) || 0,
            tong_tien: Number(order.thanh_tien) || Number(order.tong_tien_hang) || 0,
            dia_chi: order.dia_chi_giao_hang || order.dia_chi || '',
            san_pham: (order.chi_tiet || []).map(item => ({
                id: item.id,
                ten_tui: item.ten_san_pham || item.ten_tui,
                hinh_anh: item.anh_dai_dien || item.hinh_anh,
                so_luong: item.so_luong,
                gia_tien: Number(item.don_gia_luc_ban) || Number(item.gia_tien) || 0,
            })),
        })) : [];

        return { success: true, data: normalizedOrders };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Lấy chi tiết 1 đơn hàng
 * @param {number|string} id 
 */
export const getOrderById = async (id) => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.ORDER_DETAIL(id));
        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });

        const result = await handleResponse(response);

        return { success: true, data: result.data || result };
    } catch (error) {
        console.error('Error fetching order:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Hủy đơn hàng
 * @param {number|string} orderId 
 */
export const cancelOrder = async (orderId) => {
    try {
        const url = config.getApiUrl(config.ENDPOINTS.ORDER_CANCEL(orderId));
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        const result = await handleResponse(response);

        return { success: true, data: result };
    } catch (error) {
        console.error('Error canceling order:', error);
        return { success: false, error: error.message };
    }
};

// Helper: Map trạng thái đơn hàng
const mapOrderStatus = (status) => {
    const statusMap = {
        'CHO_XAC_NHAN': 'Chờ xác nhận',
        'DA_XAC_NHAN': 'Đã xác nhận/Đóng gói',
        'DANG_GIAO': 'Đang vận chuyển',
        'HOAN_THANH': 'Đã hoàn thành',
        'DA_HUY': 'Đã hủy',
    };
    return statusMap[status] || status;
};

// ==================== AI GENERATE API ====================

/**
 * Generate hình ảnh từ AI
 * @param {HTMLCanvasElement} canvas 
 */
export const generateAIArt = async (canvas) => {
    if (!canvas) {
        return { success: false, error: 'Không tìm thấy canvas!' };
    }

    try {
        const blob = await new Promise((resolve) =>
            canvas.toBlob((b) => resolve(b), 'image/png')
        );

        if (!blob) {
            throw new Error('Không tạo được blob từ canvas');
        }

        const formData = new FormData();
        formData.append('file', blob, 'input.png');

        const url = config.getAiApiUrl(config.ENDPOINTS.AI_GENERATE);
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Lỗi API: ${response.status}`);
        }

        const resultBlob = await response.blob();
        const resultUrl = URL.createObjectURL(resultBlob);

        return { success: true, data: resultUrl };
    } catch (err) {
        console.error('Error generating AI art:', err);
        return { success: false, error: err.message };
    }
};
