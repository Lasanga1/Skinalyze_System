import React, { useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Info, ArrowLeft, Star, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../api';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.analysisData;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const printRef = useRef(null);

  if (!data) {
    return (
      <div className="text-center mt-12 card max-w-lg mx-auto p-8">
        <h2 className="text-xl font-medium mb-4">No analysis data found</h2>
        <p className="text-muted mb-6">Please upload an image to view results.</p>
        <Link to="/analyze" className="btn btn-primary">Go to Analyze</Link>
      </div>
    );
  }

  const { prediction, confidence, image, condition_info, remedies, ingredients_to_avoid, doctor_support, analysis_id } = data;

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Skinalyze_Report.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
  };

  const handleFeedback = async () => {
    if (rating === 0) return;
    setLoadingFeedback(true);
    try {
      await api.post('/feedback', { analysis_id, rating, comment });
      setFeedbackSent(true);
    } catch (err) {
      console.error('Failed to submit feedback', err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <button onClick={handleDownloadPdf} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> Download PDF
        </button>
      </div>

      <div ref={printRef} className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '1.5rem', padding: '10px', background: 'var(--bg-color)', borderRadius: '12px' }}>
        {/* Left Column: Image and Summary */}
        <div className="flex flex-col gap-6">
          <div className="card text-center" style={{ padding: '2rem' }}>
            <h2 className="card-title mb-4" style={{ fontSize: '1.25rem' }}>Your Analysis Result</h2>
            <div className="mb-6 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-color)', height: '240px' }}>
              <img src={`http://127.0.0.1:5000${image}`} alt="Analyzed Skin" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="font-bold text-main mb-2" style={{ fontSize: '1.5rem' }}>{prediction}</div>
            <div className="text-primary font-medium" style={{ fontSize: '1.1rem' }}>{confidence}% Match</div>
            
            {/* Feedback system */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-sm font-medium mb-3" style={{ color: feedbackSent ? 'var(--success-color)' : 'var(--text-muted)' }}>
                {feedbackSent ? 'Thank you for your feedback!' : 'Was this prediction accurate?'}
              </p>
              {!feedbackSent && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        onClick={() => setRating(star)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: rating >= star ? '#F59E0B' : '#CBD5E1', padding: '0.2rem' }}
                      >
                        <Star size={28} fill={rating >= star ? '#F59E0B' : 'transparent'} />
                      </button>
                    ))}
                  </div>
                  
                  {rating > 0 && (
                     <div className="mt-2 text-left">
                       <label className="text-xs font-medium text-muted block mb-1">Additional Comments (Optional):</label>
                       <textarea 
                         className="form-input w-full text-sm" 
                         style={{ minHeight: '80px', resize: 'vertical' }}
                         placeholder="Tell us what you think..."
                         value={comment}
                         onChange={(e) => setComment(e.target.value)}
                       />
                       <button 
                         className="btn btn-primary w-full mt-3 py-2 text-sm" 
                         onClick={handleFeedback}
                         disabled={loadingFeedback}
                       >
                         {loadingFeedback ? 'Submitting...' : 'Submit Feedback'}
                       </button>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col gap-6">
          <div className="card" style={{ padding: '2rem' }}>
            <h3 className="card-title flex items-center gap-2 mb-6" style={{ color: 'var(--accent-blue)' }}>
              <Info size={22} /> Condition Information
            </h3>
            <p className="mb-8 text-main" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>{condition_info.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border flex flex-col justify-center transition-colors" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
                <span className="text-muted text-sm block mb-1 font-medium">Severity Level</span>
                <span className="font-semibold text-main text-lg">{condition_info.severity_note}</span>
              </div>
              <div className="p-5 rounded-xl border flex flex-col justify-center transition-colors" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
                <span className="text-danger text-sm block mb-1 font-medium flex items-center gap-1">
                  <AlertTriangle size={15}/> Doctor Recommendation
                </span>
                <span className="font-semibold text-danger text-lg">{condition_info.doctor_required_note}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="card flex flex-col h-full" style={{ padding: '1.75rem' }}>
              <h3 className="card-title mb-4" style={{ fontSize: '1.1rem' }}>Recommended Remedies</h3>
              <ul className="pl-5 text-main flex-1 flex flex-col justify-center gap-2" style={{ listStyleType: 'disc' }}>
                {remedies.length > 0 ? remedies.map((r, i) => <li key={i} className="pl-1">{r}</li>) : <li className="text-muted list-none ml-[-1.25rem]">No specific remedies found.</li>}
              </ul>
            </div>

            <div className="card flex flex-col h-full" style={{ padding: '1.75rem', borderTop: '4px solid var(--danger-color)' }}>
              <h3 className="card-title text-danger flex items-center gap-2 mb-4" style={{ fontSize: '1.1rem' }}>
                <AlertTriangle size={18} /> Ingredients to Avoid
              </h3>
              <ul className="pl-5 text-danger font-medium flex-1 flex flex-col justify-center gap-2" style={{ listStyleType: 'disc' }}>
                {ingredients_to_avoid.length > 0 ? ingredients_to_avoid.map((ing, i) => <li key={i} className="pl-1">{ing}</li>) : <li className="text-muted list-none font-normal ml-[-1.25rem]">No specific ingredients to avoid.</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
