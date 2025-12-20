import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateAIArt } from '../../services/api';
import './AIDesign.css';

const AIDesign = () => {
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const [hasDrawing, setHasDrawing] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [generatedResult, setGeneratedResult] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState('#000000');
    const [tool, setTool] = useState('pen');

    // Initialize canvas
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = 400;
        canvas.height = 400;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (uploadedImage) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = uploadedImage;
        }
    }, [uploadedImage]);

    // Drawing functions
    const startDrawing = (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY
        );
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const ctx = canvas.getContext('2d');

        ctx.lineTo(
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY
        );
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : brushColor;
        ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
        ctx.lineCap = 'round';
        ctx.stroke();
        setHasDrawing(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    // Touch events
    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        draw({ clientX: touch.clientX, clientY: touch.clientY });
    };

    // Clear canvas
    const handleClear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasDrawing(false);
        setUploadedImage(null);
        setGeneratedResult(null);
    };

    // Upload image
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width - img.width * scale) / 2;
                const y = (canvas.height - img.height * scale) / 2;

                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                setHasDrawing(true);
                setUploadedImage(event.target.result);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // Generate AI art using API
    const handleGenerate = async () => {
        if (!hasDrawing && !uploadedImage) {
            alert('Hãy vẽ hoặc tải lên một hình ảnh trước!');
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsGenerating(true);

        const result = await generateAIArt(canvas);

        if (result.success) {
            setGeneratedResult(result.data);
        } else {
            alert('Không thể kết nối đến AI server. ' + (result.error || ''));
        }

        setIsGenerating(false);
    };

    // Download result
    const handleDownload = () => {
        if (!generatedResult) return;

        const link = document.createElement('a');
        link.href = generatedResult;
        link.download = 'ai-bag-design.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const colors = ['#000000', '#ffffff', '#c9a227', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12'];

    return (
        <div className="ai-design-page">
            <div className="container">
                {/* Header */}
                <div className="ai-header">
                    <div className="ai-header-content">
                        <h1>
                            <span className="sparkle">✨</span>
                            AI Thiết Kế Túi Xách
                        </h1>
                        <p>Vẽ ý tưởng hoặc tải ảnh lên, AI sẽ biến thành thiết kế túi xách độc đáo</p>
                    </div>
                    <Link to="/products" className="back-link">
                        ← Quay lại sản phẩm
                    </Link>
                </div>

                {/* Main Content */}
                <div className="ai-main">
                    {/* Drawing Panel */}
                    <div className="ai-panel drawing-panel">
                        <div className="panel-header">
                            <h3>🎨 Bản vẽ của bạn</h3>
                            <div className="panel-actions">
                                <button
                                    className="btn-upload"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    Tải ảnh
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        {/* Tools */}
                        <div className="drawing-tools">
                            <div className="tool-group">
                                <button
                                    className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
                                    onClick={() => setTool('pen')}
                                    title="Bút vẽ"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 19l7-7 3 3-7 7-3-3z" />
                                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                                    </svg>
                                </button>
                                <button
                                    className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
                                    onClick={() => setTool('eraser')}
                                    title="Tẩy"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 20H7L3 16l9-9 8 8-3 3" />
                                        <path d="M6 11l8 8" />
                                    </svg>
                                </button>
                            </div>

                            <div className="tool-group">
                                <label>Size:</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                    className="size-slider"
                                />
                                <span className="size-value">{brushSize}</span>
                            </div>

                            <div className="color-palette">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        className={`color-btn ${brushColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setBrushColor(color)}
                                    />
                                ))}
                            </div>

                            <button className="clear-btn" onClick={handleClear} title="Xóa tất cả">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </div>

                        {/* Canvas */}
                        <div className="canvas-wrapper">
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={stopDrawing}
                                className="drawing-canvas"
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            className={`generate-btn ${isGenerating ? 'generating' : ''}`}
                            onClick={handleGenerate}
                            disabled={isGenerating || (!hasDrawing && !uploadedImage)}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="spinner"></span>
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                    Tạo thiết kế AI
                                </>
                            )}
                        </button>
                    </div>

                    {/* Result Panel */}
                    <div className="ai-panel result-panel">
                        <div className="panel-header">
                            <h3>🎁 Kết quả AI</h3>
                            {generatedResult && (
                                <button className="btn-download" onClick={handleDownload}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Tải về
                                </button>
                            )}
                        </div>

                        <div className="result-area">
                            {isGenerating ? (
                                <div className="result-placeholder generating">
                                    <div className="ai-loader">
                                        <div className="loader-circle"></div>
                                        <div className="loader-circle"></div>
                                        <div className="loader-circle"></div>
                                    </div>
                                    <h4>AI đang sáng tạo...</h4>
                                    <p>Vui lòng chờ trong giây lát</p>
                                </div>
                            ) : generatedResult ? (
                                <div className="result-image">
                                    <img src={generatedResult} alt="AI Generated Design" />
                                </div>
                            ) : (
                                <div className="result-placeholder">
                                    <div className="placeholder-icon">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                    <h4>Sẵn sàng tạo thiết kế</h4>
                                    <p>Vẽ ý tưởng hoặc tải ảnh lên,<br />sau đó nhấn "Tạo thiết kế AI"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="ai-tips">
                    <h4>💡 Mẹo để có kết quả tốt nhất:</h4>
                    <ul>
                        <li>Vẽ hình dạng cơ bản của túi bạn muốn</li>
                        <li>Thêm các chi tiết như quai, khóa, họa tiết</li>
                        <li>Tải lên ảnh mẫu túi bạn thích để AI tham khảo</li>
                        <li>Thử nghiệm nhiều lần để có thiết kế ưng ý</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AIDesign;
