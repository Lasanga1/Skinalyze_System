import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import api from '../../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data } = await api.get('/admin/analytics');
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  if (!metrics) {
    return <div className="p-8 text-center text-red-500">Failed to load analytics</div>;
  }

  // Prep data for Prediction Distribution (Pie Chart)
  const distLabels = Object.keys(metrics.prediction_distribution || {});
  const distData = Object.values(metrics.prediction_distribution || {});
  
  const pieData = {
    labels: distLabels,
    datasets: [
      {
        data: distData,
        backgroundColor: [
          '#3b82f6', // blue-500
          '#10b981', // emerald-500
          '#f59e0b', // amber-500
          '#ef4444', // red-500
          '#8b5cf6', // violet-500
        ]
      }
    ]
  };

  // Prep data for Analyses Per Day (Line Chart)
  const dayLabels = Object.keys(metrics.analyses_per_day || {}).sort();
  const dayData = dayLabels.map(day => metrics.analyses_per_day[day]);

  const lineData = {
    labels: dayLabels,
    datasets: [
      {
        label: 'Analyses',
        data: dayData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3
      }
    ]
  };

  return (
    <div className="pb-20 space-y-8 w-full">
      <div className="flex justify-between items-center admin-glass-panel p-6 mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold admin-header-title">Analytics Overview</h1>
          <p className="text-gray-500 mt-1">Platform metrics and system health</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Users" value={metrics.total_users} />
        <MetricCard title="Total Analyses" value={metrics.total_analyses} />
        <MetricCard title="Total Feedback" value={metrics.total_feedback} />
        <MetricCard title="Avg Confidence" value={`${metrics.average_confidence}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="admin-card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Prediction Distribution</h2>
          <div className="h-64 flex justify-center">
            {distLabels.length > 0 ? (
               <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            ) : (
               <p className="text-gray-400 mt-20">No data available</p>
            )}
          </div>
        </div>

        <div className="admin-card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Analyses Per Day</h2>
          <div className="h-64">
             {dayLabels.length > 0 ? (
                <Line data={lineData} options={{ maintainAspectRatio: false }} />
             ) : (
                <p className="text-gray-400 mt-20 text-center">No data available</p>
             )}
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-inner border border-blue-100 flex justify-between items-center transform transition-transform hover:scale-[1.01]">
             <div>
                <h3 className="text-lg font-semibold text-blue-900">Most Common Condition</h3>
                <p className="text-sm text-blue-700">Based on all predictions</p>
             </div>
             <div className="text-2xl font-bold text-blue-600 bg-white px-6 py-3 rounded-xl shadow-sm">
                {metrics.most_common_prediction}
             </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value }) => (
  <div className="admin-card p-6">
    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
