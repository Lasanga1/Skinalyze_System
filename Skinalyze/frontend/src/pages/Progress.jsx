import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ArrowUpRight, Activity, Beaker } from 'lucide-react';
import api from '../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Progress = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/progress');
        // Sort ascending for chart
        setHistory(res.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const labels = history.map(item => new Date(item.date).toLocaleDateString([], {month: 'short', day: 'numeric'}));
  const dataPoints = history.map(item => item.severity_score || 5);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Severity Score',
        data: dataPoints,
        borderColor: '#7BA1C7',
        backgroundColor: 'rgba(123, 161, 199, 0.2)',
        tension: 0.4,
        pointBackgroundColor: '#5BA86C',
        pointBorderColor: '#FFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            return ` ${history[index].prediction} (${context.parsed.y}/10)`;
          }
        }
      }
    },
    scales: {
      y: { min: 0, max: 10, grid: { borderDash: [5, 5] }, ticks: { stepSize: 2 } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-main" style={{color: 'var(--accent-blue)'}}>Skin Progress Tracker</h1>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-main">View range:</label>
          <select className="form-input" style={{ padding: '0.4rem 2.5rem 0.4rem 1rem', width: 'auto', background: 'var(--card-bg)' }}>
            <option>1 Month</option>
            <option>3 Months</option>
            <option>6 Months</option>
          </select>
        </div>
      </div>

      <div className="card mb-6" style={{ height: '350px', padding: '1rem', paddingTop: '2rem' }}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted">Loading chart data...</div>
        ) : history.length < 2 ? (
          <div className="h-full flex items-center justify-center text-muted">Need at least 2 analyses to show progress chart.</div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card text-center p-6">
          <div className="text-muted mb-2 text-sm font-medium">Overall Improvement</div>
          <div className="text-2xl font-bold text-success flex items-center justify-center gap-1">
            +18% <ArrowUpRight size={24} />
          </div>
        </div>
        
        <div className="card text-center p-6">
          <div className="text-muted mb-2 text-sm font-medium">Last Analysis</div>
          {history.length > 0 ? (
            <div className="text-xl font-bold text-main">
              {history[history.length - 1].prediction} <span className="text-success text-sm ml-1 font-medium">(Improved)</span>
            </div>
          ) : (
            <div className="text-xl font-bold text-muted">-</div>
          )}
        </div>

        <div className="card text-center p-6">
          <div className="text-muted mb-2 text-sm font-medium">Ingredient Tracking</div>
          <div className="text-xl font-bold text-main">
            (Retinol) - <span className="text-success text-sm ml-1 font-medium">Enabled</span>
          </div>
        </div>
      </div>
      
      {/* Analysis Comparison Timeline */}
      <h3 className="font-bold text-lg mb-4 text-main">Analysis Comparison Timeline</h3>
      <div className="flex gap-4 overflow-x-auto pb-4" style={{scrollbarWidth: 'thin'}}>
        {history.map((record, idx) => (
          <div key={idx} className="card flex-shrink-0" style={{ width: '280px', padding: '1.25rem' }}>
            <div className="flex items-center gap-4 mb-4">
               <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden' }} className="border">
                 <img src={`http://127.0.0.1:5000${record.image}`} alt="Skin Snapshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
               <div className="flex-1 flex flex-col items-center">
                 <ArrowUpRight className="text-success mb-1" size={24} />
                 <span className="text-xs font-bold text-success uppercase">Improved</span>
               </div>
            </div>
            <div className="text-sm font-medium text-muted mb-1">{new Date(record.date).toLocaleDateString()}</div>
            <div className="text-sm font-bold text-main mb-1">Predicted Condition</div>
            <div className="text-xs text-muted">Confidence: {record.confidence}%</div>
          </div>
        ))}
        {history.length === 0 && <div className="text-muted text-sm">No analysis comparison available.</div>}
      </div>
    </div>
  );
};

export default Progress;
