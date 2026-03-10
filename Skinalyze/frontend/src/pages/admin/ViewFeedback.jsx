import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../../api';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data } = await api.get('/admin/feedback');
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold admin-header-title">User Feedback</h1>
          <p className="text-gray-500 mt-1">Review ratings and comments from users</p>
        </div>
      </div>

      <div className="admin-card overflow-hidden mt-4">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analysis ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.user_email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{item.analysis_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderStars(item.rating)}</td>
                <td className="px-6 py-4 text-sm text-gray-700 italic">"{item.comment || 'No comment provided'}"</td>
              </tr>
            ))}
            {feedbacks.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No feedback found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewFeedback;
