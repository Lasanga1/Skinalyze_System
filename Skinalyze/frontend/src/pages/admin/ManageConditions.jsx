import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../api';

const ManageConditions = () => {
  const [conditions, setConditions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', description: '', severity_note: '', doctor_required_note: '' });

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      const { data } = await api.get('/admin/conditions');
      setConditions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (condition = null) => {
    if (condition) {
      setFormData(condition);
    } else {
      setFormData({ id: null, name: '', description: '', severity_note: '', doctor_required_note: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/admin/conditions/${formData.id}`, formData);
      } else {
        await api.post('/admin/conditions', formData);
      }
      setIsModalOpen(false);
      fetchConditions();
    } catch (err) {
      console.error(err);
      alert('Failed to save condition');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this condition?')) {
      try {
        await api.delete(`/admin/conditions/${id}`);
        fetchConditions();
      } catch (err) {
        console.error(err);
        alert('Failed to delete condition');
      }
    }
  };

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold admin-header-title">Manage Conditions</h1>
          <p className="text-gray-500 mt-1">Configure identifiable skin conditions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="admin-btn-primary px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all"
        >
          <Plus size={20} />
          <span>Add Condition</span>
        </button>
      </div>

      <div className="admin-card overflow-hidden mt-4">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Note</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {conditions.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.severity_note || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{item.doctor_required_note || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {conditions.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No conditions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{formData.id ? 'Edit' : 'Add'} Condition</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows="3" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity Note</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.severity_note || ''} onChange={e => setFormData({...formData, severity_note: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Requirement Note</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.doctor_required_note || ''} onChange={e => setFormData({...formData, doctor_required_note: e.target.value})} />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageConditions;
