import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getDisplayImageUrl } from '../../utils/imageHelper';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    // Convert Google Drive link nếu cần
    const imageUrl = getDisplayImageUrl(product.hinh_anh);

    return (
        <div className="product-card">
            <Link to={`/products/${product.id}`} className="product-link">
                {/* Image */}
                <div className="product-image-wrapper">
                    <img
                        src={imageUrl}
                        alt={product.ten_tui}
                        className="product-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                    />
                    {product.so_luong_ton <= 5 && product.so_luong_ton > 0 && (
                        <span className="product-badge badge-warning">Còn {product.so_luong_ton}</span>
                    )}
                    {product.so_luong_ton === 0 && (
                        <span className="product-badge badge-error">Hết hàng</span>
                    )}
                    {product.featured && (
                        <span className="product-badge badge-featured">Hot</span>
                    )}

                    {/* Hover Actions */}
                    <div className="product-actions">
                        <button
                            className="action-button cart-action"
                            onClick={handleAddToCart}
                            disabled={product.so_luong_ton === 0}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span>Thêm vào giỏ</span>
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="product-info">
                    <span className="product-category">{product.danh_muc?.ten_danh_muc}</span>
                    <h3 className="product-name">{product.ten_tui}</h3>
                    <p className="product-price">{formatPrice(product.gia_tien)}</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
