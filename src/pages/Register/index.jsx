import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Login/Login.css';

const Register = () => {
    const navigate = useNavigate();
    const { register, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        ho_ten: '',
        email: '',
        so_dien_thoai: '',
        password: '',
        confirmPassword: '',
        dia_chi: ''
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.ho_ten.trim()) newErrors.ho_ten = 'Vui lòng nhập họ tên';
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.so_dien_thoai.trim()) {
            newErrors.so_dien_thoai = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.so_dien_thoai)) {
            newErrors.so_dien_thoai = 'Số điện thoại không hợp lệ';
        }
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) return;

        // Gửi đúng format API: ho_ten, email, so_dien_thoai, password, dia_chi
        const result = await register({
            ho_ten: formData.ho_ten,
            email: formData.email,
            so_dien_thoai: formData.so_dien_thoai,
            password: formData.password,
            dia_chi: formData.dia_chi
        });

        if (result.success) {
            navigate('/');
        } else {
            setApiError(result.error || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <span>Luxury</span><span className="accent">Bags</span>
                        </Link>
                        <h1>Đăng ký tài khoản</h1>
                        <p>Tạo tài khoản để mua sắm dễ dàng hơn</p>
                    </div>

                    {apiError && (
                        <div className="auth-error">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
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

                        <div className="form-group">
                            <label className="form-label">Số điện thoại *</label>
                            <input
                                type="tel"
                                name="so_dien_thoai"
                                value={formData.so_dien_thoai}
                                onChange={handleChange}
                                className={`form-input ${errors.so_dien_thoai ? 'error' : ''}`}
                                placeholder="0909123456"
                            />
                            {errors.so_dien_thoai && <span className="error-text">{errors.so_dien_thoai}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Địa chỉ</label>
                            <input
                                type="text"
                                name="dia_chi"
                                value={formData.dia_chi}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="123 Đường ABC, Quận 1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mật khẩu *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="••••••••"
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Xác nhận mật khẩu *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="spinner-sm"></span>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
