import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../api';

const ManageIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', risk_type: '', description: '', condition_ids: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: ingData }, { data: condData }] = await Promise.all([
        api.get('/admin/ingredients'),
        api.get('/admin/conditions')
      ]);
      setIngredients(ingData);
      setConditions(condData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (ingredient = null) => {
    if (ingredient) {
      setFormData({ ...ingredient, condition_ids: ingredient.condition_ids || [] });
    } else {
      setFormData({ id: null, name: '', risk_type: '', description: '', condition_ids: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/admin/ingredients/${formData.id}`, formData);
      } else {
        await api.post('/admin/ingredients', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save ingredient');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await api.delete(`/admin/ingredients/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete ingredient');
      }
    }
  };

  return (
    <div className="w-full pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold admin-header-title">Manage Ingredients</h1>
          <p className="text-gray-500 mt-1">Configure cosmetic ingredients and risks</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="admin-btn-primary px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all"
        >
          <Plus size={20} />
          <span>Add Ingredient</span>
        </button>
      </div>

      <div className="admin-card overflow-hidden mt-4">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">{item.risk_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md border text-xs font-medium">
                    {item.condition_ids?.length || 0} Conditions
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{item.description}</td>
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
            {ingredients.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No ingredients found.</td>
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
            <h2 className="text-2xl font-bold mb-6">{formData.id ? 'Edit' : 'Add'} Ingredient</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Type</label>
                  <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400" placeholder="e.g. High Risk"
                    value={formData.risk_type} onChange={e => setFormData({...formData, risk_type: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows="3" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avoid for Conditions</label>
                <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                  {conditions.map(c => (
                    <label key={c.id} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-white p-1 rounded">
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={formData.condition_ids.includes(c.id)}
                        onChange={(e) => {
                          const ids = formData.condition_ids;
                          if (e.target.checked) setFormData({...formData, condition_ids: [...ids, c.id]});
                          else setFormData({...formData, condition_ids: ids.filter(i => i !== c.id)});
                        }}
                      />
                      <span className="truncate" title={c.name}>{c.name}</span>
                    </label>
                  ))}
                  {conditions.length === 0 && <span className="text-gray-500 text-xs text-center col-span-2">No conditions available</span>}
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

export default ManageIngredients;
