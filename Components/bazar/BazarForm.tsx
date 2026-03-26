'use client';

import React from 'react';
import { Plus, Trash2, Calendar, Loader } from 'lucide-react';

interface BazarItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface BazarFormProps {
  editingEntry: string | null;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  items: BazarItem[];
  updateItem: (id: number, field: string, value: any) => void;
  removeItem: (id: number) => void;
  addItemRow: () => void;
  notes: string;
  setNotes: (notes: string) => void;
  calculateTotal: () => number;
  loading: boolean;
  closeForm: () => void;
  handleSubmit: () => void;
}

const categories = ['vegetables', 'rice', 'lentils', 'spices', 'dairy', 'meat', 'fish', 'oil', 'others'];

const BazarForm = ({
  editingEntry,
  currentDate,
  setCurrentDate,
  items,
  updateItem,
  removeItem,
  addItemRow,
  notes,
  setNotes,
  calculateTotal,
  loading,
  closeForm,
  handleSubmit
}: BazarFormProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-green-600">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        {editingEntry ? 'এন্ট্রি সম্পাদনা করুন' : 'নতুন বাজার এন্ট্রি'}
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">তারিখ</label>
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-green-500" />
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-green-900">পণ্যের নাম</th>
              <th className="px-4 py-3 text-left font-semibold text-green-900">ক্যাটাগরি</th>
              <th className="px-4 py-3 text-center font-semibold text-green-900">পরিমাণ</th>
              <th className="px-4 py-3 text-left font-semibold text-green-900">ইউনিট</th>
              <th className="px-4 py-3 text-center font-semibold text-green-900">দাম/ইউনিট</th>
              <th className="px-4 py-3 text-center font-semibold text-green-900">মোট</th>
              <th className="px-4 py-3 text-center font-semibold text-green-900">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b hover:bg-green-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="যেমন: পেঁয়াজ"
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="pcs">pcs</option>
                    <option value="dozen">dozen</option>
                    <option value="gram">gram</option>
                    <option value="bottle">bottle</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={item.unitPrice || ''}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3 text-center font-semibold text-green-600">
                  ৳{(item.quantity * item.unitPrice).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    disabled={items.length === 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addItemRow}
        className="mb-6 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2 font-semibold"
      >
        <Plus size={18} /> আইটেম যোগ করুন
      </button>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">নোট</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="কোনো মন্তব্য থাকলে লিখুন..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          মোট: <span className="text-green-600">৳{calculateTotal().toFixed(2)}</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={closeForm}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            disabled={loading}
          >
            বাতিল করুন
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {loading && <Loader size={18} className="animate-spin" />}
            {loading ? 'পাঠাচ্ছে...' : (editingEntry ? 'আপডেট করুন' : 'সংরক্ষণ করুন')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BazarForm;