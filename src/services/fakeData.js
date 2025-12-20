// Fake Data Service - Sẽ thay thế bằng API thật sau

export const fakeProducts = [
    {
        id: 1,
        ten_tui: "Túi Xách Tay Elegance Premium",
        gia_tien: 2890000,
        so_luong_ton: 15,
        mo_ta: "Túi xách tay da cao cấp, thiết kế sang trọng với đường may tinh tế. Phù hợp đi làm, dự tiệc và các sự kiện quan trọng. Chất liệu da thật mềm mại, bền đẹp theo thời gian.",
        danh_muc: { id: 1, ten_danh_muc: "Túi xách tay" },
        hinh_anh: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        mau_sac: "Đen",
        featured: true
    },
    {
        id: 2,
        ten_tui: "Túi Đeo Chéo Mini Vintage",
        gia_tien: 1290000,
        so_luong_ton: 25,
        mo_ta: "Túi đeo chéo nhỏ gọn phong cách vintage, tiện lợi cho dạo phố. Thiết kế thời thượng với khóa kim loại mạ vàng.",
        danh_muc: { id: 2, ten_danh_muc: "Túi đeo chéo" },
        hinh_anh: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
        mau_sac: "Nâu",
        featured: true
    },
    {
        id: 3,
        ten_tui: "Túi Xách Tay Classic Lady",
        gia_tien: 3490000,
        so_luong_ton: 8,
        mo_ta: "Mẫu túi xách tay cổ điển dành cho quý cô thanh lịch. Được làm từ da bò Ý nhập khẩu, đường may thủ công tỉ mỉ.",
        danh_muc: { id: 1, ten_danh_muc: "Túi xách tay" },
        hinh_anh: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
        mau_sac: "Đỏ đô",
        featured: true
    },
    {
        id: 4,
        ten_tui: "Túi Đeo Chéo Urban Chic",
        gia_tien: 1590000,
        so_luong_ton: 20,
        mo_ta: "Túi đeo chéo hiện đại cho phong cách đường phố. Ngăn chứa đồ thông minh, dây đeo có thể điều chỉnh.",
        danh_muc: { id: 2, ten_danh_muc: "Túi đeo chéo" },
        hinh_anh: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500",
        mau_sac: "Đen",
        featured: true
    },
    {
        id: 5,
        ten_tui: "Túi Xách Tay Office Professional",
        gia_tien: 2190000,
        so_luong_ton: 12,
        mo_ta: "Túi xách tay công sở chuyên nghiệp, có ngăn đựng laptop 13 inch. Thiết kế tối giản, màu sắc trung tính.",
        danh_muc: { id: 1, ten_danh_muc: "Túi xách tay" },
        hinh_anh: "https://images.unsplash.com/photo-1614179689702-355944cd0918?w=500",
        mau_sac: "Xám",
        featured: false
    },
    {
        id: 6,
        ten_tui: "Túi Đeo Chéo Summer Breeze",
        gia_tien: 890000,
        so_luong_ton: 30,
        mo_ta: "Túi đeo chéo nhẹ nhàng cho mùa hè. Chất liệu vải canvas kết hợp da, dễ vệ sinh.",
        danh_muc: { id: 2, ten_danh_muc: "Túi đeo chéo" },
        hinh_anh: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500",
        mau_sac: "Be",
        featured: false
    },
    {
        id: 7,
        ten_tui: "Túi Xách Tay Evening Glamour",
        gia_tien: 4290000,
        so_luong_ton: 5,
        mo_ta: "Túi xách tay dạ tiệc sang trọng với điểm nhấn kim sa lấp lánh. Hoàn hảo cho các buổi tiệc tối và sự kiện đặc biệt.",
        danh_muc: { id: 1, ten_danh_muc: "Túi xách tay" },
        hinh_anh: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=500",
        mau_sac: "Vàng gold",
        featured: true
    },
    {
        id: 8,
        ten_tui: "Túi Đeo Chéo Adventure",
        gia_tien: 1190000,
        so_luong_ton: 18,
        mo_ta: "Túi đeo chéo phong cách năng động cho những chuyến đi. Chống nước, nhiều ngăn tiện ích.",
        danh_muc: { id: 2, ten_danh_muc: "Túi đeo chéo" },
        hinh_anh: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        mau_sac: "Xanh navy",
        featured: false
    },
    {
        id: 9,
        ten_tui: "Túi Xách Tay Bohemian Dream",
        gia_tien: 1890000,
        so_luong_ton: 10,
        mo_ta: "Túi xách tay phong cách bohemian với họa tiết thêu tay độc đáo. Thể hiện cá tính riêng của bạn.",
        danh_muc: { id: 1, ten_danh_muc: "Túi xách tay" },
        hinh_anh: "https://images.unsplash.com/photo-1564422167509-4f8763ff046e?w=500",
        mau_sac: "Nhiều màu",
        featured: false
    },
    {
        id: 10,
        ten_tui: "Túi Đeo Chéo Minimalist",
        gia_tien: 990000,
        so_luong_ton: 22,
        mo_ta: "Túi đeo chéo tối giản cho người yêu thích phong cách đơn giản. Gọn nhẹ, đựng vừa đủ đồ cần thiết.",
        danh_muc: { id: 2, ten_danh_muc: "Túi đeo chéo" },
        hinh_anh: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=500",
        mau_sac: "Trắng",
        featured: false
    },
    {
        id: 11,
        ten_tui: "Túi Xách Tay Royal Crown",
        gia_tien: 5890000,
        so_luong_ton: 3,
        mo_ta: "Túi xách tay cao cấp nhất trong bộ sưu tập. Da cá sấu thật, khóa mạ vàng 18K, giới hạn 100 chiếc.",
        danh_muc: { id: 1, ten_danh_muc: "Túi xách tay" },
        hinh_anh: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=500",
        mau_sac: "Đen",
        featured: true
    },
    {
        id: 12,
        ten_tui: "Túi Đeo Chéo Daily Essential",
        gia_tien: 790000,
        so_luong_ton: 35,
        mo_ta: "Túi đeo chéo cơ bản cho mọi ngày. Giá cả phải chăng, chất lượng đảm bảo.",
        danh_muc: { id: 2, ten_danh_muc: "Túi đeo chéo" },
        hinh_anh: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
        mau_sac: "Nâu nhạt",
        featured: false
    }
];

