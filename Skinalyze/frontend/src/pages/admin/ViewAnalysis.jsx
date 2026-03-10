import React, { useState, useEffect } from 'react';
import api from '../../api';

const ViewAnalysis = () => {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data } = await api.get('/admin/analysis');
      setAnalyses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getFileName = (path) => {
    if (!path) return 'N/A';
    return path.split('/').pop().split('\\').pop();
  };

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold admin-header-title">Analysis History</h1>
          <p className="text-gray-500 mt-1">Log of all system predictions</p>
        </div>
      </div>

      <div className="admin-card overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image Source</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((item) => (
                <tr key={item.analysis_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{item.analysis_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">User {item.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {item.prediction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-bold">
                    {(item.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[200px]">
                    {getFileName(item.image_path)}
                  </td>
                </tr>
              ))}
              {analyses.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No analyses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAnalysis;
