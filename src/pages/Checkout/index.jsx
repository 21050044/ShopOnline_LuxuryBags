import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/api';
import { getDisplayImageUrl } from '../../utils/imageHelper';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [orderResult, setOrderResult] = useState(null);

    // Parse địa chỉ user thành các phần (nếu có)
    const parseUserAddress = () => {
        if (!user?.dia_chi) return { tinh_thanh: '', quan_huyen: '', dia_chi_chi_tiet: '' };

        // Giả sử địa chỉ được lưu theo format: "địa chỉ chi tiết, quận/huyện, tỉnh/thành"
        const parts = user.dia_chi.split(',').map(p => p.trim());

        if (parts.length >= 3) {
            return {
                dia_chi_chi_tiet: parts.slice(0, parts.length - 2).join(', '),
                quan_huyen: parts[parts.length - 2] || '',
                tinh_thanh: parts[parts.length - 1] || ''
            };
        } else if (parts.length === 2) {
            return {
                dia_chi_chi_tiet: parts[0] || '',
                quan_huyen: parts[1] || '',
                tinh_thanh: ''
            };
        }

        // Nếu không parse được, đặt toàn bộ vào địa chỉ chi tiết
        return { dia_chi_chi_tiet: user.dia_chi, quan_huyen: '', tinh_thanh: '' };
    };

    const parsedAddress = parseUserAddress();

    const [formData, setFormData] = useState({
        ho_ten: user?.ho_ten || '',
        so_dien_thoai: user?.so_dien_thoai || '',
        email: user?.email || '',
        tinh_thanh: parsedAddress.tinh_thanh,
        quan_huyen: parsedAddress.quan_huyen,
        dia_chi_chi_tiet: parsedAddress.dia_chi_chi_tiet,
        ghi_chu: ''
    });

    const [errors, setErrors] = useState({});

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const shippingFee = getTotalPrice() >= 1000000 ? 0 : 30000;
    const totalAmount = getTotalPrice() + shippingFee;

    const validateForm = () => {
        const newErrors = {};
        if (!formData.ho_ten.trim()) newErrors.ho_ten = 'Vui lòng nhập họ tên';
        if (!formData.so_dien_thoai.trim()) {
            newErrors.so_dien_thoai = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.so_dien_thoai)) {
            newErrors.so_dien_thoai = 'Số điện thoại không hợp lệ';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.tinh_thanh.trim()) newErrors.tinh_thanh = 'Vui lòng nhập tỉnh/thành phố';
        if (!formData.quan_huyen.trim()) newErrors.quan_huyen = 'Vui lòng nhập quận/huyện';
        if (!formData.dia_chi_chi_tiet.trim()) newErrors.dia_chi_chi_tiet = 'Vui lòng nhập địa chỉ chi tiết';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleContinue = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setStep(2);
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);

        // Format request theo API mới
        const orderData = {
            cart_items: cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity
            })),
            ho_ten: formData.ho_ten,
            sdt: formData.so_dien_thoai,
            dia_chi: `${formData.dia_chi_chi_tiet}, ${formData.quan_huyen}, ${formData.tinh_thanh}`,
            payment_method: 'COD',
            ghi_chu: formData.ghi_chu || ''
        };

        const result = await createOrder(orderData);

        if (result.success) {
            // Xử lý response mới với thông tin VIP/giảm giá
            const paymentInfo = result.data.payment_info || {};
            setOrderResult({
                id: result.data.order_code || result.data.ma_don || result.data.id,
                tong_tien_hang: paymentInfo.tong_tien_hang || totalAmount,
                giam_gia: paymentInfo.giam_gia || 0,
                phan_tram: paymentInfo.phan_tram || 0,
                thanh_tien: paymentInfo.thanh_tien || totalAmount,
                tong_tien: paymentInfo.thanh_tien || totalAmount,
                trang_thai: 'Chờ xác nhận'
            });
            clearCart();
            setStep(3);
        } else {
            alert('Có lỗi khi đặt hàng: ' + (result.error || 'Vui lòng thử lại'));
        }

        setLoading(false);
    };

    if (cartItems.length === 0 && step !== 3) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="empty-checkout">
                        <h2>Giỏ hàng trống</h2>
                        <p>Bạn cần thêm sản phẩm trước khi thanh toán</p>
                        <Link to="/products" className="btn btn-primary">
                            Mua sắm ngay
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                {/* Progress Steps */}
                <div className="checkout-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Thông tin</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Xác nhận</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Hoàn tất</span>
                    </div>
                </div>

                {/* Step 1: Information */}
                {step === 1 && (
                    <div className="checkout-layout">
                        <div className="checkout-form">
                            <h2>Thông tin giao hàng</h2>

                            {!isAuthenticated && (
                                <div className="login-prompt">
                                    <span>Đã có tài khoản?</span>
                                    <Link to="/login?redirect=/checkout">Đăng nhập</Link>
                                </div>
                            )}

                            <form onSubmit={handleContinue}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Họ tên *</label>
                                        <input
                                            type="text"
                                            name="ho_ten"
                                            value={formData.ho_ten}
                                            onChange={handleChange}
                                            className={`form-input ${errors.ho_ten ? 'error' : ''}`}
                                            placeholder="Nguyễn Văn A"
                                        />
                                        {errors.ho_ten && <span className="error-text">{errors.ho_ten}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            name="so_dien_thoai"
                                            value={formData.so_dien_thoai}
                                            onChange={handleChange}
                                            className={`form-input ${errors.so_dien_thoai ? 'error' : ''}`}
                                            placeholder="0901234567"
                                        />
                                        {errors.so_dien_thoai && <span className="error-text">{errors.so_dien_thoai}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`form-input ${errors.email ? 'error' : ''}`}
                                        placeholder="email@example.com"
                                    />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Tỉnh/Thành phố *</label>
                                        <input
                                            type="text"
                                            name="tinh_thanh"
                                            value={formData.tinh_thanh}
                                            onChange={handleChange}
                                            className={`form-input ${errors.tinh_thanh ? 'error' : ''}`}
                                            placeholder="TP. Hồ Chí Minh"
                                        />
                                        {errors.tinh_thanh && <span className="error-text">{errors.tinh_thanh}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Quận/Huyện *</label>
                                        <input
                                            type="text"
                                            name="quan_huyen"
                                            value={formData.quan_huyen}
                                            onChange={handleChange}
                                            className={`form-input ${errors.quan_huyen ? 'error' : ''}`}
                                            placeholder="Quận 1"
                                        />
                                        {errors.quan_huyen && <span className="error-text">{errors.quan_huyen}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Địa chỉ chi tiết *</label>
                                    <input
                                        type="text"
                                        name="dia_chi_chi_tiet"
                                        value={formData.dia_chi_chi_tiet}
                                        onChange={handleChange}
                                        className={`form-input ${errors.dia_chi_chi_tiet ? 'error' : ''}`}
                                        placeholder="Số nhà, tên đường..."
                                    />
                                    {errors.dia_chi_chi_tiet && <span className="error-text">{errors.dia_chi_chi_tiet}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Ghi chú</label>
                                    <textarea
                                        name="ghi_chu"
                                        value={formData.ghi_chu}
                                        onChange={handleChange}
                                        className="form-input"
                                        rows="3"
                                        placeholder="Ghi chú về đơn hàng (tùy chọn)"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg">
                                    Tiếp tục
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="checkout-summary">
                            <h3>Đơn hàng ({cartItems.length} sản phẩm)</h3>
                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="item-image">
                                            <img src={getDisplayImageUrl(item.hinh_anh)} alt={item.ten_tui} />
                                            <span className="item-qty">{item.quantity}</span>
                                        </div>
                                        <div className="item-details">
                                            <span className="item-name">{item.ten_tui}</span>
                                            <span className="item-price">{formatPrice(item.gia_tien * item.quantity)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(getTotalPrice())}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí vận chuyển</span>
                                    <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                                </div>
                                <div className="summary-total">
                                    <span>Tổng cộng</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Confirmation */}
                {step === 2 && (
                    <div className="checkout-layout">
                        <div className="checkout-confirm">
                            <h2>Xác nhận đơn hàng</h2>

                            <div className="confirm-section">
                                <h4>Thông tin giao hàng</h4>
                                <div className="confirm-info">
                                    <p><strong>{formData.ho_ten}</strong></p>
                                    <p>{formData.so_dien_thoai}</p>
                                    <p>{formData.email}</p>
                                    <p>{formData.dia_chi_chi_tiet}, {formData.quan_huyen}, {formData.tinh_thanh}</p>
                                    {formData.ghi_chu && <p><em>Ghi chú: {formData.ghi_chu}</em></p>}
                                </div>
                                <button className="edit-btn" onClick={() => setStep(1)}>Sửa</button>
                            </div>

                            <div className="confirm-section">
                                <h4>Phương thức thanh toán</h4>
                                <div className="payment-method">
                                    <span className="cod-badge">COD</span>
                                    <span>Thanh toán khi nhận hàng</span>
                                </div>
                            </div>

                            <div className="confirm-actions">
                                <button className="btn btn-outline" onClick={() => setStep(1)}>
                                    Quay lại
                                </button>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-sm"></span>
                                    ) : (
                                        <>Đặt hàng - {formatPrice(totalAmount)}</>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="checkout-summary">
                            <h3>Đơn hàng ({cartItems.length} sản phẩm)</h3>
                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="item-image">
                                            <img src={getDisplayImageUrl(item.hinh_anh)} alt={item.ten_tui} />
                                            <span className="item-qty">{item.quantity}</span>
                                        </div>
                                        <div className="item-details">
                                            <span className="item-name">{item.ten_tui}</span>
                                            <span className="item-price">{formatPrice(item.gia_tien * item.quantity)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-totals">
                                <div className="summary-total">
                                    <span>Tổng cộng</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && orderResult && (
                    <div className="checkout-success">
                        <div className="success-icon">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h1>Đặt hàng thành công!</h1>
                        <p>Cảm ơn bạn đã mua hàng tại LuxuryBags</p>

                        <div className="order-info">
                            <p>Mã đơn hàng: <strong>{orderResult.id}</strong></p>
                            {orderResult.giam_gia > 0 ? (
                                <>
                                    <p>Tổng tiền hàng: <span>{formatPrice(orderResult.tong_tien_hang)}</span></p>
                                    <p className="discount-info">
                                        Giảm giá VIP ({orderResult.phan_tram}%): <span className="discount-amount">-{formatPrice(orderResult.giam_gia)}</span>
                                    </p>
                                    <p>Thành tiền: <strong className="final-price">{formatPrice(orderResult.thanh_tien)}</strong></p>
                                </>
                            ) : (
                                <p>Tổng tiền: <strong>{formatPrice(orderResult.tong_tien)}</strong></p>
                            )}
                            <p>Trạng thái: <span className="status-badge">{orderResult.trang_thai}</span></p>
                        </div>

                        <p className="success-note">
                            Chúng tôi sẽ liên hệ bạn qua số điện thoại để xác nhận đơn hàng trong thời gian sớm nhất.
                        </p>

                        <div className="success-actions">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Tiếp tục mua sắm
                            </Link>
                            <Link to="/" className="btn btn-outline btn-lg">
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
