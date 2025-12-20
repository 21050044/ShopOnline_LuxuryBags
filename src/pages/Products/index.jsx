import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { getProducts, getCategories } from '../../services/api';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'all',
        sort: searchParams.get('sort') || '',
        search: searchParams.get('search') || '',
        priceRange: searchParams.get('price') || 'all'
    });

    const priceRanges = [
        { value: 'all', label: 'Tất cả giá' },
        { value: '0-1000000', label: 'Dưới 1 triệu' },
        { value: '1000000-2000000', label: '1 - 2 triệu' },
        { value: '2000000-5000000', label: '2 - 5 triệu' },
        { value: '5000000-999999999', label: 'Trên 5 triệu' }
    ];

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const result = await getCategories();
            if (result.success) {
                setCategories(result.data);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            const filterOptions = {
                category: filters.category !== 'all' ? filters.category : undefined,
                sort: filters.sort || undefined,
                search: filters.search || undefined
            };

            if (filters.priceRange !== 'all') {
                const [min, max] = filters.priceRange.split('-').map(Number);
                filterOptions.minPrice = min;
                filterOptions.maxPrice = max;
            }

            const result = await getProducts(filterOptions);
            if (result.success) {
                setProducts(result.data);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [filters]);

    // Update filters from URL
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            category: searchParams.get('category') || 'all',
            search: searchParams.get('search') || ''
        }));
    }, [searchParams]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));

        const newParams = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setFilters({
            category: 'all',
            sort: '',
            search: '',
            priceRange: 'all'
        });
        setSearchParams({});
    };

    return (
        <div className="products-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>
                        {filters.category !== 'all' ? filters.category : 'Tất cả sản phẩm'}
                    </h1>
                    {filters.search && (
                        <p className="search-result">
                            Kết quả tìm kiếm cho: "<strong>{filters.search}</strong>"
                        </p>
                    )}
                </div>

                <div className="products-layout">
                    {/* Sidebar Filters */}
                    <aside className="filters-sidebar">
                        <div className="filter-section">
                            <h3>Danh mục</h3>
                            <div className="filter-options">
                                <label className="filter-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filters.category === 'all'}
                                        onChange={() => handleFilterChange('category', 'all')}
                                    />
                                    <span>Tất cả</span>
                                </label>
                                {categories.map(cat => (
                                    <label key={cat.id} className="filter-option">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === cat.ten_danh_muc}
                                            onChange={() => handleFilterChange('category', cat.ten_danh_muc)}
                                        />
                                        <span>{cat.ten_danh_muc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3>Khoảng giá</h3>
                            <div className="filter-options">
                                {priceRanges.map(range => (
                                    <label key={range.value} className="filter-option">
                                        <input
                                            type="radio"
                                            name="priceRange"
                                            checked={filters.priceRange === range.value}
                                            onChange={() => handleFilterChange('priceRange', range.value)}
                                        />
                                        <span>{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn-outline clear-filters" onClick={clearFilters}>
                            Xóa bộ lọc
                        </button>
                    </aside>

                    {/* Products Grid */}
                    <div className="products-main">
                        {/* Toolbar */}
                        <div className="products-toolbar">
                            <span className="product-count">
                                {products.length} sản phẩm
                            </span>
                            <div className="sort-wrapper">
                                <label>Sắp xếp:</label>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="">Mặc định</option>
                                    <option value="name">Tên A-Z</option>
                                    <option value="price-asc">Giá thấp → cao</option>
                                    <option value="price-desc">Giá cao → thấp</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="no-products">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <h3>Không tìm thấy sản phẩm</h3>
                                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                <button className="btn btn-primary" onClick={clearFilters}>
                                    Xem tất cả sản phẩm
                                </button>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
