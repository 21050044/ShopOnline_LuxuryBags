import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { getFeaturedProducts, getCategories } from '../../services/api';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch featured products
            const productsResult = await getFeaturedProducts();
            if (productsResult.success) {
                setFeaturedProducts(productsResult.data);
            }

            // Fetch categories
            const categoriesResult = await getCategories();
            if (categoriesResult.success) {
                setCategories(categoriesResult.data);
            }

            setLoading(false);
        };
        fetchData();
    }, []);

    // Fallback categories nếu API chưa có
    const displayCategories = categories.length > 0 ? categories : [
        { id: 1, ten_danh_muc: 'Túi Xách Tay', slug: 'tui-xach-tay', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800' },
        { id: 2, ten_danh_muc: 'Túi Đeo Chéo', slug: 'tui-deo-cheo', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800' },
    ];

    return (
        <div className="home-page">
            {/* Hero Banner */}
            <section className="hero">
                <div className="hero-background">
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <span className="hero-badge">Bộ sưu tập mới 2025</span>
                    <h1 className="hero-title">
                        Túi Xách <span className="text-accent">Cao Cấp</span>
                    </h1>
                    <p className="hero-subtitle">
                        Khẳng định phong cách với những thiết kế sang trọng,
                        chất lượng đỉnh cao từ các thương hiệu hàng đầu.
                    </p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Khám phá ngay
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link to="/products?category=Túi Xách Tay" className="btn btn-outline btn-lg">
                            Túi xách tay
                        </Link>
                    </div>
                </div>
                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Sản phẩm</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">400+</span>
                        <span className="stat-label">Khách hàng</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">99%</span>
                        <span className="stat-label">Hài lòng</span>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section categories-section">
                <div className="container">
                    <div className="section-title">
                        <h2>Danh mục sản phẩm</h2>
                        <p>Chọn phong cách phù hợp với bạn</p>
                    </div>
                    <div className="categories-grid">
                        {displayCategories.map((category) => {
                            // Helper to get image based on category name
                            const getCategoryImage = (name) => {
                                const lowerName = name?.toLowerCase() || '';
                                if (lowerName.includes('xách')) return 'https://unsplash.com/photos/KL_SE98J4_0/download?force=true&w=800';
                                if (lowerName.includes('chéo')) return 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800';
                                if (lowerName.includes('balo')) return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800';
                                return 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'; // Default beautiful bag
                            };

                            return (
                                <Link
                                    key={category.id}
                                    to={`/products?category=${category.ten_danh_muc}`}
                                    className="category-card"
                                >
                                    <div className="category-image">
                                        <img
                                            src={category.image || getCategoryImage(category.ten_danh_muc)}
                                            alt={category.ten_danh_muc}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getCategoryImage(category.ten_danh_muc);
                                            }}
                                        />
                                    </div>
                                    <div className="category-info">
                                        <h3>{category.ten_danh_muc}</h3>
                                        <span className="category-link">
                                            Xem tất cả
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-title">
                            <h2>Sản phẩm nổi bật</h2>
                            <p>Được yêu thích nhất</p>
                        </div>
                        <Link to="/products" className="view-all-link">
                            Xem tất cả
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {featuredProducts.slice(0, 6).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* AI Banner */}
            <section className="ai-banner">
                <div className="container">
                    <div className="ai-content">
                        <div className="ai-text">
                            <span className="ai-badge">✨ Tính năng mới</span>
                            <h2>Thiết kế túi bằng AI</h2>
                            <p>
                                Sử dụng trí tuệ nhân tạo để tạo ra mẫu túi xách độc đáo theo ý tưởng của riêng bạn.
                                Chỉ cần mô tả, AI sẽ biến ước mơ thành hiện thực!
                            </p>
                            <Link to="/ai-design" className="btn btn-primary btn-lg">
                                Thử ngay
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </Link>
                        </div>
                        <div className="ai-visual">
                            <div className="ai-circle">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                    <path d="M12 6v6l4 2" />
                                    <circle cx="12" cy="12" r="2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                                    <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
                                    <line x1="12" y1="3" x2="12" y2="16" />
                                </svg>
                            </div>
                            <h4>Miễn phí vận chuyển</h4>
                            <p>Đơn hàng từ 1 triệu đồng</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                            </div>
                            <h4>Bảo hành 12 tháng</h4>
                            <p>Đổi mới nếu lỗi nhà sản xuất</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </div>
                            <h4>Hỗ trợ 24/7</h4>
                            <p>Tư vấn nhiệt tình, chu đáo</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <h4>Thanh toán COD</h4>
                            <p>Nhận hàng mới thanh toán</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
