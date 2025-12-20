import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrderById } from '../../services/api';
import { getDisplayImageUrl } from '../../utils/imageHelper';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchOrderDetail();
    }, [id, isAuthenticated]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        setError(null);
        const result = await getOrderById(id);

        if (result.success) {
            setOrder(result.data);
        } else {
            setError(result.error || 'Không thể tải thông tin đơn hàng');
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

    const getOrderProgress = (currentStatus) => {
        const steps = [
            { key: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
            { key: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
            { key: 'DANG_GIAO', label: 'Đang vận chuyển' },
            { key: 'HOAN_THANH', label: 'Hoàn thành' },
        ];

        const currentIndex = steps.findIndex(s => s.key === currentStatus);
        const isCancelled = currentStatus === 'DA_HUY';

        return steps.map((step, index) => ({
            ...step,
            completed: !isCancelled && index < currentIndex,
            active: !isCancelled && index === currentIndex,
        }));
    };

    const getStepIcon = (stepKey) => {
        const icons = {
            'CHO_XAC_NHAN': (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
            ),
            'DA_XAC_NHAN': (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
            ),
            'DANG_GIAO': (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <path d="M16 8h5l3 3v5h-2m-4 0H2" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
            ),
            'HOAN_THANH': (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                </svg>
            ),
        };
        return icons[stepKey];
    };

    const getPaymentMethodText = (method) => {
        return method === 'COD' ? 'Thanh toán khi nhận hàng' : method;
    };

    if (loading) {
        return (
            <div className="order-detail-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Đang tải thông tin đơn hàng...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="order-detail-page">
                <div className="container">
                    <div className="error-container">
                        <h2>Không tìm thấy đơn hàng</h2>
                        <p>{error}</p>
                        <Link to="/orders" className="btn btn-primary">Quay lại danh sách</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-detail-page">
            <div className="container">
                {/* Header */}
                <div className="detail-header">
                    <Link to="/orders" className="back-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Quay lại
                    </Link>
                    <div className="header-info">
                        <h1>Chi tiết đơn hàng #{order.ma_hoa_don || order.id}</h1>
                        <span className={`order-status-badge ${getStatusClass(order.trang_thai)}`}>
                            {order.trang_thai_text || order.trang_thai}
                        </span>
                    </div>
                    <p className="order-date">Đặt hàng lúc: {formatDate(order.ngay_tao)}</p>
                </div>

                {/* Timeline */}
                {order.trang_thai !== 'DA_HUY' && (
                    <div className="timeline-section card">
                        <h3>Trạng thái đơn hàng</h3>
                        <div className="timeline-horizontal">
                            {getOrderProgress(order.trang_thai).map((step, index) => (
                                <div
                                    key={step.key}
                                    className={`timeline-item ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}
                                >
                                    <div className="timeline-icon">
                                        {getStepIcon(step.key)}
                                    </div>
                                    <div className="timeline-label">{step.label}</div>
                                    {index < 3 && (
                                        <div className={`timeline-connector ${step.completed ? 'completed' : ''}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="detail-content">
                    {/* Products */}
                    <div className="products-section card">
                        <h3>Sản phẩm ({order.chi_tiet?.length || 0})</h3>
                        <div className="product-list">
                            {(order.chi_tiet || []).map((item, index) => (
                                <div key={index} className="product-item">
                                    <img src={getDisplayImageUrl(item.anh_dai_dien || item.hinh_anh)} alt={item.ten_san_pham} />
                                    <div className="product-info">
                                        <h4>{item.ten_san_pham}</h4>
                                        <p className="product-qty">x{item.so_luong}</p>
                                    </div>
                                    <div className="product-price">{formatPrice(item.don_gia_luc_ban * item.so_luong)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Sidebar */}
                    <div className="info-sidebar">
                        {/* Delivery Info */}
                        <div className="info-card card">
                            <h3>Thông tin nhận hàng</h3>
                            <div className="info-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span>{order.ho_ten_nguoi_nhan}</span>
                            </div>
                            <div className="info-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>{order.sdt_nguoi_nhan}</span>
                            </div>
                            <div className="info-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{order.dia_chi_giao_hang}</span>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="info-card card">
                            <h3>Thanh toán</h3>
                            <div className="payment-row">
                                <span>Tổng tiền hàng:</span>
                                <span>{formatPrice(order.tong_tien_hang)}</span>
                            </div>
                            {order.giam_gia > 0 && (
                                <div className="payment-row discount">
                                    <span>Giảm giá VIP:</span>
                                    <span>-{formatPrice(order.giam_gia)}</span>
                                </div>
                            )}
                            <div className="payment-row total">
                                <span>Thành tiền:</span>
                                <span className="total-price">{formatPrice(order.thanh_tien)}</span>
                            </div>
                            <div className="payment-method">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                                <span>{getPaymentMethodText(order.phuong_thuc_tt)}</span>
                            </div>
                        </div>

                        {order.ghi_chu && (
                            <div className="info-card card">
                                <h3>Ghi chú</h3>
                                <p className="note-text">{order.ghi_chu}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
