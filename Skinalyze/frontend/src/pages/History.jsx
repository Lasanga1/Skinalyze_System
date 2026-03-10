import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import api from '../api';

const History = () => {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-main mb-2">Analysis History</h1>
        <p className="text-muted">Review your previous skin condition snapshots and predictions over time.</p>
      </div>

      {loading ? (
        <div className="text-center p-8 text-muted">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="card text-center p-8">
          <div className="text-muted mb-4">You haven't performed any skin analysis yet.</div>
          <Link to="/analyze" className="btn btn-primary">Analyze Now</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((record, idx) => (
            <div key={record.id || idx} className="card flex items-center p-4" style={{ transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }} className="mr-6 border">
                <img src={`http://127.0.0.1:5000${record.image}`} alt="Skin Snapshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 text-muted text-sm mb-1">
                  <Calendar size={14} /> {new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <h3 className="text-lg font-semibold text-main mb-2">{record.prediction}</h3>
                <div className="text-primary font-medium text-sm border inline-block px-3 py-1 rounded-md" style={{ borderColor: 'rgba(91, 168, 108, 0.3)', background: 'rgba(91, 168, 108, 0.05)' }}>
                  {record.confidence}% Confidence
                </div>
              </div>
              
              <div className="text-muted">
                <ChevronRight size={24} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