export const fakeCategories = [
    { id: 1, ten_danh_muc: "Túi xách tay", slug: "tui-xach-tay", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300" },
    { id: 2, ten_danh_muc: "Túi đeo chéo", slug: "tui-deo-cheo", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300" }
];

export const fakeOrders = [
    {
        id: "ORD001",
        ngay_dat: "2024-12-10T10:30:00",
        trang_thai: "Đang giao",
        tong_tien: 4180000,
        san_pham: [
            { ...fakeProducts[0], so_luong: 1 },
            { ...fakeProducts[1], so_luong: 1 }
        ],
        dia_chi: "123 Nguyễn Huệ, Q.1, TP.HCM"
    },
    {
        id: "ORD002",
        ngay_dat: "2024-12-05T14:20:00",
        trang_thai: "Đã giao",
        tong_tien: 3490000,
        san_pham: [
            { ...fakeProducts[2], so_luong: 1 }
        ],
        dia_chi: "456 Lê Lợi, Q.3, TP.HCM"
    }
];

// Fake User
export const fakeUser = {
    id: 1,
    ho_ten: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    so_dien_thoai: "0901234567",
    dia_chi: "789 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM"
};

// API Simulation Functions
export const getProducts = (filters = {}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let result = [...fakeProducts];

            // Filter by category
            if (filters.category && filters.category !== 'all') {
                result = result.filter(p => p.danh_muc.ten_danh_muc === filters.category);
            }

            // Filter by price range
            if (filters.minPrice) {
                result = result.filter(p => p.gia_tien >= filters.minPrice);
            }
            if (filters.maxPrice) {
                result = result.filter(p => p.gia_tien <= filters.maxPrice);
            }

            // Search
            if (filters.search) {
                const search = filters.search.toLowerCase();
                result = result.filter(p =>
                    p.ten_tui.toLowerCase().includes(search) ||
                    p.mo_ta.toLowerCase().includes(search)
                );
            }

            // Sort
            if (filters.sort) {
                switch (filters.sort) {
                    case 'price-asc':
                        result.sort((a, b) => a.gia_tien - b.gia_tien);
                        break;
                    case 'price-desc':
                        result.sort((a, b) => b.gia_tien - a.gia_tien);
                        break;
                    case 'name':
                        result.sort((a, b) => a.ten_tui.localeCompare(b.ten_tui));
                        break;
                    default:
                        break;
                }
            }

            resolve({ success: true, data: result });
        }, 300);
    });
};

export const getProductById = (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const product = fakeProducts.find(p => p.id === parseInt(id));
            if (product) {
                resolve({ success: true, data: product });
            } else {
                resolve({ success: false, error: 'Product not found' });
            }
        }, 200);
    });
};

export const getFeaturedProducts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const featured = fakeProducts.filter(p => p.featured);
            resolve({ success: true, data: featured });
        }, 200);
    });
};

export const createOrder = (orderData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newOrder = {
                id: `ORD${Date.now()}`,
                ngay_dat: new Date().toISOString(),
                trang_thai: "Chờ xác nhận",
                ...orderData
            };
            resolve({ success: true, data: newOrder });
        }, 500);
    });
};

export const getUserOrders = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, data: fakeOrders });
        }, 300);
    });
};

export const loginUser = (email, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Fake login - accept any credentials for demo
            if (email && password) {
                resolve({
                    success: true,
                    data: {
                        token: 'fake_token_' + Date.now(),
                        user: fakeUser
                    }
                });
            } else {
                resolve({ success: false, error: 'Email và mật khẩu không được để trống' });
            }
        }, 500);
    });
};

export const registerUser = (userData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    token: 'fake_token_' + Date.now(),
                    user: { id: Date.now(), ...userData }
                }
            });
        }, 500);
    });
};
