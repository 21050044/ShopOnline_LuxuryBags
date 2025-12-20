import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById, getProducts } from '../../services/api';
import { getDisplayImageUrl } from '../../utils/imageHelper';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const result = await getProductById(id);
            if (result.success) {
                setProduct(result.data);

                // Fetch related products
                if (result.data.danh_muc?.ten_danh_muc) {
                    const relatedResult = await getProducts({
                        category: result.data.danh_muc.ten_danh_muc
                    });
                    if (relatedResult.success) {
                        setRelatedProducts(
                            relatedResult.data.filter(p => p.id !== result.data.id).slice(0, 4)
                        );
                    }
                }
            } else {
                navigate('/products');
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id, navigate]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div className="not-found">
                        <h2>Sản phẩm không tồn tại</h2>
                        <Link to="/products" className="btn btn-primary">Quay lại sản phẩm</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Convert Google Drive link
    const imageUrl = getDisplayImageUrl(product.hinh_anh);

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/products">Sản phẩm</Link>
                    <span>/</span>
                    <Link to={`/products?category=${product.danh_muc?.ten_danh_muc}`}>
                        {product.danh_muc?.ten_danh_muc}
                    </Link>
                    <span>/</span>
                    <span className="current">{product.ten_tui}</span>
                </nav>

                {/* Product Detail */}
                <div className="product-detail">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img
                                src={imageUrl}
                                alt={product.ten_tui}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                                }}
                            />
                            {product.featured && (
                                <span className="product-badge">Hot</span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <span className="product-category">{product.danh_muc?.ten_danh_muc}</span>
                        <h1 className="product-name">{product.ten_tui}</h1>

                        <div className="product-price-section">
                            <span className="product-price">{formatPrice(product.gia_tien)}</span>
                            <span className={`stock-status ${product.so_luong_ton > 0 ? 'in-stock' : 'out-stock'}`}>
                                {product.so_luong_ton > 0 ? `Còn ${product.so_luong_ton} sản phẩm` : 'Hết hàng'}
                            </span>
                        </div>

                        <div className="product-description">
                            <h4>Mô tả sản phẩm</h4>
                            <p>{product.mo_ta}</p>
                        </div>

                        {product.mau_sac && (
                            <div className="product-color">
                                <h4>Màu sắc</h4>
                                <span className="color-badge">{product.mau_sac}</span>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="purchase-section">
                            <div className="quantity-selector">
                                <span>Số lượng:</span>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.min(product.so_luong_ton, Math.max(1, parseInt(e.target.value) || 1)))}
                                        min="1"
                                        max={product.so_luong_ton}
                                    />
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.so_luong_ton, q + 1))}
                                        disabled={quantity >= product.so_luong_ton}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button
                                    className={`btn btn-primary btn-lg add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                    onClick={handleAddToCart}
                                    disabled={product.so_luong_ton === 0}
                                >
                                    {addedToCart ? (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 6L9 17l-5-5" />
                                            </svg>
                                            Đã thêm vào giỏ
                                        </>
                                    ) : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="9" cy="21" r="1" />
                                                <circle cx="20" cy="21" r="1" />
                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                            </svg>
                                            Thêm vào giỏ hàng
                                        </>
                                    )}
                                </button>
                                <Link to="/cart" className="btn btn-secondary btn-lg">
                                    Mua ngay
                                </Link>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="info-cards">
                            <div className="info-card">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                                    <path d="M16 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6" />
                                </svg>
                                <span>Miễn phí vận chuyển đơn từ 1 triệu</span>
                            </div>
                            <div className="info-card">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>Bảo hành 12 tháng</span>
                            </div>
                            <div className="info-card">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M23 4v6h-6M1 20v-6h6" />
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>
                                <span>Đổi trả trong 7 ngày</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="related-products">
                        <h2>Sản phẩm liên quan</h2>
                        <div className="related-grid">
                            {relatedProducts.map(p => (
                                <Link key={p.id} to={`/products/${p.id}`} className="related-item">
                                    <div className="related-image">
                                        <img src={getDisplayImageUrl(p.hinh_anh)} alt={p.ten_tui} />
                                    </div>
                                    <div className="related-info">
                                        <h4>{p.ten_tui}</h4>
                                        <span className="price">{formatPrice(p.gia_tien)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
