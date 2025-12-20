import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../services/api';
import { getDisplayImageUrl } from '../../utils/imageHelper';
import './Orders.css';

const Orders = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        setLoading(true);
        const result = await getUserOrders();
        if (result.success) {
            setOrders(result.data);
        }
        setLoading(false);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'HOAN_THANH':
                return 'status-success';
            case 'DANG_GIAO':
                return 'status-warning';
            case 'DA_XAC_NHAN':
                return 'status-info';
            case 'DA_HUY':
                return 'status-error';
            case 'CHO_XAC_NHAN':
                return 'status-pending';
            default:
                return 'status-pending';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="not-logged-in">
                        <h2>Bạn chưa đăng nhập</h2>
                        <p>Vui lòng đăng nhập để xem đơn hàng</p>
                        <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <div className="page-header">
                    <h1>Đơn hàng của tôi</h1>
                    <Link to="/profile" className="back-link">
                        ← Quay lại tài khoản
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="no-orders">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        </svg>
                        <h3>Chưa có đơn hàng nào</h3>
                        <p>Bạn chưa thực hiện đơn hàng nào</p>
                        <Link to="/products" className="btn btn-primary">Mua sắm ngay</Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                className="order-card-simple"
                                onClick={() => navigate(`/orders/${order.id}`)}
                            >
                                <div className="order-header">
                                    <div className="order-id">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                                        </svg>
                                        <span>Đơn hàng #{order.ma_hoa_don || order.id}</span>
                                    </div>
                                    <span className={`order-status ${getStatusClass(order.trang_thai)}`}>
                                        {order.trang_thai_text}
                                    </span>
                                </div>

                                <div className="order-date">{formatDate(order.ngay_dat)}</div>

                                <div className="order-products">
                                    {order.san_pham.slice(0, 3).map((item, index) => (
                                        <img
                                            key={index}
                                            src={getDisplayImageUrl(item.hinh_anh)}
                                            alt={item.ten_tui}
                                            className="product-preview"
                                        />
                                    ))}
                                    {order.san_pham.length > 3 && (
                                        <div className="more-products">+{order.san_pham.length - 3}</div>
                                    )}
                                </div>

                                <div className="order-footer">
                                    <div className="order-info">
                                        <span className="items-count">{order.san_pham.length} sản phẩm</span>
                                        {order.giam_gia > 0 && (
                                            <span className="discount">-{formatPrice(order.giam_gia)}</span>
                                        )}
                                    </div>
                                    <div className="order-total">
                                        <span className="total-label">Thành tiền:</span>
                                        <span className="total-price">{formatPrice(order.thanh_tien)}</span>
                                    </div>
                                    <svg className="view-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
