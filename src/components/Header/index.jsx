import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { getTotalItems } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="logo">
                    <span className="logo-text">Luxury</span>
                    <span className="logo-accent">Bags</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Trang chủ
                    </Link>
                    <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Sản phẩm
                    </Link>
                    <Link to="/products?category=Túi xách tay" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Túi xách tay
                    </Link>
                    <Link to="/products?category=Túi đeo chéo" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        Túi đeo chéo
                    </Link>
                </nav>

                {/* Actions */}
                <div className="header-actions">
                    {/* Search */}
                    <button
                        className="action-btn"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        aria-label="Tìm kiếm"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>

                    {/* Cart */}
                    <Link to="/cart" className="action-btn cart-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {getTotalItems() > 0 && (
                            <span className="cart-badge">{getTotalItems()}</span>
                        )}
                    </Link>

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button className="action-btn user-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                            <div className="user-dropdown">
                                <p className="user-name">Xin chào, {user?.ho_ten || 'Khách'}</p>
                                <Link to="/profile" className="dropdown-item">Tài khoản</Link>
                                <Link to="/orders" className="dropdown-item">Đơn hàng</Link>
                                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className={`search-bar ${isSearchOpen ? 'search-open' : ''}`}>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-submit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                </form>
            </div>
        </header>
    );
};

export default Header;
