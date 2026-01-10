import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const redirect = searchParams.get('redirect') || '/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate(redirect);
        } else {
            setError(result.error);
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
                        <h1>Đăng nhập</h1>
                        <p>Chào mừng bạn quay trở lại</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-error">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="spinner-sm"></span>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
