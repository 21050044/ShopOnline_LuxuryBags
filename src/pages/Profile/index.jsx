import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user, logout, updateProfile, isLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        ho_ten: '',
        so_dien_thoai: '',
        dia_chi: '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    // Khởi tạo form data khi bắt đầu chỉnh sửa
    const handleStartEdit = () => {
        setFormData({
            ho_ten: user.ho_ten || '',
            so_dien_thoai: user.so_dien_thoai || '',
            dia_chi: user.dia_chi || '',
        });
        setIsEditing(true);
        setMessage({ type: '', text: '' });
    };

    // Hủy chỉnh sửa
    const handleCancelEdit = () => {
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Lưu thông tin
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Chỉ gửi những trường đã thay đổi
        const updatedFields = {};
        if (formData.ho_ten !== user.ho_ten) {
            updatedFields.ho_ten = formData.ho_ten;
        }
        if (formData.so_dien_thoai !== user.so_dien_thoai) {
            updatedFields.so_dien_thoai = formData.so_dien_thoai;
        }
        if (formData.dia_chi !== user.dia_chi) {
            updatedFields.dia_chi = formData.dia_chi;
        }

        // Nếu không có gì thay đổi
        if (Object.keys(updatedFields).length === 0) {
            setMessage({ type: 'info', text: 'Không có thông tin nào thay đổi.' });
            return;
        }

        const result = await updateProfile(updatedFields);

        if (result.success) {
            setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
            setIsEditing(false);
        } else {
            setMessage({ type: 'error', text: result.error || 'Cập nhật thất bại. Vui lòng thử lại.' });
        }
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="not-logged-in">
                        <h2>Bạn chưa đăng nhập</h2>
                        <p>Vui lòng đăng nhập để xem thông tin tài khoản</p>
                        <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="container">
                <h1>Tài khoản của tôi</h1>

                <div className="profile-layout">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-avatar">
                            <div className="avatar">
                                {user.ho_ten?.charAt(0).toUpperCase()}
                            </div>
                            <h3>{user.ho_ten}</h3>
                            <p>{user.email}</p>
                        </div>
                        <nav className="profile-nav">
                            <Link to="/profile" className="nav-item active">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Thông tin cá nhân
                            </Link>
                            <Link to="/orders" className="nav-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                </svg>
                                Đơn hàng của tôi
                            </Link>
                            <button className="nav-item logout" onClick={logout}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Đăng xuất
                            </button>
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="profile-content">
                        <div className="content-card">
                            <h2>Thông tin cá nhân</h2>

                            {/* Thông báo */}
                            {message.text && (
                                <div className={`profile-message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            {isEditing ? (
                                /* Form chỉnh sửa */
                                <form onSubmit={handleSaveProfile} className="edit-form">
                                    <div className="form-group">
                                        <label htmlFor="ho_ten">Họ tên</label>
                                        <input
                                            type="text"
                                            id="ho_ten"
                                            name="ho_ten"
                                            value={formData.ho_ten}
                                            onChange={handleInputChange}
                                            placeholder="Nhập họ tên"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={user.email}
                                            disabled
                                            className="disabled-input"
                                        />
                                        <small>Email không thể thay đổi</small>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="so_dien_thoai">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            id="so_dien_thoai"
                                            name="so_dien_thoai"
                                            value={formData.so_dien_thoai}
                                            onChange={handleInputChange}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dia_chi">Địa chỉ</label>
                                        <textarea
                                            id="dia_chi"
                                            name="dia_chi"
                                            value={formData.dia_chi}
                                            onChange={handleInputChange}
                                            placeholder="Nhập địa chỉ"
                                            rows="3"
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            onClick={handleCancelEdit}
                                            disabled={isLoading}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* Hiển thị thông tin */
                                <>
                                    {/* VIP Member Badge */}
                                    {user.hang_thanh_vien && (
                                        <div className="vip-badge-section">
                                            <div className="vip-badge">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z" />
                                                </svg>
                                                <span>{user.hang_thanh_vien}</span>
                                            </div>
                                            {user.muc_giam_gia > 0 && (
                                                <p className="discount-note">
                                                    Bạn được giảm <strong>{user.muc_giam_gia}%</strong> cho mỗi đơn hàng
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Họ tên</label>
                                            <p>{user.ho_ten}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Email</label>
                                            <p>{user.email}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Số điện thoại</label>
                                            <p>{user.so_dien_thoai || 'Chưa cập nhật'}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Địa chỉ</label>
                                            <p>{user.dia_chi || 'Chưa cập nhật'}</p>
                                        </div>
                                        {user.tong_chi_tieu !== undefined && (
                                            <div className="info-item full-width">
                                                <label>Tổng chi tiêu</label>
                                                <p className="total-spent">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(user.tong_chi_tieu)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className="btn btn-outline edit-profile-btn"
                                        onClick={handleStartEdit}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Chỉnh sửa thông tin
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
