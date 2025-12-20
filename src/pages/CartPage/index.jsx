import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getDisplayImageUrl } from '../../utils/imageHelper';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <h2>Giỏ hàng trống</h2>
                        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Giỏ hàng</h1>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        <div className="cart-header">
                            <span className="col-product">Sản phẩm</span>
                            <span className="col-price">Đơn giá</span>
                            <span className="col-quantity">Số lượng</span>
                            <span className="col-total">Thành tiền</span>
                            <span className="col-action"></span>
                        </div>

                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-product">
                                    <Link to={`/products/${item.id}`} className="item-image">
                                        <img
                                            src={getDisplayImageUrl(item.hinh_anh)}
                                            alt={item.ten_tui}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                            }}
                                        />
                                    </Link>
                                    <div className="item-info">
                                        <Link to={`/products/${item.id}`} className="item-name">
                                            {item.ten_tui}
                                        </Link>
                                        <span className="item-category">{item.danh_muc?.ten_danh_muc}</span>
                                    </div>
                                </div>

                                <div className="item-price">
                                    {formatPrice(item.gia_tien)}
                                </div>

                                <div className="item-quantity">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.so_luong_ton}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="item-total">
                                    {formatPrice(item.gia_tien * item.quantity)}
                                </div>

                                <button
                                    className="item-remove"
                                    onClick={() => removeFromCart(item.id)}
                                    title="Xóa"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary">
                        <h3>Tóm tắt đơn hàng</h3>

                        <div className="summary-row">
                            <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                        </div>

                        <div className="summary-row">
                            <span>Phí vận chuyển</span>
                            <span className="free-shipping">
                                {getTotalPrice() >= 1000000 ? 'Miễn phí' : formatPrice(30000)}
                            </span>
                        </div>

                        <div className="summary-total">
                            <span>Tổng cộng</span>
                            <span className="total-price">
                                {formatPrice(getTotalPrice() + (getTotalPrice() >= 1000000 ? 0 : 30000))}
                            </span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary btn-lg checkout-btn">
                            Tiến hành thanh toán
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>

                        <Link to="/products" className="continue-shopping">
                            ← Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
