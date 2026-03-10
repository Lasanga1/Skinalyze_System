import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import api from '../api';

const Analyze = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/result', { state: { analysisData: res.data } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="card p-8 w-full mb-6" style={{ maxWidth: '600px', position: 'relative' }}>
        <div className="leaf-pattern" style={{ opacity: 0.1 }}></div>
        <div className="text-center">
          <h1 className="auth-title mb-2" style={{color: 'var(--accent-blue)', fontSize: '1.75rem'}}>Analyze Skin Condition</h1>
          <p className="text-muted mb-6">Upload a clear photo for AI-powered insight into your skin concern.</p>
        </div>
        
        <div 
          className="border-dashed border-2 rounded-lg p-8 mb-6 flex flex-col items-center justify-center cursor-pointer transition"
          style={{ borderColor: '#94A3B8', borderStyle: 'dashed', borderWidth: '2px', borderRadius: '12px', background: '#F8FAFC', minHeight: '250px' }}
          onClick={() => fileInputRef.current.click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full mb-4" style={{background: 'rgba(123, 161, 199, 0.1)', color: 'var(--accent-blue)'}}>
                <Upload size={32} />
              </div>
              <h3 className="font-medium text-lg mb-1" style={{color: 'var(--text-main)'}}>Upload or Drag & Drop Photo</h3>
              <p className="text-sm text-muted mb-4">Supports JPG, PNG (Max 5MB)</p>
              <div className="btn btn-primary px-6 py-2" style={{ pointerEvents: 'none' }}>Browse Files</div>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        <div className="text-center text-sm text-muted p-3 mb-6" style={{background: 'var(--bg-color)', borderRadius: '8px'}}>
          For best results: Natural lighting, Close-up, and Focused shot
        </div>

        {error && <div className="text-danger mb-4 text-center">{error}</div>}

        <button 
          className={`btn w-full justify-center ${file ? 'btn-primary' : ''}`}
          style={{ 
            background: !file ? '#E2E8F0' : undefined, 
            color: !file ? '#94A3B8' : undefined,
            fontSize: '1.1rem',
            padding: '1rem' 
          }}
          onClick={handleAnalyze}
          disabled={!file || loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>

        <div className="mt-4 text-sm text-muted text-center" style={{ position: 'relative', zIndex: 1 }}>
          Analyze previous photos via the <Link to="/history" className="text-primary" style={{ textDecoration: 'underline' }}>History Page</Link>.
        </div>
      </div>
    </div>
  );
};

export default Analyze;
