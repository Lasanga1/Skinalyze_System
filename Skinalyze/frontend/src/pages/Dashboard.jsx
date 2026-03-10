import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight, User } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/history');
        setHistory(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const recent = history.slice(0, 2);

  return (
    <div>
      <div className="flex justify-center mb-6">
        <Link to="/analyze" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem', width: '100%', maxWidth: '600px' }}>
          <Camera size={24} />
          Start New Skin Analysis
        </Link>
      </div>
      <p className="text-center text-muted mb-8">Upload a photo for AI-powered insight into your skin condition.</p>

      <div className="grid grid-cols-3">
        {/* Recent Analysis */}
        <div className="card flex flex-col items-start h-full">
          <h2 className="card-title w-full">Recent Analysis</h2>
          <p className="text-muted w-full" style={{fontSize: '0.9rem', marginBottom: '1.25rem'}}>Last two analysis entries:</p>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center w-full"><p className="text-muted">Loading...</p></div>
          ) : recent.length > 0 ? (
            <div className="flex flex-col gap-4 mb-6 w-full flex-1">
              {recent.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 pb-4 border-b last:border-0" style={{ borderBottom: idx === recent.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                  <div style={{width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', background: '#F8FAFC', flexShrink: 0, border: '1px solid var(--border-color)'}}>
                    {item.image && <img src={`http://127.0.0.1:5000${item.image}`} alt="Skin" crossOrigin="anonymous" style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
                  </div>
                  <div>
                    <div className="text-muted mb-1" style={{fontSize: '0.85rem', fontWeight: 500}}>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="font-semibold" style={{color: 'var(--text-main)', fontSize: '0.95rem'}}>{item.prediction}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center w-full">
              <p className="text-muted text-sm mb-4">No recent analysis found.</p>
            </div>
          )}
          
          <div className="mt-auto w-full text-center pt-2">
            <Link to="/history" className="text-primary font-medium hover:underline text-sm" style={{ textDecoration: 'none' }}>View History</Link>
          </div>
        </div>

        {/* Your Skin Progress */}
        <div className="card flex flex-col h-full">
          <h2 className="card-title">Your Skin Progress</h2>
          <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '1.25rem'}}>Progress updates: {history.length} updates total</p>
          
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg mb-6 w-full" style={{ minHeight: '140px', backgroundColor: '#F8FAFC', border: '1px solid var(--border-color)' }}>
             <svg width="100%" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" style={{maxWidth: '200px'}}>
              <path d="M0,70 Q40,30 80,50 T160,20 T200,10" fill="none" stroke="var(--accent-blue)" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          
          <div className="text-center mt-auto w-full pt-2">
            <Link to="/progress" className="text-primary font-medium hover:underline text-sm" style={{ textDecoration: 'none' }}>View Progress</Link>
          </div>
        </div>

        {/* Things to Avoid */}
        <div className="card flex flex-col h-full">
          <h2 className="card-title">Things to Avoid</h2>
          <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '1.25rem'}}>Based on ingredients to avoid on your latest result:</p>
          
          <ul className="mb-6 text-main flex-1 flex flex-col gap-2" style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
            <li className="pl-1">Retinol</li>
            <li className="pl-1">Parabens</li>
            <li className="pl-1">Sulfates</li>
          </ul>

          <div className="mt-auto w-full text-center p-4 border" style={{ background: '#F8FAFC', borderRadius: '12px', borderColor: 'var(--border-color)' }}>
            <div className="font-medium text-main text-sm mb-1">Need direct help?</div>
            <div className="text-primary font-semibold text-sm mb-2">Talk to a Dermatologist</div>
            <Link to="/support" className="text-muted hover:text-primary transition-colors inline-block mt-1" style={{ textDecoration: 'underline', textUnderlineOffset: '4px', fontSize: '0.85rem' }}>View Doctor Support page</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
